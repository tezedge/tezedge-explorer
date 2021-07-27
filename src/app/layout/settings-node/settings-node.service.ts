import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SettingsNodeEntityHeader } from '@shared/types/settings-node/settings-node-entity-header.type';
import { map } from 'rxjs/operators';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsNodeService {

  constructor(private http: HttpClient) { }

  getNodeFeatures(apiHttp: string, nodeId: string): Observable<any[]> {
    return of(environment.api.find(node => node.id === nodeId).features);
    // TODO: get features from backend, not from environment variables
    // this.http.get<SettingsNodeFeature[]>(apiHttp + '/pathToFeatures')
    //   .pipe(map(response => SettingsNodeService.mapGetNodeFeatures(response)));
  }

  getSettingsHeader(apiHttp: string): Observable<SettingsNodeEntityHeader> {
    return this.http.get<SettingsNodeEntityHeader>(apiHttp + '/chains/main/blocks/head/header')
      .pipe(map(response => SettingsNodeService.mapGetSettingsHeaderResponse(response)));
  }

  private static mapGetSettingsHeaderResponse(response: any): SettingsNodeEntityHeader {
    return {
      hash: response.hash,
      chainId: response.chain_id,
      level: response.level,
      proto: response.proto,
      predecessor: response.predecessor,
      timestamp: response.timestamp,
      validationPass: response.validationPass,
      operationsHash: response.operationsHash,
      fitness: response.fitness,
      context: response.context,
      protocol: response.protocol,
      signature: response.signature,
      priority: response.priority,
      seedNonceHash: response.seedNonceHash,
      proofOfWorkNonce: response.proofOfWorkNonce
    } as SettingsNodeEntityHeader;
  }
}
