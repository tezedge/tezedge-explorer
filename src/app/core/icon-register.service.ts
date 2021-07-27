import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({ providedIn: 'root' })
export class IconRegisterService {

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) { }

  registerIcons(): void {
    this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl(`assets/sprite/icon-set.svg`));
  }
}
