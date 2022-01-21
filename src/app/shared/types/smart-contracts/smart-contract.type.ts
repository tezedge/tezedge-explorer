export interface SmartContract {
  id: number;
  hash: string;
  calls: number;
  code: string;
  codeParameter?: string[];
}
