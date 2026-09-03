import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonLinkComponent } from '../button-link/button-link.component';
import { MediaAsset } from '../../content/media-asset';

export type ComingSoonVariant = 'light' | 'dark';

@Component({
  selector: 'app-coming-soon-page',
  imports: [ButtonLinkComponent],
  templateUrl: './coming-soon-page.component.html',
  styleUrl: './coming-soon-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoonPageComponent {
  readonly section = input<string>();
  readonly eyebrow = input<string>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly description = input<string>();
  readonly secondaryText = input<string>();
  readonly image = input<MediaAsset>();
  readonly imageAlt = input('');
  readonly variant = input<ComingSoonVariant>('light');
  readonly ctaLabel = input<string>();
  readonly ctaRoute = input<string>();

  protected objectPosition(): string {
    const focal = this.image()?.focalPoint;
    return focal ? `${focal.x * 100}% ${focal.y * 100}%` : 'center';
  }
}
