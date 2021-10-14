import { Component, OnChanges } from '@angular/core';
import { NgxJsonViewerComponent } from 'ngx-json-viewer';
import { Segment } from 'ngx-json-viewer/src/ngx-json-viewer/ngx-json-viewer.component';

@Component({
  selector: 'tezedge-ngx-json-viewer',
  templateUrl: './tezedge-ngx-json-viewer.component.html',
  styleUrls: ['./tezedge-ngx-json-viewer.component.scss']
})
export class TezedgeNgxJsonViewerComponent extends NgxJsonViewerComponent implements OnChanges {

  ngOnChanges(): void {
    this.segments = [];

    // remove cycles
    this.json = this['decycle'](this.json);

    this._currentDepth++;

    if (typeof this.json === 'object') {
      Object.keys(this.json).forEach(key => {
        this.segments.push(this.customParseKeyValue(key, this.json[key]));
      });
    } else {
      this.segments.push(this.customParseKeyValue(`(${typeof this.json})`, this.json));
    }
  }

  private customParseKeyValue(key: any, value: any): Segment {
    const segment: Segment = this['parseKeyValue'](key, value);
    if (typeof segment.value === 'string' && Number(segment.value) >= 10000000000000000) {
      segment.type = 'number';
      segment.description = '' + segment.value;
    }
    return segment;
  }
}
