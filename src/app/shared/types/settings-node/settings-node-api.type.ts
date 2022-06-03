export class SettingsNodeApi {
  id: string;
  type: 'tezedge' | 'octez';
  name: string;
  http: string;
  debugger: string;
  monitoring: string;
  connected: boolean | string;
  tzstats: string;
  features: { name: string, [p: string]: any }[];
}
