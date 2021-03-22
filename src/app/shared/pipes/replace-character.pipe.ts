import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceCharacter'
})
export class ReplaceCharacterPipe implements PipeTransform {

  transform(value: string, stringToReplace: string, replaceValue: string): string {
    return value.split(stringToReplace).join(replaceValue);
  }

}
