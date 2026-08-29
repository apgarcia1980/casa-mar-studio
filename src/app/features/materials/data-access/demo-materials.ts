import { Material } from '../models/material.model';

export const DEMO_MATERIALS: readonly Material[] = [
  {
    id: 'demo-material-stone',
    slug: { en: 'demo-stone', es: 'piedra-demo' },
    name: { en: 'Stone sample — Demo', es: 'Muestra de piedra — Demo' },
    description: { en: 'Technical placeholder material.', es: 'Material técnico provisional.' },
    category: 'stone',
    projectIds: ['demo-project-001'],
    spaceIds: ['demo-space-kitchen'],
    seo: { noIndex: true },
  },
];
