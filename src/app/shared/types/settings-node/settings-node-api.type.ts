export class SettingsNodeApi {
  id: string;
  type: 'tezedge' | 'octez';
  name: string;
  http: string;
  debugger: string;
  ws: boolean | string;
  monitoring: string;
  connected: boolean | string;
  features: { name: string, [p: string]: any }[];
}
