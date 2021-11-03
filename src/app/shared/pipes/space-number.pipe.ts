import { Pipe, PipeTransform } from '@angular/core';

// e.g. from 1234567 => 1 234 567
@Pipe({
  name: 'spaceNumber'
})
export class SpaceNumberPipe implements PipeTransform {

  transform(value: string | number): string {
    return value.toString().replace(/(?!^)(?=(?:\d{3})+$)/g, ' ');
  }

}
