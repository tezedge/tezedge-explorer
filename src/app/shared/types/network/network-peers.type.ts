import { NetworkPeersMetrics } from './network-peers-metrics.type';
import { NetworkPeersEntity } from './network-peers-entity.type';

export class NetworkPeers {
  ids: string[];
  entities: { [entityId: string]: NetworkPeersEntity };
  metrics: NetworkPeersMetrics;
}
