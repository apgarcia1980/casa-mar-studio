import { MediaAsset } from '../../../shared/content/media-asset';
import { Space, SpaceKind } from '../models/space.model';

const demoSpaceImage: MediaAsset = {
  id: 'demo-space-kitchen',
  src: '/media/spaces/kitchen.jpg',
  width: 1600,
  height: 2000,
  sources: [{ src: '/media/spaces/kitchen.jpg', type: 'image/jpeg', width: 1600 }],
  focalPoint: { x: 0.5, y: 0.5 },
  decorative: false,
  alt: {
    en: 'Contemporary kitchen with a marble island and natural light.',
    es: 'Cocina contemporánea con isla de mármol y luz natural.',
  },
};

const demoSpaceImages: Readonly<Record<SpaceKind, MediaAsset>> = {
  kitchen: demoSpaceImage,
  closet: {
    id: 'demo-space-closet',
    src: '/media/spaces/closet.jpg',
    width: 1600,
    height: 1065,
    sources: [{ src: '/media/spaces/closet.jpg', type: 'image/jpeg', width: 1600 }],
    focalPoint: { x: 0.5, y: 0.5 },
    decorative: false,
    alt: {
      en: 'Warm timber walk-in closet with integrated storage.',
      es: 'Vestidor cálido de madera con almacenaje integrado.',
    },
  },
  bathroom: {
    id: 'demo-space-bathroom',
    src: '/media/spaces/bathroom.jpg',
    width: 1600,
    height: 900,
    sources: [{ src: '/media/spaces/bathroom.jpg', type: 'image/jpeg', width: 1600 }],
    focalPoint: { x: 0.5, y: 0.5 },
    decorative: false,
    alt: {
      en: 'Stone bathroom with a freestanding bath and shower.',
      es: 'Baño de piedra con bañera exenta y ducha.',
    },
  },
  'living-space': {
    id: 'demo-space-living',
    src: '/media/spaces/living-space.jpg',
    width: 1600,
    height: 1067,
    sources: [{ src: '/media/spaces/living-space.jpg', type: 'image/jpeg', width: 1600 }],
    focalPoint: { x: 0.5, y: 0.5 },
    decorative: false,
    alt: {
      en: 'Light-filled living space with contemporary furnishings.',
      es: 'Salón luminoso con mobiliario contemporáneo.',
    },
  },
  outdoor: {
    id: 'demo-space-outdoor',
    src: '/media/spaces/outdoor.jpg',
    width: 1600,
    height: 2392,
    sources: [{ src: '/media/spaces/outdoor.jpg', type: 'image/jpeg', width: 1600 }],
    focalPoint: { x: 0.5, y: 0.52 },
    decorative: false,
    alt: {
      en: 'Outdoor lounge framed by tropical planting and mountain landscape.',
      es: 'Salón exterior enmarcado por vegetación tropical y paisaje de montaña.',
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
