import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { buildLocalizedPath, RouteId } from '../../core/i18n/route-registry';
import { TranslationService } from '../../core/i18n/translation.service';
import { LanguageSwitcherComponent } from '../../shared/ui/language-switcher/language-switcher.component';
import { ThemeSwitcherComponent } from '../../shared/ui/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, LanguageSwitcherComponent, ThemeSwitcherComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly i18n = inject(TranslationService);
  protected readonly locale = this.i18n.locale;
  protected readonly RouteId = RouteId;

  protected path(routeId: RouteId): string {
    return buildLocalizedPath(routeId, this.locale());
  }
}
