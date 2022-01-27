export interface MempoolBlockStepTimes {
  precheckStart: number;
  precheckEnd: number;

  downloadBlockHeaderStart: number;
  downloadBlockHeaderEnd: number;

  downloadBlockOperationsStart: number;
  downloadBlockOperationsEnd: number;

  loadDataStart: number;
  loadDataEnd: number;

  applyBlockStart: number;
  applyBlockEnd: number;

  storeResultStart: number;
  storeResultEnd: number;

  sendStart: number;
  sendEnd: number;

  protocolTimes: {
    applyStart: number;

    operationsDecodingStart: number;
    operationsDecodingEnd: number;

    operationsMetadataEncodingStart: number;
    operationsMetadataEncodingEnd: number;

    beginApplicationStart: number;
    beginApplicationEnd: number;

    finalizeBlockStart: number;
    finalizeBlockEnd: number;

    collectNewRollsOwnerSnapshotsStart: number;
    collectNewRollsOwnerSnapshotsEnd: number;

    commitStart: number;
    commitEnd: number;

    applyEnd: number;
  };
}
