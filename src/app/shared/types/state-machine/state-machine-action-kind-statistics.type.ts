export interface StateMachineActionKindStatistics {
  kind: string;
  calls: number;
  duration: number;
  callsSquares: number;
  durationSquares: number;
  durationWidth: number;
  callsWidth: number;
}
