import { SettingsNodeEntity } from './settings-node-entity.type';
import { SettingsNodeApi } from './settings-node-api.type';

export class SettingsNode {
  api: SettingsNodeApi;
  ids: string[];
  entities: { [node: string]: SettingsNodeEntity };
  sandbox?: string;
}
