import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  ElementRef,
  Input,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

export interface DepthGalleryItem {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly colors: readonly [string, string, string];
}

const BACKGROUND_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const BACKGROUND_FRAGMENT = `
  uniform vec3 uBackground;
  uniform vec3 uBlobOne;
  uniform vec3 uBlobTwo;
  uniform float uTime;
  uniform float uVelocity;
  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float time = uTime * 0.00008;
    vec2 firstCenter = vec2(-0.34 + sin(time) * 0.08, 0.18 + cos(time * 0.8) * 0.08);
    vec2 secondCenter = vec2(0.39 + cos(time * 0.7) * 0.1, -0.22 + sin(time) * 0.06);
    float firstBlob = smoothstep(0.72 + uVelocity * 0.08, 0.05, distance(uv, firstCenter));
    float secondBlob = smoothstep(0.68 + uVelocity * 0.1, 0.04, distance(uv, secondCenter));
    vec3 color = mix(uBackground, uBlobOne, firstBlob * 0.45);
    color = mix(color, uBlobTwo, secondBlob * 0.38);
    color += (noise(vUv * 160.0) - 0.5) * 0.018;
    gl_FragColor = vec4(color, 1.0);
  }
`;

@Component({
  selector: 'app-depth-gallery',
  templateUrl: './depth-gallery.component.html',
  styleUrl: './depth-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepthGalleryComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) items: readonly DepthGalleryItem[] = [];
  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('host', { static: true }) private readonly hostRef!: ElementRef<HTMLElement>;

  protected activeIndex = 0;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private backgroundScene: THREE.Scene | null = null;
  private backgroundCamera: THREE.OrthographicCamera | null = null;
  private backgroundMaterial: THREE.ShaderMaterial | null = null;
  private planes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
  private textures: THREE.Texture[] = [];
  private frameId = 0;
  private resizeObserver: ResizeObserver | null = null;
  private scrollTarget = 0;
  private scrollCurrent = 0;
  private previousScroll = 0;
  private velocity = 0;
  private pointerTarget = new THREE.Vector2();
  private pointerCurrent = new THREE.Vector2();
  private readonly planeGap = 5;
  private readonly maxScroll = () => Math.max(0, (this.items.length - 1) * this.planeGap * 100);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.items.length) return;
    this.initialize();
  }

  ngOnDestroy(): void {
    // Angular also destroys components while rendering on the server, where
    // requestAnimationFrame, ResizeObserver and DOM event APIs do not exist.
    if (!isPlatformBrowser(this.platformId)) return;

    cancelAnimationFrame(this.frameId);
    this.resizeObserver?.disconnect();
    this.hostRef.nativeElement.removeEventListener('wheel', this.onWheel);
    this.hostRef.nativeElement.removeEventListener('pointermove', this.onPointerMove);
    this.hostRef.nativeElement.removeEventListener('pointerleave', this.onPointerLeave);
    this.textures.forEach((texture) => texture.dispose());
    this.planes.forEach((plane) => {
      plane.geometry.dispose();
      plane.material.dispose();
    });
    this.backgroundMaterial?.dispose();
    this.renderer?.dispose();
  }

  protected select(index: number): void {
    this.scrollTarget = THREE.MathUtils.clamp(index * this.planeGap * 100, 0, this.maxScroll());
  }

  private initialize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.autoClear = false;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, 6);
    this.backgroundScene = new THREE.Scene();
    this.backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.setBackground();
    this.loadPlanes();
    this.resize();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.hostRef.nativeElement);
    this.hostRef.nativeElement.addEventListener('wheel', this.onWheel, { passive: false });
    this.hostRef.nativeElement.addEventListener('pointermove', this.onPointerMove, { passive: true });
    this.hostRef.nativeElement.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    this.render(performance.now());
  }

  private setBackground(): void {
    if (!this.backgroundScene) return;
    const initial = this.items[0].colors;
    this.backgroundMaterial = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uBackground: { value: new THREE.Color(initial[0]) },
        uBlobOne: { value: new THREE.Color(initial[1]) },
        uBlobTwo: { value: new THREE.Color(initial[2]) },
        uTime: { value: 0 },
        uVelocity: { value: 0 },
      },
      vertexShader: BACKGROUND_VERTEX,
      fragmentShader: BACKGROUND_FRAGMENT,
    });
    this.backgroundScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.backgroundMaterial));
  }

  private loadPlanes(): void {
    if (!this.scene) return;
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.PlaneGeometry(3, 3);
    this.items.forEach((item, index) => {
      loader.load(item.image, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        this.textures.push(texture);
        const aspect = texture.image.width / texture.image.height;
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
        const plane = new THREE.Mesh(geometry.clone(), material);
        plane.scale.set(aspect, 1, 1);
        plane.userData['aspect'] = aspect;
        plane.position.set(index % 2 === 0 ? -0.78 : 0.78, 0, -index * this.planeGap);
        plane.rotation.z = index % 2 === 0 ? -0.035 : 0.035;
        this.scene?.add(plane);
        this.planes[index] = plane;
      });
    });
  }

  private resize(): void {
    if (!this.renderer || !this.camera) return;
    const { clientWidth: width, clientHeight: height } = this.hostRef.nativeElement;
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private readonly onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    this.scrollTarget = THREE.MathUtils.clamp(this.scrollTarget + event.deltaY, 0, this.maxScroll());
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    const bounds = this.hostRef.nativeElement.getBoundingClientRect();
    this.pointerTarget.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -((event.clientY - bounds.top) / bounds.height * 2 - 1));
  };

  private readonly onPointerLeave = (): void => {
    this.pointerTarget.set(0, 0);
  };

  private render = (time: number): void => {
    this.frameId = requestAnimationFrame(this.render);
    if (!this.renderer || !this.scene || !this.camera || !this.backgroundScene || !this.backgroundCamera || !this.backgroundMaterial) return;

    this.scrollCurrent = THREE.MathUtils.lerp(this.scrollCurrent, this.scrollTarget, 0.08);
    const rawVelocity = this.scrollCurrent - this.previousScroll;
    this.velocity = THREE.MathUtils.lerp(this.velocity, rawVelocity, 0.12);
    this.previousScroll = this.scrollCurrent;
    const depth = this.scrollCurrent / 100;
    this.camera.position.z = 6 - depth;
    this.pointerCurrent.lerp(this.pointerTarget, 0.08);

    const normalizedDepth = THREE.MathUtils.clamp(depth / this.planeGap, 0, this.items.length - 1);
    const current = Math.floor(normalizedDepth);
    const next = Math.min(current + 1, this.items.length - 1);
    const blend = normalizedDepth - current;
    const nextActiveIndex = blend > 0.5 ? next : current;
    if (nextActiveIndex !== this.activeIndex) {
      this.activeIndex = nextActiveIndex;
      this.changeDetector.markForCheck();
    }
    this.blendBackground(current, next, blend, time);

    this.planes.forEach((plane, index) => {
      if (!plane) return;
      const opacity = index === current ? 1 - blend : index === next ? blend : 0;
      plane.material.opacity = THREE.MathUtils.lerp(plane.material.opacity, opacity, 0.16);
      const influence = opacity * (1 + index * 0.05);
      plane.position.x = (index % 2 === 0 ? -0.78 : 0.78) + this.pointerCurrent.x * 0.16 * influence;
      plane.position.y = this.pointerCurrent.y * 0.08 * influence + THREE.MathUtils.clamp(this.velocity / 120, -0.08, 0.08);
      plane.rotation.z = (index % 2 === 0 ? -0.035 : 0.035) + this.pointerCurrent.x * 0.03 * influence;
      const scale = 1 + Math.min(Math.abs(this.velocity) / 2500, 0.035);
      const aspect = plane.userData['aspect'] as number;
      plane.scale.set(aspect * scale, scale, 1);
    });

    this.renderer.clear(true, true, true);
    this.renderer.render(this.backgroundScene, this.backgroundCamera);
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);
  };

  private blendBackground(current: number, next: number, blend: number, time: number): void {
    if (!this.backgroundMaterial) return;
    const currentColors = this.items[current].colors;
    const nextColors = this.items[next].colors;
    const uniforms = this.backgroundMaterial.uniforms;
    (uniforms['uBackground'].value as THREE.Color).set(currentColors[0]).lerp(new THREE.Color(nextColors[0]), blend);
    (uniforms['uBlobOne'].value as THREE.Color).set(currentColors[1]).lerp(new THREE.Color(nextColors[1]), blend);
    (uniforms['uBlobTwo'].value as THREE.Color).set(currentColors[2]).lerp(new THREE.Color(nextColors[2]), blend);
    uniforms['uTime'].value = time;
    uniforms['uVelocity'].value = Math.min(Math.abs(this.velocity) / 100, 1);
  }
}
