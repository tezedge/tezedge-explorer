import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Theme } from '@shared/types/core/theme-switcher/theme.type';
import { DOCUMENT } from '@angular/common';

const DARK_THEME: Theme = {
  name: 'dark',
  cssVariables: {
    '--background-base': '#1b1b1d',
    '--background-surface': '#2a2a2e',
    '--background-surface-fade-1': '#333334',
    '--background-surface-fade-2': '#3f3f43',
    '--background-surface-strong': '#232326',
    '--foreground': '#fff',
    '--foreground-1': 'rgba(255,255,255,0.1)',
    '--foreground-2': 'rgba(255,255,255,0.2)',
    '--foreground-4': 'rgba(255,255,255,0.4)',
    '--foreground-5': 'rgba(255,255,255,0.5)',
    '--foreground-6': 'rgba(255,255,255,0.6)',
    '--foreground-7': 'rgba(255,255,255,0.7)',
    '--foreground-9': 'rgba(255,255,255,0.9)',
    '--active-surface': '#204e8a',
    '--table-hovered-row-background': '#555558',
  }
};

const LIGHT_THEME: Theme = {
  name: 'light',
  cssVariables: {
    '--background-base': '#f5f9fc',
    '--background-surface': '#fefefe',
    '--background-surface-fade-1': '#e1e1e1',
    '--background-surface-fade-2': '#cacaca',
    '--background-surface-strong': '#fff',
    '--foreground': '#000',
    '--foreground-1': 'rgba(0,0,0,0.1)',
    '--foreground-2': 'rgba(0,0,0,0.2)',
    '--foreground-4': 'rgba(0,0,0,0.4)',
    '--foreground-5': 'rgba(0,0,0,0.5)',
    '--foreground-6': 'rgba(0,0,0,0.6)',
    '--foreground-7': 'rgba(0,0,0,0.7)',
    '--foreground-9': 'rgba(0,0,0,0.9)',
    '--active-surface': '#204E8A',
  }
};

export const THEMES: Theme[] = [DARK_THEME, LIGHT_THEME];

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherService {

  private readonly renderer: Renderer2;

  constructor(@Inject(DOCUMENT) private document: Document,
              rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  loadThemes(): Promise<void> {
    this.document.body.classList.add('theme-dark');
    return new Promise<void>((resolve) => {
      const style = this.renderer.createElement('style');
      style.type = 'text/css';
      style.textContent = this.buildThemesCss();
      style.onload = () => resolve();
      this.renderer.appendChild(this.document.head, style);
    });
  }

  private buildThemesCss(): string {
    let css = '';

    THEMES.forEach((theme: Theme) => {
      css += '.theme-' + theme.name + '{';
      Object.keys(theme.cssVariables).forEach((key: string) => {
        css += `${key}:${theme.cssVariables[key]};`;
      });
      css += '}';
    });

    return css;
  }
}
