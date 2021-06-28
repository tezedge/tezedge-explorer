import { SettingsNodeEntity } from './settings-node-entity.type';
import { SettingsNodeApi } from './settings-node-api.type';

export interface SettingsNode {
  activeNode: SettingsNodeApi;
  ids: string[];
  entities: { [node: string]: SettingsNodeEntity };
}
