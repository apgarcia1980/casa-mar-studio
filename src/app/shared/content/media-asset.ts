import { LocalizedValue } from './localized-value';

export interface MediaSource {
  readonly src: string;
  readonly type: 'image/avif' | 'image/webp' | 'image/jpeg' | 'image/png';
  readonly width?: number;
}

export interface MediaFocalPoint {
  readonly x: number;
  readonly y: number;
}

interface MediaAssetBase {
  readonly id: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly sources?: readonly MediaSource[];
  readonly focalPoint?: MediaFocalPoint;
  readonly credit?: string;
}

export type MediaAsset = MediaAssetBase &
  (
    | { readonly decorative: true; readonly alt?: never }
    | { readonly decorative: false; readonly alt: LocalizedValue<string> }
  );
