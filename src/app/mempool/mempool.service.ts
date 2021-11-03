import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MempoolService {

  endorsementUpdates = mockUpdates;

  private bakersDetails = {};

  constructor(private http: HttpClient) {
    this.http.get<any>('assets/json/mempool-bakers.json').subscribe(bakers => this.bakersDetails = bakers);
  }

  getEndorsementStatusUpdates(api: string): Observable<{ [p: string]: MempoolEndorsement }> {
    return this.http.get<any>(api + '/dev/shell/automaton/endorsements_status').pipe(
      // return of(mockUpdates).pipe(
      map(response => {
        const updates = Object.keys(response).map(key => ({
          [response[key].slot]: {
            status: response[key].state,
            receiveTime: response[key].received_time,
            applyTime: response[key].applied_time,
            decodeTime: response[key].decoded_time,
            precheckTime: response[key].prechecked_time,
            broadcastTime: response[key].broadcast_time,
            maxTime: Math.max(
              response[key].received_time || 0,
              response[key].decoded_time || 0,
              response[key].applied_time || 0,
              response[key].prechecked_time || 0,
              response[key].broadcast_time || 0
            )
          }
        }));
        return Object.assign({}, ...updates);
      })
    );
  }

  getEndorsements(api: string, blockHash: string, level: number): Observable<MempoolEndorsement[]> {
    const url = api + '/dev/shell/automaton/endorsing_rights?block=' + blockHash + '&level=' + level;
    return this.http.get<{ [p: string]: number[] }>(url).pipe(
      map((value: { [p: string]: number[] }) => {
        const endorsements: MempoolEndorsement[] = Object.keys(value).map(key => ({
          baker: key,
          bakerName: this.bakersDetails[key]?.name,
          logo: this.bakersDetails[key]?.logo,
          slots: value[key]
        }));
        this.getNames(endorsements);
        return endorsements;
      })
    );
  }

  getOperations(api: string): Observable<any> {
    return this.http.get<any>(api + '/chains/main/mempool/pending_operations');
  }

  getNames(endorsements: MempoolEndorsement[]): void {
    // const sources = endorsements.map(endorsement => (
    //   this.http.get<any>('https://api.tezos-nodes.com/v1/baker/' + endorsement.baker)
    //     .pipe(catchError((err, c) => {
    //       return of(null);
    //     }))
    // ));
    // forkJoin(...sources)
    //   .subscribe(value => {
    //     console.log(JSON.stringify(value));
    //   });
  }
}

const httpEndorsements = {
  tz1NFs6yP2sXd5vAAbR43bbDRpV2nahDZope: [1, 2, 3, 4],
  tz1PUv7oRg5xpMf4nFewZrtRtnmCizW2ETtU: [5, 6, 7],
  tz1SwJwrKe8H1yi6KnYKCYkVHPApJRnZcHsa: [8],
  tz1aWed1gNGHyaiFBjTXsCLyMEPZZiSnXwLr: [9, 10, 11],
  tz1fPKAtsYydh4f1wfWNfeNxWYu72TmM48fu: [12, 13, 14],
  tz1VQnqCCqX4K5sP3FNkVSNKTdCAMJDd3E1n: [15, 16],
  tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h: [17, 18, 19, 20],
  tz1T7duV5gZWSTq4YpBGbXNLTfznCLDrFxvs: [21, 22, 23, 24, 25, 26],
  tz1TRqbYbUf2GyrjErf3hBzgBJPzW8y36qEs: [27, 28, 29, 30, 31, 32, 33],
  tz1aW1vBxs6nEniJJxZFNtrMtwnKGgEQxo3P: [34, 35, 36, 37, 38, 39, 40],
  tz1P2Po7YM526ughEsRbY4oR9zaUPDZjxFrb: [41, 42, 43, 44, 45, 46, 47],
  tz1irJKkXS2DBWkU1NnmFQx1c1L7pbGg4yhk: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256],
};

const mockUpdates = {
  oneS4r2ZZGuBdV1bhxLXeV6mfA1t7W4PaH2t7pwnit1gAsbtBAn: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8731126317,
    decoded_time: 8730296377,
    prechecked_time: 8730913985,
    received_time: 8703677063,
    applied_time: 1001000000,
    slot: 8,
    state: 'broadcast'
  },
  onfVZ7t31uyqkmmHgq3StqGk9kRW3MbMSKQRkei82QMbKQpE9jX: {
    block_timestamp: 1638525814000000000,
    decoded_time: 8939728321,
    received_time: 8932988616,
    applied_time: 1001000000,
    slot: 104,
    state: 'decoded'
  },
  ongxnxUVDSu7aR2Q3XMwFsfZSZ7x4wDBkcchbGqp5mNfTGEasAo: {
    block_timestamp: 1638525814000000000,
    decoded_time: 8530499637,
    received_time: 8530066058,
    slot: 117,
    applied_time: 1001000000,
    state: 'decoded'
  },
  onjNqyKMXaNqGJ8zUdBTZ3TXpPisgg9FsdNYBMPfk62SZcK9Lnd: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8046697472,
    decoded_time: 8045928617,
    prechecked_time: 8046551134,
    received_time: 8044682297,
    slot: 63,
    applied_time: 1001000000,
    state: 'broadcast'
  },
  onkEuNSsZeJ9bAP1HfAtq78Rmmjfwd8HM2BuKmWabHqebj5D1Re: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 6800892608,
    decoded_time: 6799948426,
    prechecked_time: 6800660361,
    received_time: 6791802744,
    slot: 58,
    state: 'broadcast'
  },
  onkRzoFs2MdYWfB4Nn4BEnoKhgYvGzsnFbjssMMx4L1ti9WZ92A: {
    block_timestamp: 1638525814000000000,
    decoded_time: 8672553465,
    received_time: 8657540614,
    applied_time: 1001000000,
    slot: 216,
    state: 'decoded'
  },
  onnCHxbCyEfp1eg4Y6ffsKF3LhWh35pmkfC6WDvoFbvULpQFhbd: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 6881082812,
    decoded_time: 6880216633,
    prechecked_time: 6880889782,
    applied_time: 1001000000,
    received_time: 6878851485,
    slot: 240,
    state: 'broadcast'
  },
  onnWmG7SZQD7hTvTtu4NT1vJU2hASDRrFFhLyrfFVWEnAEv3WJG: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8468817174,
    decoded_time: 8468047298,
    prechecked_time: 8468667451,
    received_time: 8467857416,
    applied_time: 1001000000,
    slot: 144,
    state: 'broadcast'
  },
  onoJiYKfV7vngMQNB58PJYScFhtmmA92jTGvaN3VUSJVzMch5CC: {
    block_timestamp: 1638525814000000000,
    decoded_time: 8704746335,
    applied_time: 1001000000,
    received_time: 8703677063,
    slot: 143,
    state: 'decoded'
  },
  onoiD5iukDBHzGQMb5fqNZvq7YAnNELJWaE8MMUcXasB14zFprD: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8424313718,
    applied_time: 1001000000,
    decoded_time: 8423945954,
    prechecked_time: 8424242718,
    received_time: 8423818326,
    slot: 185,
    state: 'broadcast'
  },
  onqF4T5xmoZKEM4ym3QBtiStTBn4S3YGsZQi6BpEhpk71dx8Hjy: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 9156988939,
    applied_time: 1001000000,
    decoded_time: 9156208635,
    prechecked_time: 9156802198,
    received_time: 9151362510,
    slot: 1,
    state: 'broadcast'
  },
  onuTw5P1gLBVvZm3cA1j61pMcHxVWFPWtFUGvCfLgBquNBQknBm: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 5904394232,
    decoded_time: 5903511019,
    applied_time: 1001000000,
    prechecked_time: 5904175237,
    received_time: 5902483471,
    slot: 239,
    state: 'broadcast'
  },
  onwc8LbhJyCAquUJuNM4QJjWXLasg3zhEEhnVK1kUcQeKwpzstN: {
    block_timestamp: 1638525814000000000,
    decoded_time: 8051229614,
    applied_time: 1001000000,
    received_time: 8039657996,
    slot: 29,
    state: 'decoded'
  },
  onwo7Am1KVk9oJBVunKHi7MTLAGZQWAVtSVNJjzPGgxopykD7Da: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8887274748,
    applied_time: 1001000000,
    decoded_time: 8886426631,
    prechecked_time: 8887065263,
    received_time: 8884585128,
    slot: 169,
    state: 'broadcast'
  },
  onymdyTCkobAsSnfn9pbYdYAYcZuatq3woCGPqJG2eCu499budD: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 6970804203,
    applied_time: 1001000000,
    decoded_time: 6969970014,
    prechecked_time: 6970628908,
    received_time: 6861173587,
    slot: 246,
    state: 'broadcast'
  },
  onzgAHB7T7u8C8cbyZ1WLGEuLWesMrJHzoVjp6TS3jEcVZM7Tam: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8935173843,
    decoded_time: 8934110781,
    prechecked_time: 8934778126,
    applied_time: 1001000000,
    received_time: 8932988616,
    slot: 194,
    state: 'broadcast'
  },
  oo2VJZbGsUv4XUkHVEKPjhc5X7C6TsUcAjeXYbvEakDSKR8uU7S: {
    block_timestamp: 1638525814000000000,
    applied_time: 1001000000,
    broadcast_time: 8547508349,
    decoded_time: 8546715697,
    prechecked_time: 8547272471,
    received_time: 8535956954,
    slot: 7,
    state: 'broadcast'
  },
  oo32ogQe2QeBDwmAkrYpeGY4vQVzRj51ZJsXjp7Xh7jA4JVnRSs: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8778636716,
    decoded_time: 8778030550,
    applied_time: 1001000000,
    prechecked_time: 8778509716,
    received_time: 8771714624,
    slot: 0,
    state: 'broadcast'
  },
  oo39Htmky5Sds4zYqjH8AAqDtpr4NAt1zLCFEVenEMPSas3oisH: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7186785997,
    decoded_time: 7185942740,
    applied_time: 1001000000,
    prechecked_time: 7186611226,
    received_time: 7150443456,
    slot: 119,
    state: 'broadcast'
  },
  oo5SyYmYNfZjBETxAADqanQRGXUGVdcmvrebJtgjf9aCMgJxJwy: {
    block_timestamp: 1638525814000000000,
    decoded_time: 7038399478,
    applied_time: 1001000000,
    received_time: 7035499209,
    slot: 112,
    state: 'decoded'
  },
  oo9adnZaoaDxprK2cgT8TzHmE9G7yzHmmfbnyiEzb13HQBgcHBE: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7386321473,
    decoded_time: 7385525790,
    prechecked_time: 7386159610,
    applied_time: 1001000000,
    received_time: 7371218030,
    slot: 77,
    state: 'broadcast'
  },
  ooDykz1HDNWDRx1rQL6B65cQVLRZ3RdQx3Po12Hfi8wNKVneJyR: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8537331536,
    applied_time: 1001000000,
    decoded_time: 8536297848,
    prechecked_time: 8536922449,
    received_time: 8535956954,
    slot: 22,
    state: 'broadcast'
  },
  ooFhimRMSLsxtD6hfSpdsQrqHfRiM17jS9nTkzPuFR83m2rKyZW: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8652352389,
    decoded_time: 8651450611,
    applied_time: 1001000000,
    prechecked_time: 8652165506,
    received_time: 8615341320,
    slot: 30,
    state: 'broadcast'
  },
  ooFkXrwYfNcAXrsGfo2LcK61fKZSmgxsLAVL4Zsce3s8moozZ1e: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8749411212,
    applied_time: 1001000000,
    decoded_time: 8748965804,
    prechecked_time: 8749316940,
    received_time: 8736802289,
    slot: 125,
    state: 'broadcast'
  },
  ooJPLaQjw6EgDAH5MAx52appHVNs34HBBTar5i2KJrYyQF27u2Y: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7578360266,
    decoded_time: 7577647204,
    applied_time: 1001000000,
    prechecked_time: 7578215901,
    received_time: 7574452378,
    slot: 217,
    state: 'broadcast'
  },
  ooLazGimCnjjwCHXfU7k2GPKhyUxt325Q72dKZva8EHyrJy23st: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8108765862,
    applied_time: 1001000000,
    decoded_time: 8107891680,
    prechecked_time: 8108520839,
    received_time: 8096280242,
    slot: 47,
    state: 'broadcast'
  },
  ooLqxjysGSXAEKjjMDfr2UTW4nhMDCJDTR2Ku7S8HiTrD4ETBYN: {
    block_timestamp: 1638525814000000000,
    applied_time: 1001000000,
    broadcast_time: 6897661100,
    decoded_time: 6896836661,
    prechecked_time: 6897487887,
    received_time: 6870045881,
    slot: 96,
    state: 'broadcast'
  },
  ooPSDsm5wPfV3MJt7775LEiYkLSagM6KdVHkvkmYnTHZaRw3m6M: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8765652387,
    applied_time: 1001000000,
    decoded_time: 8765211860,
    prechecked_time: 8765559715,
    received_time: 8729459279,
    slot: 95,
    state: 'broadcast'
  },
  ooSc4TJHPbj6VdFNpbGcrSwNegfpdet2gzcwsn6UZSTN1Lkcxsg: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7724039543,
    decoded_time: 7723173872,
    applied_time: 1001000000,
    prechecked_time: 7723859226,
    received_time: 7616323589,
    slot: 19,
    state: 'broadcast'
  },
  ooSgRACsH4sjBocuXEh5PXDNK6QqfwXkyGwbNDWko4zg3hwJovq: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 9069543093,
    decoded_time: 9068866962,
    prechecked_time: 9069419677,
    applied_time: 1001000000,
    received_time: 9068000881,
    slot: 78,
    state: 'broadcast'
  },
  ooTpsFN7zDaduLWhUfB8EkUZopBxPHajk7DhRLckHE4nSp5kixZ: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 5808521509,
    decoded_time: 5807582691,
    prechecked_time: 5808259185,
    applied_time: 1001000000,
    received_time: 5789566636,
    slot: 2,
    state: 'broadcast'
  },
  ooWAUJXpDzRBvGqCGdgtjyvTbxvxyWVznw5UUCV4azzhEYY4Qzh: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 5540086241,
    decoded_time: 5506126927,
    prechecked_time: 5539879544,
    received_time: 5479363298,
    applied_time: 1001000000,
    slot: 68,
    state: 'broadcast'
  },
  ooWy7krzQ8AVzCHFpdhexUEDxPYkWmWG4ndM18YVJe4zHMvC3Z4: {
    block_timestamp: 1638525814000000000,
    applied_time: 1001000000,
    broadcast_time: 5946927797,
    decoded_time: 5946068882,
    prechecked_time: 5946707760,
    received_time: 5933949681,
    slot: 36,
    state: 'broadcast'
  },
  ooXBgDwH7F4tVbMvijqYviyymsNMopXua66bUcnpZRC27eUwwGR: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7561865434,
    decoded_time: 7561093064,
    prechecked_time: 7561725542,
    applied_time: 1001000000,
    received_time: 7556172861,
    slot: 131,
    state: 'broadcast'
  },
  ooXjBdN33eEfDtVqj572wg7Ccr1an4cCSrSsCwnZ9hmD9iZ33z8: {
    block_timestamp: 1638525814000000000,
    decoded_time: 9273393208,
    applied_time: 1001000000,
    received_time: 9264136231,
    slot: 12,
    state: 'decoded'
  },
  ooZ44FVDxTxfbfmQTBhPXEGiJyan11ySxxwrBytw2hdqukVFp6S: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7180585978,
    decoded_time: 7179637334,
    prechecked_time: 7180358734,
    applied_time: 1001000000,
    received_time: 7137720384,
    slot: 41,
    state: 'broadcast'
  },
  ooaEAdDbZBL5ucbf95NBdkmvJpLryWNrmNHMWWWWLyzdLZEuHHt: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8295602717,
    decoded_time: 8293828799,
    prechecked_time: 8295425389,
    received_time: 8291906945,
    slot: 6,
    applied_time: 1001000000,
    state: 'broadcast'
  },
  ooeWUQ9vHGPPAZjF2MC13dfnbSJbsMXg1hrpZbCEoT1ycuJ4rGi: {
    block_timestamp: 1638525814000000000,
    decoded_time: 9454937341,
    applied_time: 1001000000,
    received_time: 9442012710,
    slot: 4,
    state: 'decoded'
  },
  oohH5iFyz61UKXG2yySMNprxyT76iascqxWUEs2wPMvwgpj4YMq: {
    block_timestamp: 1638525814000000000,
    applied_time: 1001000000,
    decoded_time: 7037633640,
    received_time: 7035499209,
    slot: 28,
    state: 'decoded'
  },
  ooiBLFpxkSYNsqEtPJ3QxZbouYVibuHrnMCLDozYztksbDw1EFb: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 9237434339,
    applied_time: 1001000000,
    decoded_time: 9236820447,
    prechecked_time: 9237321045,
    received_time: 9215035729,
    slot: 21,
    state: 'broadcast'
  },
  ooiLNGpLj58MUg4K9wjMniA63zE4ft1FD7mFVeXzkk9PZ77uBjR: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 5683255728,
    applied_time: 1001000000,
    decoded_time: 5682224611,
    prechecked_time: 5682971568,
    received_time: 5671153910,
    slot: 230,
    state: 'broadcast'
  },
  oojq28ZfJZikMJdSMKWF6r9RefsRGzHpyMJjGWdoUR8KPnc63d9: {
    block_timestamp: 1638525814000000000,
    decoded_time: 9127085153,
    applied_time: 1001000000,
    received_time: 9125192080,
    slot: 3,
    state: 'decoded'
  },
  oojyZ8ervL5WbT1KP9NjrcEamaABjYdW4iA1xFqnwyRohtjYTnZ: {
    block_timestamp: 1638525814000000000,
    applied_time: 1001000000,
    decoded_time: 9025917007,
    received_time: 8957877234,
    slot: 26,
    state: 'decoded'
  },
  oomSymh4WQfhtTZp9x5uWpbDFvzdJNi57QhnjFG7uBBjiT1SmMJ: {
    block_timestamp: 1638525814000000000,
    applied_time: 1001000000,
    decoded_time: 8124459250,
    received_time: 8117695608,
    slot: 75,
    state: 'decoded'
  },
  oopiw1pqEgAgtjX6Uc1DHgCBnD5rTyfP98bg5Zro2D6emtmQ6kt: {
    block_timestamp: 1638525814000000000,
    decoded_time: 8657739691,
    applied_time: 1001000000,
    received_time: 8657540614,
    slot: 44,
    state: 'decoded'
  },
  ooqbR4NNNQohXVz4MViT9rVuZiJv8grDUE1emU3PAQ2tE9g65th: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7690628237,
    applied_time: 1001000000,
    decoded_time: 7689657921,
    prechecked_time: 7690450223,
    received_time: 7683369681,
    slot: 79,
    state: 'broadcast'
  },
  oorNNt5US9w9fiGNgPJoMbWRnD8jJjoqp8DxPUd3ND378JCcGHG: {
    block_timestamp: 1638525814000000000,
    decoded_time: 7898521849,
    applied_time: 1001000000,
    received_time: 7873230630,
    slot: 54,
    state: 'decoded'
  },
  oorpfzqd7SwrbYehRhuzMcawdwESbi94eMexSmfn9A7eXhS2eVe: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 9312025568,
    applied_time: 1001000000,
    decoded_time: 9311229589,
    prechecked_time: 9311858145,
    received_time: 9310364261,
    slot: 191,
    state: 'broadcast'
  },
  ootp32mKCEdqYYwR9MPTNcafm7QoxgF6pyHSkaMCqaCELX1QpX2: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 6487311293,
    decoded_time: 6486364788,
    applied_time: 1001000000,
    prechecked_time: 6487075232,
    received_time: 6457404754,
    slot: 18,
    state: 'broadcast'
  },
  oouAweNX3tqznACZzk7zuXXTDT5VtHvA8aE4v9HAgpQCbzwyPMj: {
    block_timestamp: 1638525814000000000,
    decoded_time: 9247318515,
    applied_time: 1001000000,
    received_time: 9244801977,
    slot: 14,
    state: 'decoded'
  },
  oox2TJTB77mXpAgKD8pgeR59XcBViSLJd5E8sGqpYr86u2CLpyh: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8792923530,
    decoded_time: 8792369150,
    applied_time: 1001000000,
    prechecked_time: 8792774941,
    received_time: 8765110156,
    slot: 156,
    state: 'broadcast'
  },
  ooydnhBqeYaqMpnN3KUohb6BYYhNqGUtCM55GsUCfHW8AZLwCEk: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7550863447,
    decoded_time: 7549955661,
    applied_time: 1001000000,
    prechecked_time: 7550648594,
    received_time: 7549264286,
    slot: 154,
    state: 'broadcast'
  },
  oozY3qqJawKszqcr2HYy7oPVwEsFdX2BrVY6u1BJq85tkzy7MYP: {
    block_timestamp: 1638525814000000000,
    decoded_time: 7994516764,
    applied_time: 1001000000,
    received_time: 7993932474,
    slot: 31,
    state: 'decoded'
  },
  op7NgdmYgY8kfsiRXZoTaem4SzXvZmwm9b6SfUEGxkTy57Qf4JN: {
    block_timestamp: 1638525814000000000,
    applied_time: 1001000000,
    decoded_time: 8473473392,
    received_time: 8467857416,
    slot: 49,
    state: 'decoded'
  },
  op9W6ZzJcBq2hK4RSQYXYAGQtusUbNAETtXFsp53mGEaa9NBgKN: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7429366983,
    decoded_time: 7428494360,
    applied_time: 1001000000,
    prechecked_time: 7429195670,
    received_time: 7427931182,
    slot: 88,
    state: 'broadcast'
  },
  op9oPBCmpvf26P2rtjKGJqaHYDBQf7dxv76tEacjbjF1MRF1zph: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 9042267368,
    applied_time: 1001000000,
    decoded_time: 9041749857,
    prechecked_time: 9042156557,
    received_time: 9036048989,
    slot: 108,
    state: 'broadcast'
  },
  opDeSPXQAD4sEn6aPydqTGimxZ92H5MCjp7kVCf8Ds5DSExcivR: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8355902205,
    applied_time: 1001000000,
    decoded_time: 8354828384,
    prechecked_time: 8355516745,
    received_time: 8353687588,
    slot: 231,
    state: 'broadcast'
  },
  opKWEhaJQZ8Hofhhipmczq75hC9zaJHwsUsb2eWouvr4axbSc6j: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7356160673,
    decoded_time: 7355095833,
    applied_time: 1001000000,
    prechecked_time: 7355779319,
    received_time: 7345648684,
    slot: 218,
    state: 'broadcast'
  },
  opQZoiwMLfTJ9UA5etS9bQHyms6ZrGtiHmyFDXf1DzhZ24c5z4e: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8477187549,
    applied_time: 1001000000,
    decoded_time: 8476542954,
    prechecked_time: 8477063540,
    received_time: 8473276454,
    slot: 126,
    state: 'broadcast'
  },
  opSPasKvYhg1ix8GAyvP4PBVkjbphv47yFokHLvnGSt2iP2p16P: {
    block_timestamp: 1638525814000000000,
    decoded_time: 9152806500,
    applied_time: 1001000000,
    received_time: 9151362510,
    slot: 17,
    state: 'decoded'
  },
  opTMAZXgQU13Jfbzm7xAAAEmAuUhUXqh7dUEEXRDSBc1pe1N3VS: {
    block_timestamp: 1638525814000000000,
    applied_time: 1001000000,
    decoded_time: 9056896603,
    received_time: 8957877234,
    slot: 71,
    state: 'decoded'
  }
};
