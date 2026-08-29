import { Location } from '../models/location.model';

export const DEMO_LOCATIONS: readonly Location[] = [
  {
    id: 'demo-location-technical',
    slug: { en: 'technical-location-demo', es: 'ubicacion-tecnica-demo' },
    name: { en: 'Technical location — Demo', es: 'Ubicación técnica — Demo' },
    region: { en: 'Non-public fixture', es: 'Fixture no público' },
    projectIds: ['demo-project-001'],
    serviceIds: ['demo-service-design'],
    seo: { noIndex: true },
  },
];
