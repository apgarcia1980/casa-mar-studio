import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { buildLocalizedPath, RouteId } from '../../core/i18n/route-registry';
import { localeFromPath } from '../../core/i18n/locale.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { TranslationKey } from '../../core/i18n/translation.types';
import { LanguageSwitcherComponent } from '../../shared/ui/language-switcher/language-switcher.component';
import { ThemeSwitcherComponent } from '../../shared/ui/theme-switcher/theme-switcher.component';

interface NavigationItem {
  readonly routeId: RouteId;
  readonly label: TranslationKey;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LanguageSwitcherComponent, ThemeSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('mobileMenu');
  private readonly menuTrigger = viewChild<ElementRef<HTMLButtonElement>>('menuTrigger');
  protected readonly i18n = inject(TranslationService);
  protected readonly RouteId = RouteId;
  protected readonly locale = this.i18n.locale;
  protected readonly isHome = signal(this.routeIsHome(this.router.url));
  protected readonly menuOpen = signal(false);
  protected readonly navigation: readonly NavigationItem[] = [
    { routeId: RouteId.Projects, label: 'navigation.projects' },
    { routeId: RouteId.Spaces, label: 'navigation.spaces' },
    { routeId: RouteId.Materials, label: 'navigation.materials' },
    { routeId: RouteId.Studio, label: 'navigation.studio' },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.isHome.set(this.routeIsHome(event.urlAfterRedirects));
        this.closeMenu(false);
      });
  }

  protected path(routeId: RouteId): string {
    return buildLocalizedPath(routeId, this.locale());
  }

  protected openMenu(): void {
    const dialog = this.dialog()?.nativeElement;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    this.menuOpen.set(true);
  }

  protected closeMenu(restoreFocus = true): void {
    const dialog = this.dialog()?.nativeElement;
    if (dialog?.open) dialog.close();
    this.menuOpen.set(false);
    if (restoreFocus) this.menuTrigger()?.nativeElement.focus();
  }

  protected onDialogClosed(): void {
    const wasOpen = this.menuOpen();
    this.menuOpen.set(false);
    if (wasOpen) this.menuTrigger()?.nativeElement.focus();
  }

  private routeIsHome(url: string): boolean {
    const path = url.split(/[?#]/)[0];
    return path === buildLocalizedPath(RouteId.Home, localeFromPath(url));
  }
}
