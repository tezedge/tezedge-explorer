export class NetworkActionDetails {
  id: number;
  message: any; // we can't control the message; it can have different shapes for each record
  hexValues: string[][];
  error: string;
}
