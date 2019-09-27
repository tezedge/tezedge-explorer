import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bandwidth'
})
export class BandwidthPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {

    let postfix = args[0] ? '/' + args[0] : '';
    let speed = Math.floor(value);
    let result = '';

    if (speed < 1000) {
      result = (speed) + ' B' + postfix
    } else if (speed < 1000000) {
      result = (speed / 1000).toFixed(2) + ' kB' + postfix
    } else if (speed < 1000000000) {
      result = (speed / 1000000).toFixed(2) + ' MB' + postfix
    } else if (speed < 1000000000000) {
      result = (speed / 1000000000).toFixed(2) + ' GB' + postfix
    }

    return result;
  }

}
