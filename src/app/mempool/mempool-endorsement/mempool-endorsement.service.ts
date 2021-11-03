import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MempoolEndorsementService {

  endorsementUpdates = mockUpdates;

  private bakersDetails = {};

  // TODO: remove
  private i = 0;

  constructor(private http: HttpClient) {
    this.http.get<any>('assets/json/mempool-bakers.json').subscribe(bakers => this.bakersDetails = bakers);
  }

  getEndorsementStatusUpdates(api: string): Observable<{ [p: string]: MempoolEndorsement }> {
    // const str = Object.keys(this.endorsementUpdates).filter((key, i) => i === this.i)[0];
    // return of({[str]: this.endorsementUpdates[str] }).pipe(
    return this.http.get<any>(api + '/dev/shell/automaton/endorsements_status').pipe(
    // const updateAllEndorsements = {};
    // const array = new Array(256);
    // for (let i = 0; i < array.length; i++) {
    //   updateAllEndorsements[i] = {
    //     slot: i,
    //     state: 'prechecked',
    //     broadcast_time: 8731126317,
    //     decoded_time: 8730296377,
    //     prechecked_time: 8730913985,
    //     received_time: 8703677063,
    //     applied_time: 1001000000,
    //   };
    // }
    // return of(mockUpdates).pipe(
    // return of(mockUpdates).pipe(
      map(response => {
        if (this.i > 40) {
          this.i = -1;
        }
        this.i++;
        const updates = Object.keys(response).map(key => ({
          [response[key].slot]: {
            status: response[key].state,
            receiveTime: response[key].received_time,
            applyTime: response[key].applied_time,
            decodeTime: response[key].decoded_time,
            precheckTime: response[key].prechecked_time,
            broadcastTime: response[key].broadcast_time,
            delta: (response[key].received_time && response[key].broadcast_time) ? (response[key].broadcast_time - response[key].received_time) : undefined
          }
        }));
        return Object.assign({}, ...updates);
      })
    );
  }

  getEndorsements(api: string, blockHash: string, level: number): Observable<MempoolEndorsement[]> {
    const url = `${api}/dev/shell/automaton/endorsing_rights?block=${blockHash}&level=${level}`;
    return this.http.get<{ [p: string]: number[] }>(url).pipe(
    // return of(httpEndorsements).pipe(
      map((value: { [p: string]: number[] }) => {
        this.i = 0;
        const endorsements: MempoolEndorsement[] = Object.keys(value).map(key => ({
          bakerName: this.bakersDetails[key]?.name || key,
          logo: this.bakersDetails[key]?.logo,
          slots: value[key],
          slotsLength: value[key].length
        }));
        return endorsements;
      })
    );
  }
}

const httpEndorsements = {
  tz1KfEsrtDaA1sX7vdM4qmEPWuSytuqCDp5j: [100],
  tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP: [202],
  tz1LYW7Yepo9qsQx2kjpek2RYVMCeGwBvDCQ: [163],
  tz1Ldzz6k1BHdhuKvAtMRX7h5kJSMHESMHLC: [18, 103, 123, 248],
  tz1MJx9vhaNRSimcuXPK2rW4fLccQnDAnVKJ: [204],
  tz1NEKxGEHsFufk87CVZcrqWu8o22qh46GK6: [7],
  tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e: [49],
  tz1NdhRv643wLW6zCcRP3VfT24dvDnh7nuh9: [116],
  tz1Nf6tsK4G6bBqgSQERy4nUtkHNKUVdh7q1: [5, 156, 182, 201],
  tz1P2Po7YM526ughEsRbY4oR9zaUPDZjxFrb: [2, 144, 160],
  tz1PWCDnz783NNGGQjEFFsHtrcK5yBW4E2rm: [19, 155],
  tz1Q8QkSBS63ZQnH3fBTiAMPes9R666Rn6Sc: [11, 59],
  tz1RCFbB9GpALpsZtu6J58sb74dm8qe6XBzv: [15, 27, 29, 84, 85, 122],
  tz1RjoHc98dBoqaH2jawF62XNKh7YsHwbkEv: [117, 139],
  tz1S8MNvuFEUsWgjHvi3AxibRBf388NhT1q2: [14, 34, 55, 64, 89, 108, 111, 124, 131, 161, 164, 171, 180, 191, 192, 193, 205, 221, 241, 243, 253],
  tz1S8e9GgdZG78XJRB3NqabfWeM37GnhZMWQ: [112, 185, 211, 239],
  tz1SYq214SCBy9naR6cvycQsYcUGpBqQAE8d: [106, 121],
  tz1Sm5iH2vfTtyPQdRHt4STaARTVqTHxJ6Ea: [69],
  tz1T7duV5gZWSTq4YpBGbXNLTfznCLDrFxvs: [181, 233],
  tz1TEc75UKXv4W5cwi14Na3NtqFD51yKQi7h: [56, 212],
  tz1TRqbYbUf2GyrjErf3hBzgBJPzW8y36qEs: [3, 177, 215],
  tz1TRspM5SeZpaQUhzByXbEvqKF1vnCM2YTK: [10, 41, 62, 189],
  tz1V4qCyvPKZ5UeqdH14HN42rxvNPQfc9UZg: [225],
  tz1VQnqCCqX4K5sP3FNkVSNKTdCAMJDd3E1n: [1, 32, 44, 63, 72, 73, 86, 132, 137, 140, 149, 150, 151, 159, 178, 187, 194, 224],
  tz1W5VkdB5s7ENMESVBtwyt9kyvLqPcUczRT: [125, 252],
  tz1WnyXakHZKotpQHxevTnLmomz5rTwdiccy: [97],
  tz1YsFfbT76a69Co3CkmuvYsphKZuHCNksp7: [208],
  tz1ZcTRk5uxD86EFEn1vvNffWWqJy7q5eVhc: [148],
  tz1aJ8wxNeVRYbbx5YqzurmYzwKzkS96rHP4: [42],
  tz1aRoaRhSpRYvFdyvgWLL6TGyRoGF51wDjM: [68, 81, 92, 101, 104, 113, 115, 119, 127, 145, 170, 227],
  tz1aW1vBxs6nEniJJxZFNtrMtwnKGgEQxo3P: [76],
  tz1abmz7jiCV2GH2u81LRrGgAFFgvQgiDiaf: [176, 218],
  tz1ajgycuHmd2z2JbTSJxKv7x6cok2KuNSk1: [90],
  tz1axcnVN9tZnCe4sQQhC6f3tfSEXdjPaXPY: [80],
  tz1beersuEDv8Z7ngQ825xfbaJNS2EhXnyHR: [40],
  tz1cYufsxHXJcvANhvS55h3aY32a9BAFB494: [82],
  tz1dNVDWPf3Q59SdJqnjdnu277iyvReiRS9M: [136, 154],
  tz1dRKU4FQ9QRRQPdaH4zCR6gmCmXfcvcgtB: [71, 226],
  tz1eEnQhbwf6trb8Q8mPb2RaPkNk2rN7BKi8: [58, 174, 199],
  tz1eVaNx3gCmG1EsLjijkmgAxdLYVf6Bf5Sq: [31],
  tz1ei4WtWEMEJekSv8qDnu9PExG6Q8HgRGr3: [142, 165],
  tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h: [57, 168, 207, 222],
  tz1gfArv665EUkSg2ojMBzcbfwuPxAvqPvjo: [17, 22, 33, 65, 74, 79, 94, 109, 157, 166, 190, 196, 197, 209, 231, 235],
  tz1irJKkXS2DBWkU1NnmFQx1c1L7pbGg4yhk: [26, 28, 38, 47, 52, 54, 75, 77, 87, 98, 105, 107, 110, 120, 143, 152, 162, 173, 183, 186, 195, 200, 217, 220, 223, 228, 245],
  tz2FCNBrERXtaTtNX6iimR1UJ5JSDxvdHM93: [25, 45, 70, 91, 134, 203, 214, 240, 255],
  tz3NDpRj6WBrJPikcPVHRBEjWKxFw3c6eQPS: [6, 60, 102],
  tz3NExpXn9aPNZPorRE4SdjJ2RGrfbJgMAaV: [16, 43, 61, 95, 96, 126, 147, 216, 247],
  tz3NxTnke1acr8o3h5y9ytf5awQBGNJUKzVU: [213],
  tz3QCNyySViKHmeSr45kzDxzchys7NiXCWoa: [13],
  tz3QSGPoRp3Kn7n3vY24eYeu3Peuqo45LQ4D: [141],
  tz3QT9dHYKDqh563chVa6za8526ys1UKfRfL: [130],
  tz3RB4aoyjov4KEVRbuhvQ1CKJgBJMWhaeB8: [39, 53, 184],
  tz3RDC3Jdn4j15J7bBHZd29EUee9gVB1CxD9: [23, 24, 37, 67, 153, 175],
  tz3RKYFsLuQzKBtmYuLNas7uMu3AsYd4QdsA: [4, 12, 198, 238, 244],
  tz3S6BBeKgJGXxvLyZ1xzXzMPn11nnFtq5L9: [36, 118, 135, 230, 237, 246, 249],
  tz3UoffC7FG7zfpmvmjUmUeAaHvzdcUvAj6r: [114, 172],
  tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN: [93, 129, 219, 250],
  tz3WMqdzXqRWXwyvj5Hp2H7QEepaUuS7vd9K: [78, 99, 254],
  tz3ZbP2pM3nwvXztbuMJwJnDvV5xdpU8UkkD: [0, 20, 30],
  tz3Zhs2dygr55yHyQyKjntAtY9bgfhLZ4Xj1: [21, 48, 50, 167, 169],
  tz3bTdwZinP8U1JmSweNzVKhmwafqWmFWRfk: [8, 51, 232],
  tz3bvNMQ95vfAYtG8193ymshqjSvmxiCUuR5: [66, 88, 128, 133, 179, 188, 242, 251],
  tz3gtoUxdudfBRcNY7iVdKPHCYYX6xdPpoRS: [9, 35, 83, 206],
  tz3hw2kqXhLUvY65ca1eety2oQTpAvd34R9Q: [46, 236],
  tz3iJu5vrKZcsqRPs8yJ61UDoeEXZmtro4qh: [138, 146, 158, 210, 229, 234]
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
    state: 'prechecked'
  },
  x: {
    slot: 138,
    state: 'prechecked'
  },
  onfVZ7t31uyqkmmHgq3StqGk9kRW3MbMSKQRkei82QMbKQpE9jX: {
    block_timestamp: 1638525814000000000,
    decoded_time: 8939728321,
    received_time: 8932988616,
    applied_time: 1001000000,
    slot: 100,
    state: 'applied'
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
    slot: 48,
    state: 'received'
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
    received_time: 8703677063,
    slot: 143,
    state: 'received'
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
    received_time: 9151362510,
    slot: 1,
    state: 'received'
  },
  onuTw5P1gLBVvZm3cA1j61pMcHxVWFPWtFUGvCfLgBquNBQknBm: {
    block_timestamp: 1638525814000000000,
    received_time: 5902483471,
    slot: 239,
    state: 'received'
  },
  onwc8LbhJyCAquUJuNM4QJjWXLasg3zhEEhnVK1kUcQeKwpzstN: {
    block_timestamp: 1638525814000000000,
    received_time: 9039657997,
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
    state: 'prechecked'
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
    state: 'received'
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
    state: 'received'
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
    state: 'prechecked'
  },
  ooFkXrwYfNcAXrsGfo2LcK61fKZSmgxsLAVL4Zsce3s8moozZ1e: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8749411212,
    applied_time: 1001000000,
    decoded_time: 8748965804,
    prechecked_time: 8749316940,
    received_time: 8736802289,
    slot: 125,
    state: 'received'
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
    state: 'received'
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
    state: 'prechecked'
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
    state: 'prechecked'
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
    state: 'received'
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
    state: 'received'
  },
  ooiLNGpLj58MUg4K9wjMniA63zE4ft1FD7mFVeXzkk9PZ77uBjR: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 5683255728,
    applied_time: 1001000000,
    decoded_time: 5682224611,
    prechecked_time: 5682971568,
    received_time: 5671153910,
    slot: 230,
    state: 'prechecked'
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
    state: 'prechecked'
  },
  ooqbR4NNNQohXVz4MViT9rVuZiJv8grDUE1emU3PAQ2tE9g65th: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7690628237,
    applied_time: 1001000000,
    decoded_time: 7689657921,
    prechecked_time: 7690450223,
    received_time: 7683369681,
    slot: 79,
    state: 'prechecked'
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
    state: 'applied'
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
    state: 'applied'
  },
  op9W6ZzJcBq2hK4RSQYXYAGQtusUbNAETtXFsp53mGEaa9NBgKN: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7429366983,
    decoded_time: 7428494360,
    applied_time: 1001000000,
    prechecked_time: 7429195670,
    received_time: 7427931182,
    slot: 88,
    state: 'applied'
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
    state: 'applied'
  },
  opKWEhaJQZ8Hofhhipmczq75hC9zaJHwsUsb2eWouvr4axbSc6j: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 7356160673,
    decoded_time: 7355095833,
    applied_time: 1001000000,
    prechecked_time: 7355779319,
    received_time: 7345648684,
    slot: 218,
    state: 'applied'
  },
  opQZoiwMLfTJ9UA5etS9bQHyms6ZrGtiHmyFDXf1DzhZ24c5z4e: {
    block_timestamp: 1638525814000000000,
    broadcast_time: 8477187549,
    applied_time: 1001000000,
    decoded_time: 8476542954,
    prechecked_time: 8477063540,
    received_time: 8473276454,
    slot: 126,
    state: 'applied'
  },
  opSPasKvYhg1ix8GAyvP4PBVkjbphv47yFokHLvnGSt2iP2p16P: {
    block_timestamp: 1638525814000000000,
    decoded_time: 9152806500,
    applied_time: 1001000000,
    received_time: 9151362510,
    slot: 17,
    state: 'applied'
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
