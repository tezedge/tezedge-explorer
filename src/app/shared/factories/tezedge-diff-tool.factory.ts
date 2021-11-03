import { Injectable } from '@angular/core';
import { NgxObjectDiffService } from 'ngx-object-diff';

@Injectable({
  providedIn: 'root'
})
export class TezedgeDiffToolFactory {

  private readonly delEndingTag = '</del>';
  private readonly insEndingTag = '</ins>';
  private readonly delStart = '<del class="diff diff-key">';
  private readonly insStart = '<ins class="diff diff-key">';
  private readonly insDiffStart = '<ins class="diff">';
  private readonly insEnd = '</ins>';
  private readonly spanInside = '<span>: </span>';

  constructor(private objectDiff: NgxObjectDiffService) {
    this.objectDiff.setOpenChar('');
    this.objectDiff.setCloseChar('');
  }

  getDifferences(currentObj: object, previousObj: object): string {
    const diff = this.objectDiff.diff(previousObj || {}, currentObj || {});
    let innerHTML = this.objectDiff.toJsonDiffView(diff);
    const findAllOccurrencesReversed = (str: string, substr: string): number[] => {
      str = str.toLowerCase();
      const result: number[] = [];
      let idx: number = str.indexOf(substr);
      while (idx !== -1) {
        result.push(idx);
        idx = str.indexOf(substr, idx + 1);
      }
      return result.reverse();
    };
    innerHTML = innerHTML
      .split('</del><span>,</span>').join(this.delEndingTag)
      .split('</ins><span>,</span>').join(this.insEndingTag)
      .split('<span>,</span>').join('')
      .split('<span></span>\n').join('');
    findAllOccurrencesReversed(innerHTML, this.delStart).forEach(index => {
      const delContentStartIdx = index + this.delStart.length;
      const spanDelEndLimit = delContentStartIdx + innerHTML.substr(delContentStartIdx).indexOf(this.spanInside) + this.spanInside.length;
      const delContentEndIdx = delContentStartIdx + innerHTML.substr(delContentStartIdx).indexOf(this.delEndingTag);
      let oldValue = innerHTML.substring(spanDelEndLimit, delContentEndIdx);
      oldValue = TezedgeDiffToolFactory.removeQuotesFromBigNumber(oldValue);
      const oldValueTag = '<div class="old-value">' + oldValue + '</div>';
      innerHTML = innerHTML.substring(0, spanDelEndLimit) + oldValueTag + innerHTML.substring(delContentEndIdx);
    });
    findAllOccurrencesReversed(innerHTML, this.delStart).forEach(index => {
      const delContentStartIdx = index + this.delStart.length;
      const delContentEndIdx = delContentStartIdx + innerHTML.substr(delContentStartIdx).indexOf(this.delEndingTag);
      const nextInsTagStart = delContentEndIdx + innerHTML.substr(delContentEndIdx).indexOf(this.delEndingTag) + this.delEndingTag.length + 1;
      const nextInsTagEnd = delContentEndIdx + innerHTML.substr(delContentEndIdx).indexOf(this.insEndingTag) + this.insEndingTag.length;
      const nextInsTag = innerHTML.substring(nextInsTagStart, nextInsTagEnd);
      innerHTML = innerHTML.substring(0, delContentEndIdx) + nextInsTag + innerHTML.substring(delContentEndIdx);
      innerHTML = innerHTML.substring(0, nextInsTagStart + nextInsTag.length - 1) + innerHTML.substring(nextInsTagEnd + nextInsTag.length);
    });
    findAllOccurrencesReversed(innerHTML, this.insStart).forEach(index => {
      const insContentStartIdx = index + this.insStart.length;
      const spanInsEndLimit = innerHTML.substr(insContentStartIdx).indexOf(this.spanInside) + this.spanInside.length;
      innerHTML = innerHTML.substring(0, insContentStartIdx) + innerHTML.substring(insContentStartIdx + spanInsEndLimit);
    });
    // search which has del right near div.diff-level and wrap all dels inside a div
    // this covers case when multiple entries has been replaced by a single new one
    const diffLevel = '<div class="diff-level"><del';
    findAllOccurrencesReversed(innerHTML, diffLevel).forEach(index => {
      const divContentStart = index + diffLevel.length - 4;
      const indexOfInsDiffStart = innerHTML.substr(divContentStart).indexOf(this.insDiffStart);
      const indexOfIns = innerHTML.substr(divContentStart).indexOf('<ins');
      if (indexOfInsDiffStart !== -1 && indexOfInsDiffStart === indexOfIns) {
        const insTagStart = divContentStart + indexOfInsDiffStart;
        innerHTML = innerHTML.substring(0, divContentStart)
          + '<div class="group-del">'
          + innerHTML.substring(divContentStart, insTagStart)
          + '</div>'
          + innerHTML.substring(insTagStart);
      }
    });
    findAllOccurrencesReversed(innerHTML, this.insStart).forEach(index => {
      const insContentStartIdx = index + this.insStart.length;
      const insContentEndIdx = insContentStartIdx + innerHTML.substr(insContentStartIdx).indexOf(this.insEnd);
      let insContent = innerHTML.substring(insContentStartIdx, insContentEndIdx);
      insContent = TezedgeDiffToolFactory.removeQuotesFromBigNumber(insContent);
      innerHTML = innerHTML.substring(0, insContentStartIdx) + insContent + innerHTML.substring(insContentEndIdx);
    });
    return innerHTML;
  }

  private static removeQuotesFromBigNumber(text: string): string {
    // for big numbers wrapped in strings, remove quotes to be shown as numbers; 17 characters is min + 2 quotes = 19 min
    if (/"(\d+)"/.test(text) && text.length >= 19) {
      text = text.slice(1, text.length - 1);
    }
    return text;
  }
}
