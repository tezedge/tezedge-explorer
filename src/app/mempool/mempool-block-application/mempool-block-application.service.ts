import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { toReadableDate } from '@helpers/date.helper';
import { MempoolBlockApplicationChartLine } from '@shared/types/mempool/block-application/mempool-block-application-chart-line.type';

@Injectable({
  providedIn: 'root'
})
export class MempoolBlockApplicationService {

  constructor(private http: HttpClient) { }

  getBlockApplication(api: string): Observable<MempoolBlockApplicationChartLine[]> {
    const limit = 2000;
    const url = `${api}/dev/shell/automaton/block_stats/graph?limit=${limit}`;
    return this.http.get<MempoolBlockApplicationChartLine[]>(url).pipe(
      map((blocks: any[]) => {
        const chartLines = [
          { name: 'Total time', series: [] },
          { name: 'Data ready', series: [] },
          { name: 'Load data', series: [] },
          { name: 'Apply block', series: [] },
          { name: 'Store result', series: [] },
        ];

        blocks
          .forEach(block => {
            const name = block.block_level.toString();
            chartLines[0].series.push({
              name,
              value: Math.max(Math.log10(block.data_ready + block.load_data + block.apply_block + block.store_result), 0),
              timestamp: toReadableDate(block.block_first_seen),
            });
            chartLines[1].series.push({
              name,
              value: Math.max(Math.log10(block.data_ready), 0),
            });
            chartLines[2].series.push({
              name,
              value: Math.max(Math.log10(block.load_data), 0),
            });
            chartLines[3].series.push({
              name,
              value: Math.max(Math.log10(block.apply_block), 0),
            });
            chartLines[4].series.push({
              name,
              value: Math.max(Math.log10(block.store_result), 0),
            });
          });

        return chartLines;
      })
    );
  }
}
