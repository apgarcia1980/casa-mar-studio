import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationService } from '../../core/i18n/translation.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-site-shell',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './site-shell.component.html',
  styleUrl: './site-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteShellComponent {
  protected readonly i18n = inject(TranslationService);
}
