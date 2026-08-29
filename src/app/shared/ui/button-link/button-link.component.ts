import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonVariant } from '../button/button.component';

@Component({
  selector: 'app-button-link',
  imports: [RouterLink],
  templateUrl: './button-link.component.html',
  styleUrl: './button-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonLinkComponent {
  readonly path = input.required<string>();
  readonly variant = input<ButtonVariant>('primary');
  readonly accessibleName = input<string>();
}
