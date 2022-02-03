import { animate, style, transition, trigger } from '@angular/animations';

export const refreshBlock = trigger('refreshBlock', [
  transition('* => *', [
    style({ backgroundColor: 'lightgray' }),
    animate(250, style({ backgroundColor: 'transparent' })),
  ]),
]);

