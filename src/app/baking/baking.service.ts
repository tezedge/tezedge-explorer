import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BakingBaker } from '@shared/types/bakings/baking-baker.type';
import { BakingDelegator } from '@shared/types/bakings/baking-delegator.type';
import { ONE_MILLION } from '@shared/constants/unit-measurements';
import { BakingPaymentStatus } from '@shared/types/bakings/baking-payment-status.type';
import { JsonLoaderService } from '@core/json-loader.service';

@Injectable({
  providedIn: 'root'
})
export class BakingService {

  private bakersDetails = {};

  constructor(private http: HttpClient,
              private jsonLoaderService: JsonLoaderService) {
    this.bakersDetails = jsonLoaderService.bakers;
  }

  getBlockCycle(api: string): Observable<number> {
    const url = `${api}/chains/main/blocks/head~2/metadata`;
    return this.http.get<GetBlockMetadataResponse>(url).pipe(
      map(res => res.level_info.cycle - 1)
    );
  }

  getBakers(api: string, cycle: number): Observable<BakingBaker[]> {
    const url = `${api}/dev/rewards/cycle/${cycle}`;
    return this.http.get<GetBakersResponse[]>(url).pipe(
      // map(res => { // todo: remove
      //   let maxLength = 0;
      //   res.forEach(d => maxLength = maxLength < d.delegator_rewards.length ? d.delegator_rewards.length : maxLength);
      //   const findIndex = res.findIndex(d => d.delegator_rewards.length === maxLength);
      //   // const findIndex = res.findIndex(d => d.address === 'tz1irJKkXS2DBWkU1NnmFQx1c1L7pbGg4yhk');
      //   if (findIndex !== -1) {
      //     res[findIndex].address = 'tz1fm6a28VahUmoGkRV2RwuBMhtYNztkrtJy';
      //   }
      //   return res;
      // }),
      map((response: GetBakersResponse[]) => this.mapGetBakersResponse(response)),
    );
  }

  getOperationsStats(api: string, cycle: number): Observable<[string[]]> {
    const url = `${api}/tables/op?columns=status,hash,sender,receiver&type=transaction&cycle=${cycle}&limit=50000`;
    return this.http.get<[string[]]>(url);
  }

  private mapGetBakersResponse(response: GetBakersResponse[]): BakingBaker[] {
    return response.map((baker: GetBakersResponse) => ({
      hash: baker.address,
      bakerName: this.bakersDetails[baker.address]?.name || baker.address,
      logo: this.bakersDetails[baker.address]?.logo,
      reward: Number(baker.total_rewards) / ONE_MILLION,
      rewardAfterFee: 0,
      balance: Number(baker.staking_balance) / ONE_MILLION,
      delegators: baker.delegator_rewards.map(delegator => {
        const reward = Number(delegator.reward) / ONE_MILLION;
        return {
          hash: delegator.address,
          name: this.bakersDetails[delegator.address]?.name || delegator.address,
          logo: this.bakersDetails[delegator.address]?.logo,
          reward,
          rewardAfterFee: reward,
          fee: 0,
          balance: Number(delegator.balance) / ONE_MILLION,
          status: BakingPaymentStatus.UNPAID
        } as BakingDelegator;
      })
    } as BakingBaker));
  }
}

export interface GetBakersResponse {
  address: string;
  total_rewards: string;
  staking_balance: string;
  delegator_rewards: {
    address: string;
    balance: string;
    reward: string;
  }[];
}

interface GetBlockMetadataResponse {
  voting_period_info: {
    position: number;
    remaining: number;
    voting_period: {
      index: number;
      kind: string;
      start_position: number;
    };
  };
  consumed_gas: string;
  deactivated: any[];
  protocol: string;
  balance_updates: {
    category: string;
    change: string;
    kind: string;
    origin: string;
    contract: string;
  }[];
  max_operations_ttl: number;
  baker: string;
  test_chain_status: {
    status: string;
  };
  max_operation_data_length: number;
  liquidity_baking_escape_ema: number;
  implicit_operations_results: {
    balance_updates: {
      category: string;
      change: string;
      kind: string;
      origin: string;
      contract: string;
    }[];
    consumed_gas: string;
    consumed_milligas: string;
    kind: string;
    storage: {
      int: string;
      bytes: string;
    }[];
    storage_size: string;
  }[];
  max_operation_list_length: {
    max_op: number;
    max_size: number;
  }[];
  proposer: string;
  level_info: {
    cycle: number;
    cycle_position: number;
    expected_commitment: boolean;
    level: number;
    level_position: number;
  };
  max_block_header_length: number;
  nonce_hash?: any;
  next_protocol: string;
}
