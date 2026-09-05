import { MediaAsset } from '../../../shared/content/media-asset';
import { Space, SpaceKind } from '../models/space.model';

const demoSpaceImage: MediaAsset = {
  id: 'demo-space-kitchen-editorial',
  src: '/media/spaces/kitchen-editorial.png',
  width: 1536,
  height: 1024,
  sources: [{ src: '/media/spaces/kitchen-editorial.png', type: 'image/png', width: 1536 }],
  focalPoint: { x: 0.5, y: 0.5 },
  decorative: false,
  alt: {
      en: 'Contemporary kitchen with a pale stone island and warm oak joinery.',
      es: 'Cocina contemporánea con isla de piedra clara y carpintería de roble.',
  },
};

const demoSpaceImages: Readonly<Record<SpaceKind, MediaAsset>> = {
  kitchen: demoSpaceImage,
  closet: {
    id: 'demo-space-closet-editorial',
    src: '/media/spaces/closet-editorial.png',
    width: 1536,
    height: 1024,
    sources: [{ src: '/media/spaces/closet-editorial.png', type: 'image/png', width: 1536 }],
    focalPoint: { x: 0.5, y: 0.5 },
    decorative: false,
    alt: {
      en: 'Warm oak walk-in closet with integrated lighting and storage.',
      es: 'Vestidor de roble cálido con iluminación y almacenaje integrados.',
    },
  },
  bathroom: {
    id: 'demo-space-bathroom-editorial',
    src: '/media/spaces/bathroom-editorial.png',
    width: 1535,
    height: 1024,
    sources: [{ src: '/media/spaces/bathroom-editorial.png', type: 'image/png', width: 1535 }],
    focalPoint: { x: 0.5, y: 0.5 },
    decorative: false,
    alt: {
      en: 'Mediterranean bathroom with a freestanding bath and olive courtyard.',
      es: 'Baño mediterráneo con bañera exenta y patio de olivos.',
    },
  },
  'living-space': {
    id: 'demo-space-living-editorial',
    src: '/media/spaces/living-editorial.png',
    width: 1536,
    height: 1024,
    sources: [{ src: '/media/spaces/living-editorial.png', type: 'image/png', width: 1536 }],
    focalPoint: { x: 0.5, y: 0.5 },
    decorative: false,
    alt: {
      en: 'Light-filled Mediterranean living space with sea views.',
      es: 'Salón mediterráneo luminoso con vistas al mar.',
    },
  },
  outdoor: {
    id: 'demo-space-outdoor-editorial',
    src: '/media/spaces/outdoor-editorial.png',
    width: 1536,
    height: 1024,
    sources: [{ src: '/media/spaces/outdoor-editorial.png', type: 'image/png', width: 1536 }],
    focalPoint: { x: 0.5, y: 0.52 },
    decorative: false,
    alt: {
      en: 'Mediterranean outdoor lounge framed by olive trees and sea.',
      es: 'Salón exterior mediterráneo entre olivos y mar.',
    },
  },
};

interface DemoSpaceContent {
  readonly kind: SpaceKind;
  readonly slug: { readonly en: string; readonly es: string };
  readonly name: { readonly en: string; readonly es: string };
  readonly description: { readonly en: string; readonly es: string };
}

const demoSpaceContent: readonly DemoSpaceContent[] = [
  {
    kind: 'kitchen',
    slug: { en: 'kitchens', es: 'cocinas' },
    name: { en: 'Kitchens', es: 'Cocinas' },
    description: {
      en: 'Spaces shaped around preparation, gathering and the quiet rhythm of daily use.',
      es: 'Espacios concebidos para preparar, reunirse y acompañar el ritmo sereno de cada día.',
    },
  },
  {
    kind: 'closet',
    slug: { en: 'closets', es: 'vestidores' },
    name: { en: 'Closets', es: 'Vestidores' },
    description: {
      en: 'Ordered interiors where proportion, material and considered storage work together.',
      es: 'Interiores ordenados donde proporción, materia y almacenaje dialogan con naturalidad.',
    },
  },
  {
    kind: 'bathroom',
    slug: { en: 'bathrooms', es: 'banos' },
    name: { en: 'Bathrooms', es: 'Baños' },
    description: {
      en: 'Calm, tactile rooms composed through light, water and enduring surfaces.',
      es: 'Estancias serenas y táctiles compuestas mediante luz, agua y superficies duraderas.',
    },
  },
  {
    kind: 'living-space',
    slug: { en: 'living-spaces', es: 'salones' },
    name: { en: 'Living Spaces', es: 'Salones' },
    description: {
      en: 'Open and intimate settings designed for conversation, rest and changing light.',
      es: 'Ambientes abiertos e íntimos pensados para conversar, descansar y recibir la luz cambiante.',
    },
  },
  {
    kind: 'outdoor',
    slug: { en: 'outdoor', es: 'exteriores' },
    name: { en: 'Outdoor', es: 'Exteriores' },
    description: {
      en: 'Thresholds and outdoor rooms that extend the interior into landscape and climate.',
      es: 'Umbrales y estancias exteriores que prolongan el interior hacia el paisaje y el clima.',
    },
  },
];

export const DEMO_SPACES: readonly Space[] = demoSpaceContent.map((space) => ({
  id: `demo-space-${space.kind}`,
  ...space,
  hero: demoSpaceImages[space.kind],
  projectIds: [],
  materialIds: [],
  seo: { noIndex: true },
}));
