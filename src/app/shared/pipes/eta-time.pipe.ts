import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'etaTime'
})
export class EtaTimePipe implements PipeTransform {

  transform(value: string): string {


    return null;
  }

}
