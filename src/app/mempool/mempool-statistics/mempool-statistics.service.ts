import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';
import { MempoolStatisticsOperationNode } from '@shared/types/mempool/statistics/mempool-statistics-operation-node.type';

@Injectable({
  providedIn: 'root'
})
export class MempoolStatisticsService {

  constructor(private http: HttpClient) { }

  private static numOrUndefined(value: number): number | undefined {
    return isNaN(value) ? undefined : value;
  }

  getOperationNodeStats(api: string): Observable<MempoolStatisticsOperation[]> {
    const url = `${api}/dev/shell/automaton/mempool/operation_stats`;
    return this.http.get<MempoolStatisticsOperation[]>(url).pipe(
      // return of({
      //   "opMLA8s1LzvAvnHMfLZz1Q1mgUeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "egMLA8s1LzvAvnHdgtrLZz1Q1mgUeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "egslifjs1LzvAvnHdgtrLZz1Q1mgUeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "alskdeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "alsFERkdeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "WEGdeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "DSGDGSDG4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "QFEQ#@234KPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "SDF9834deqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "WEFU(@*$KPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "fj30rjef4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "LEFJ@)4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "QQQQQqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "WWWWWWWWKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "1alskdeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "1alsFERkdeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "1WEGdeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "1DSGDGSDG4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "1QFEQ#@234KPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "1SDF9834deqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "1WEFU(@*$KPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "1fj30rjef4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "1LEFJ@)4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "1QQQQQqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "1WWWWWWWWKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "2alskdeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "2alsFERkdeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "2WEGdeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "2DSGDGSDG4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "2QFEQ#@234KPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "2SDF9834deqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "2WEFU(@*$KPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "2fj30rjef4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "2LEFJ@)4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "2QQQQQqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "2WWWWWWWWKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "3alskdeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641921249178328800,
      //     "first_block_timestamp": 1641921220,
      //     "validation_started": 29203957754,
      //     "validation_result": [
      //       29208627227,
      //       "Applied",
      //       29204163072,
      //       29208365824
      //     ],
      //     "validations": [
      //       {
      //         "started": 29203789690,
      //         "finished": 29203954265,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 2022370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 29203957754,
      //         "finished": 29208627227,
      //         "preapply_started": 29204163072,
      //         "preapply_ended": 29208365824,
      //         "current_head_level": 2022370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp2mD7uo": {
      //         "received": [
      //           {
      //             "latency": 29497781955,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29210732661,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D2WT": {
      //         "received": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 29342452000,
      //             "block_level": 2022370,
      //             "block_timestamp": 1641921220
      //           }],
      //         "content_received": [
      //           29342452000
      //         ]
      //       }
      //     }
      //   },
      //   "3alsFERkdeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641931349178338800,
      //     "first_block_timestamp": 1641931330,
      //     "validation_started": 39303957754,
      //     "validation_result": [
      //       39308637337,
      //       "Applied",
      //       39304163073,
      //       39308365834
      //     ],
      //     "validations": [
      //       {
      //         "started": 39303789690,
      //         "finished": 39303954365,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 3033370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 39303957754,
      //         "finished": 39308637337,
      //         "preapply_started": 39304163073,
      //         "preapply_ended": 39308365834,
      //         "current_head_level": 3033370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp3mD7uo": {
      //         "received": [
      //           {
      //             "latency": 39497781955,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39310733661,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D3WT": {
      //         "received": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }],
      //         "content_received": [
      //           39343453000
      //         ]
      //       }
      //     }
      //   },
      //   "3WEGdeqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641931349178338800,
      //     "first_block_timestamp": 1641931330,
      //     "validation_started": 39303957754,
      //     "validation_result": [
      //       39308637337,
      //       "Applied",
      //       39304163073,
      //       39308365834
      //     ],
      //     "validations": [
      //       {
      //         "started": 39303789690,
      //         "finished": 39303954365,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 3033370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 39303957754,
      //         "finished": 39308637337,
      //         "preapply_started": 39304163073,
      //         "preapply_ended": 39308365834,
      //         "current_head_level": 3033370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp3mD7uo": {
      //         "received": [
      //           {
      //             "latency": 39497781955,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39310733661,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D3WT": {
      //         "received": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }],
      //         "content_received": [
      //           39343453000
      //         ]
      //       }
      //     }
      //   },
      //   "3DSGDGSDG4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641931349178338800,
      //     "first_block_timestamp": 1641931330,
      //     "validation_started": 39303957754,
      //     "validation_result": [
      //       39308637337,
      //       "Applied",
      //       39304163073,
      //       39308365834
      //     ],
      //     "validations": [
      //       {
      //         "started": 39303789690,
      //         "finished": 39303954365,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 3033370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 39303957754,
      //         "finished": 39308637337,
      //         "preapply_started": 39304163073,
      //         "preapply_ended": 39308365834,
      //         "current_head_level": 3033370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp3mD7uo": {
      //         "received": [
      //           {
      //             "latency": 39497781955,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39310733661,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D3WT": {
      //         "received": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }],
      //         "content_received": [
      //           39343453000
      //         ]
      //       }
      //     }
      //   },
      //   "3QFEQ#@334KPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641931349178338800,
      //     "first_block_timestamp": 1641931330,
      //     "validation_started": 39303957754,
      //     "validation_result": [
      //       39308637337,
      //       "Applied",
      //       39304163073,
      //       39308365834
      //     ],
      //     "validations": [
      //       {
      //         "started": 39303789690,
      //         "finished": 39303954365,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 3033370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 39303957754,
      //         "finished": 39308637337,
      //         "preapply_started": 39304163073,
      //         "preapply_ended": 39308365834,
      //         "current_head_level": 3033370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp3mD7uo": {
      //         "received": [
      //           {
      //             "latency": 39497781955,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39310733661,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D3WT": {
      //         "received": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }],
      //         "content_received": [
      //           39343453000
      //         ]
      //       }
      //     }
      //   },
      //   "3SDF9834deqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641931349178338800,
      //     "first_block_timestamp": 1641931330,
      //     "validation_started": 39303957754,
      //     "validation_result": [
      //       39308637337,
      //       "Applied",
      //       39304163073,
      //       39308365834
      //     ],
      //     "validations": [
      //       {
      //         "started": 39303789690,
      //         "finished": 39303954365,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 3033370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 39303957754,
      //         "finished": 39308637337,
      //         "preapply_started": 39304163073,
      //         "preapply_ended": 39308365834,
      //         "current_head_level": 3033370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp3mD7uo": {
      //         "received": [
      //           {
      //             "latency": 39497781955,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39310733661,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D3WT": {
      //         "received": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }],
      //         "content_received": [
      //           39343453000
      //         ]
      //       }
      //     }
      //   },
      //   "3WEFU(@*$KPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641931349178338800,
      //     "first_block_timestamp": 1641931330,
      //     "validation_started": 39303957754,
      //     "validation_result": [
      //       39308637337,
      //       "Applied",
      //       39304163073,
      //       39308365834
      //     ],
      //     "validations": [
      //       {
      //         "started": 39303789690,
      //         "finished": 39303954365,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 3033370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 39303957754,
      //         "finished": 39308637337,
      //         "preapply_started": 39304163073,
      //         "preapply_ended": 39308365834,
      //         "current_head_level": 3033370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp3mD7uo": {
      //         "received": [
      //           {
      //             "latency": 39497781955,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39310733661,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D3WT": {
      //         "received": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }],
      //         "content_received": [
      //           39343453000
      //         ]
      //       }
      //     }
      //   },
      //   "3fj30rjef4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641931349178338800,
      //     "first_block_timestamp": 1641931330,
      //     "validation_started": 39303957754,
      //     "validation_result": [
      //       39308637337,
      //       "Applied",
      //       39304163073,
      //       39308365834
      //     ],
      //     "validations": [
      //       {
      //         "started": 39303789690,
      //         "finished": 39303954365,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 3033370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 39303957754,
      //         "finished": 39308637337,
      //         "preapply_started": 39304163073,
      //         "preapply_ended": 39308365834,
      //         "current_head_level": 3033370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp3mD7uo": {
      //         "received": [
      //           {
      //             "latency": 39497781955,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39310733661,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D3WT": {
      //         "received": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }],
      //         "content_received": [
      //           39343453000
      //         ]
      //       }
      //     }
      //   },
      //   "3LEFJ@)4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641931349178338800,
      //     "first_block_timestamp": 1641931330,
      //     "validation_started": 39303957754,
      //     "validation_result": [
      //       39308637337,
      //       "Applied",
      //       39304163073,
      //       39308365834
      //     ],
      //     "validations": [
      //       {
      //         "started": 39303789690,
      //         "finished": 39303954365,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 3033370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 39303957754,
      //         "finished": 39308637337,
      //         "preapply_started": 39304163073,
      //         "preapply_ended": 39308365834,
      //         "current_head_level": 3033370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp3mD7uo": {
      //         "received": [
      //           {
      //             "latency": 39497781955,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39310733661,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D3WT": {
      //         "received": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }],
      //         "content_received": [
      //           39343453000
      //         ]
      //       }
      //     }
      //   },
      //   "3QQQQQqp4hKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641931349178338800,
      //     "first_block_timestamp": 1641931330,
      //     "validation_started": 39303957754,
      //     "validation_result": [
      //       39308637337,
      //       "Applied",
      //       39304163073,
      //       39308365834
      //     ],
      //     "validations": [
      //       {
      //         "started": 39303789690,
      //         "finished": 39303954365,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 3033370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 39303957754,
      //         "finished": 39308637337,
      //         "preapply_started": 39304163073,
      //         "preapply_ended": 39308365834,
      //         "current_head_level": 3033370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp3mD7uo": {
      //         "received": [
      //           {
      //             "latency": 39497781955,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39310733661,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D3WT": {
      //         "received": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }],
      //         "content_received": [
      //           39343453000
      //         ]
      //       }
      //     }
      //   },
      //   "3WWWWWWWWKPzxupmWPZMaprXb5wRF": {
      //     "kind": "Transaction",
      //     "min_time": 1641931349178338800,
      //     "first_block_timestamp": 1641931330,
      //     "validation_started": 39303957754,
      //     "validation_result": [
      //       39308637337,
      //       "Applied",
      //       39304163073,
      //       39308365834
      //     ],
      //     "validations": [
      //       {
      //         "started": 39303789690,
      //         "finished": 39303954365,
      //         "preapply_started": null,
      //         "preapply_ended": null,
      //         "current_head_level": 3033370,
      //         "result": "Prevalidate"
      //       },
      //       {
      //         "started": 39303957754,
      //         "finished": 39308637337,
      //         "preapply_started": 39304163073,
      //         "preapply_ended": 39308365834,
      //         "current_head_level": 3033370,
      //         "result": "Applied"
      //       }
      //     ],
      //     "nodes": {
      //       "idrzP4HJFosiMDRog6YEAuGp3mD7uo": {
      //         "received": [
      //           {
      //             "latency": 39497781955,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39310733661,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "content_requested": [],
      //         "content_received": [],
      //         "content_requested_remote": [],
      //         "content_sent": []
      //       },
      //       "idr8xKGPHsvtL6c7eRGa8SKF56D3WT": {
      //         "received": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }
      //         ],
      //         "sent": [
      //           {
      //             "latency": 39343453000,
      //             "block_level": 3033370,
      //             "block_timestamp": 1641931330
      //           }],
      //         "content_received": [
      //           39343453000
      //         ]
      //       }
      //     }
      //   },
      // }).pipe( delay(1000),
      map(this.mapOperationNodeStatsResponse)
    );
  }

  private mapOperationNodeStatsResponse(response: any): MempoolStatisticsOperation[] {
    return Object.keys(response).map(opKey => {

      const nodes: MempoolStatisticsOperationNode[] = Object.keys(response[opKey].nodes).map(key => {
        return {
          ...response[opKey].nodes[key],
          id: key
        };
      });

      const receivedValues = nodes.map(n => n.received[0]).filter(l => l !== undefined).map(r => r.latency);
      const sentValues = nodes.map(n => n.sent[0]).filter(l => l !== undefined).map(r => r.latency);
      const contentReceivedValues = nodes.map(n => n.content_received[0]).filter(l => l !== undefined);

      const firstReceived = receivedValues.length ? Math.min(...receivedValues) : undefined;
      const firstSent = sentValues.length ? Math.min(...sentValues) : undefined;
      const contentReceived = contentReceivedValues.length ? Math.min(...contentReceivedValues) : undefined;
      const validationStarted = response[opKey].validation_started ?? undefined;
      let preApplyStarted;
      let preApplyEnded;
      let validationResult;
      if (response[opKey].validation_result) {
        preApplyStarted = response[opKey].validation_result[2];
        preApplyEnded = response[opKey].validation_result[3];
        validationResult = response[opKey].validation_result[0];
      }

      const delta = firstSent - firstReceived;
      const contentReceivedDelta = contentReceived - firstReceived;
      const validationStartedDelta = validationStarted - contentReceived;
      let preApplyStartedDelta;
      let preApplyEndedDelta;
      let validationResultDelta;
      if (response[opKey].kind !== 'EndorsementWithSlot') {
        preApplyStartedDelta = preApplyStarted - validationStarted;
        preApplyEndedDelta = preApplyEnded - preApplyStarted;
        validationResultDelta = validationResult - preApplyEnded;
      } else {
        validationResultDelta = validationResult - validationStarted;
      }
      const firstSentDelta = firstSent - validationResult;

      return {
        ...response[opKey],
        hash: opKey,
        nodes,
        nodesLength: nodes.length,
        firstReceived,
        firstSent,
        validationStarted,
        preApplyStarted,
        preApplyEnded,
        validationResult,
        contentReceived,
        delta: MempoolStatisticsService.numOrUndefined(delta),
        contentReceivedDelta: MempoolStatisticsService.numOrUndefined(contentReceivedDelta),
        validationStartedDelta: MempoolStatisticsService.numOrUndefined(validationStartedDelta),
        preApplyStartedDelta: MempoolStatisticsService.numOrUndefined(preApplyStartedDelta),
        preApplyEndedDelta: MempoolStatisticsService.numOrUndefined(preApplyEndedDelta),
        validationResultDelta: MempoolStatisticsService.numOrUndefined(validationResultDelta),
        firstSentDelta: MempoolStatisticsService.numOrUndefined(firstSentDelta),
        validationsLength: response[opKey].validations?.length,
        kind: response[opKey].kind,
        dateTime: response[opKey].min_time.toString()
      };
    });
  }
}
