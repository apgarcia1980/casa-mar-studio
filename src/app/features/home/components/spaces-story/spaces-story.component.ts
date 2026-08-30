import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  PinnedRevealComponent,
  PinnedRevealItem,
} from '../../../../shared/ui/pinned-reveal/pinned-reveal.component';
import { Locale } from '../../../../core/i18n/locale.model';
import { localize } from '../../../../shared/content/localized-value';
import { Space } from '../../../spaces/models/space.model';

@Component({
  selector: 'app-spaces-story',
  imports: [PinnedRevealComponent],
  templateUrl: './spaces-story.component.html',
  styleUrl: './spaces-story.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpacesStoryComponent {
  readonly spaces = input.required<readonly Space[]>();
  readonly locale = input.required<Locale>();
  protected readonly backgroundTokens = [
    '--color-background',
    '--color-surface-subtle',
    '--color-surface',
    '--color-surface-subtle',
    '--color-background',
  ] as const;

  protected readonly revealItems = computed<readonly PinnedRevealItem[]>(() =>
    this.spaces().flatMap((space, index) => {
      if (!space.hero) return [];

      return [{
        id: space.id,
        index: String(index + 1).padStart(2, '0'),
        title: localize(space.name, this.locale()),
        description: localize(space.description, this.locale()),
        image: space.hero,
        imageAlt: space.hero.decorative ? '' : localize(space.hero.alt, this.locale()),
      }];
    }),
  );
}
