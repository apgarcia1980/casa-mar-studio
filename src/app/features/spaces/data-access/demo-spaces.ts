import { Space } from '../models/space.model';

export const DEMO_SPACES: readonly Space[] = [
  {
    id: 'demo-space-kitchen',
    kind: 'kitchen',
    slug: { en: 'kitchens-demo', es: 'cocinas-demo' },
    name: { en: 'Kitchens — Demo', es: 'Cocinas — Demo' },
    description: {
      en: 'Technical placeholder space.',
      es: 'Espacio técnico provisional.',
    },
    projectIds: ['demo-project-001'],
    materialIds: ['demo-material-stone'],
    seo: { noIndex: true },
  },
];
