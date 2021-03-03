import { SettingsNodeApi } from './settings-node-api.type';
import { SettingsNodeEntityHeader } from './settings-node-entity-header.type';

export class SettingsNodeEntity extends SettingsNodeApi {
  relativeDateTime: string;
  header: SettingsNodeEntityHeader;
}
