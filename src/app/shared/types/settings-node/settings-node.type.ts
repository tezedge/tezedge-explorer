import { SettingsNodeEntity } from './settings-node-entity.type';
import { SettingsNodeApi } from './settings-node-api.type';

export class SettingsNode {
  activeNode: SettingsNodeApi;
  ids: string[];
  entities: { [node: string]: SettingsNodeEntity };
  debugger: string;
  memoryProfiler: string;
  sandbox?: string;
}
