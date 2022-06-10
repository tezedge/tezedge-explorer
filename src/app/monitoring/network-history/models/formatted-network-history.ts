// these will be removed when the logic will be moved to the backend

export class FormattedNetworkHistory {
  id: number;
  votingPeriodRows: Array<VotingPeriodRow>;
}

export class VotingPeriodRow {
  id: number;
  cycles: Array<VotingCycle>;
}

export class VotingCycle {
  id: number;
  headers: number;
  operations: number;
  applications: number;
  duration: number;
}

