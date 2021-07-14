import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[var]',
  exportAs: 'var'
})
export class VarDirective {
  [key: string]: any;

  @Input('var') set assign(value: any) {
    if (value) {
      Object.assign(this, value);
    }
  }

}
