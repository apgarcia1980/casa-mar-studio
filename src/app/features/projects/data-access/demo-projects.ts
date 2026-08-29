import { Project } from '../models/project.model';

export const DEMO_PROJECT_ID = 'demo-project-001';

export const DEMO_PROJECTS: readonly Project[] = [
  {
    id: DEMO_PROJECT_ID,
    slug: { en: 'ocean-residence-demo', es: 'residencia-oceano-demo' },
    title: { en: 'Ocean Residence — Demo', es: 'Residencia Océano — Demo' },
    excerpt: {
      en: 'Technical placeholder content used only to validate the content architecture.',
      es: 'Contenido técnico provisional utilizado únicamente para validar la arquitectura.',
    },
    coverImage: {
      id: 'demo-media-project-cover',
      src: '/images/demo/project-cover-placeholder.jpg',
      width: 1600,
      height: 1000,
      decorative: false,
      alt: {
        en: 'Neutral technical placeholder for the demo project',
        es: 'Marcador técnico neutro del proyecto de demostración',
      },
    },
    spaceIds: ['demo-space-kitchen'],
    materialIds: ['demo-material-stone'],
    serviceIds: ['demo-service-design'],
    locationId: 'demo-location-technical',
    featured: true,
    seo: {
      title: { en: 'Ocean Residence — Demo', es: 'Residencia Océano — Demo' },
      noIndex: true,
    },
  },
];
