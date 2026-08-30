import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Locale } from '../../../../core/i18n/locale.model';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { homeSeo } from '../../../../core/seo/home-seo';
import { SeoService } from '../../../../core/seo/seo.service';
import { DEMO_SPACES } from '../../../spaces/data-access/demo-spaces';
import { CinematicHeroComponent } from '../../components/cinematic-hero/cinematic-hero.component';
import { SpacesStoryComponent } from '../../components/spaces-story/spaces-story.component';

@Component({
  selector: 'app-home-page',
  imports: [CinematicHeroComponent, SpacesStoryComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  protected readonly locale = inject(ActivatedRoute).snapshot.data['locale'] as Locale;
  protected readonly i18n = inject(TranslationService);
  protected readonly spaces = DEMO_SPACES;

  constructor() {
    inject(SeoService).apply(homeSeo(this.locale, this.i18n));
  }
}
