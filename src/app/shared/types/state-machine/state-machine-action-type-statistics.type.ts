export interface StateMachineActionTypeStatistics {
  kind: string;
  calls: number;
  duration: number;
  callsSquares: number;
  durationSquares: number;
}
