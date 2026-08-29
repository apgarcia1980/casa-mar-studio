import { Service } from '../models/service.model';

export const DEMO_SERVICES: readonly Service[] = [
  {
    id: 'demo-service-design',
    slug: { en: 'design-demo', es: 'diseno-demo' },
    name: { en: 'Design service — Demo', es: 'Servicio de diseño — Demo' },
    description: { en: 'Technical placeholder service.', es: 'Servicio técnico provisional.' },
    projectIds: ['demo-project-001'],
    seo: { noIndex: true },
  },
];
