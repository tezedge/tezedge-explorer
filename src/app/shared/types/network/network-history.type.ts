import { NetworkHistoryEntity } from './network-history-entity.type';
import { NetworkHistoryDownloadDuration } from './network-history-download-duration.type';

export class NetworkHistory {
  ids: number[];
  entities: { [id: string]: NetworkHistoryEntity };
  downloadDurationSeries: NetworkHistoryDownloadDuration[];
}
