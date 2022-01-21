import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MempoolBlockApplication } from '@shared/types/mempool/block-application/mempool-block-application.type';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MempoolBlockApplicationService {

  constructor(private http: HttpClient) { }

  getBlockApplication(): Observable<MempoolBlockApplication[]> {
    return of(blockApplicationMock.slice(0, 500)).pipe(
      map(response => {
        return response.map(value => ({
          ...value,
          totalTime: value.dataReady + value.loadData + value.applyBlock + value.storeResult
        }));
      })
    );
  }
}

const blockApplicationMock: MempoolBlockApplication[] = [
  {
    blockLevel: 1950000,
    dataReady: 144838,
    loadData: 2691291,
    applyBlock: 2110226,
    storeResult: 30584
  },
  {
    blockLevel: 1950001,
    dataReady: 111018,
    loadData: 3149987,
    applyBlock: 4789192,
    storeResult: 18615
  },
  {
    blockLevel: 1950002,
    dataReady: 458738,
    loadData: 2305335,
    applyBlock: 428377,
    storeResult: 49546
  },
  {
    blockLevel: 1950003,
    dataReady: 211375,
    loadData: 835728,
    applyBlock: 944471,
    storeResult: 13296
  },
  {
    blockLevel: 1950004,
    dataReady: 390521,
    loadData: 1333126,
    applyBlock: 866509,
    storeResult: 27103
  },
  {
    blockLevel: 1950005,
    dataReady: 205497,
    loadData: 2165872,
    applyBlock: 354757,
    storeResult: 6157
  },
  {
    blockLevel: 1950006,
    dataReady: 117651,
    loadData: 294398,
    applyBlock: 6753023,
    storeResult: 26693
  },
  {
    blockLevel: 1950007,
    dataReady: 372548,
    loadData: 1029943,
    applyBlock: 6877529,
    storeResult: 35325
  },
  {
    blockLevel: 1950008,
    dataReady: 247451,
    loadData: 1371726,
    applyBlock: 1254602,
    storeResult: 39203
  },
  {
    blockLevel: 1950009,
    dataReady: 127022,
    loadData: 2033122,
    applyBlock: 6604028,
    storeResult: 35227
  },
  {
    blockLevel: 1950010,
    dataReady: 394101,
    loadData: 1205790,
    applyBlock: 1643007,
    storeResult: 11753
  },
  {
    blockLevel: 1950011,
    dataReady: 343977,
    loadData: 1803352,
    applyBlock: 2915292,
    storeResult: 13506
  },
  {
    blockLevel: 1950012,
    dataReady: 210850,
    loadData: 2597031,
    applyBlock: 3154938,
    storeResult: 7259
  },
  {
    blockLevel: 1950013,
    dataReady: 108161,
    loadData: 987660,
    applyBlock: 5872225,
    storeResult: 9064
  },
  {
    blockLevel: 1950014,
    dataReady: 437297,
    loadData: 1048861,
    applyBlock: 5429467,
    storeResult: 14804
  },
  {
    blockLevel: 1950015,
    dataReady: 299574,
    loadData: 625914,
    applyBlock: 3732822,
    storeResult: 15666
  },
  {
    blockLevel: 1950016,
    dataReady: 180807,
    loadData: 107953,
    applyBlock: 4510767,
    storeResult: 487
  },
  {
    blockLevel: 1950017,
    dataReady: 414581,
    loadData: 594487,
    applyBlock: 728439,
    storeResult: 25926
  },
  {
    blockLevel: 1950018,
    dataReady: 333536,
    loadData: 905284,
    applyBlock: 3203445,
    storeResult: 7872
  },
  {
    blockLevel: 1950019,
    dataReady: 231706,
    loadData: 3438174,
    applyBlock: 1792966,
    storeResult: 49807
  },
  {
    blockLevel: 1950020,
    dataReady: 129962,
    loadData: 3493837,
    applyBlock: 1309733,
    storeResult: 6167
  },
  {
    blockLevel: 1950021,
    dataReady: 207638,
    loadData: 1921119,
    applyBlock: 2915012,
    storeResult: 8897
  },
  {
    blockLevel: 1950022,
    dataReady: 145997,
    loadData: 2367333,
    applyBlock: 4881502,
    storeResult: 27298
  },
  {
    blockLevel: 1950023,
    dataReady: 190227,
    loadData: 1784533,
    applyBlock: 6062237,
    storeResult: 32808
  },
  {
    blockLevel: 1950024,
    dataReady: 306720,
    loadData: 3437098,
    applyBlock: 2212913,
    storeResult: 27089
  },
  {
    blockLevel: 1950025,
    dataReady: 132593,
    loadData: 785505,
    applyBlock: 4997313,
    storeResult: 18186
  },
  {
    blockLevel: 1950026,
    dataReady: 356350,
    loadData: 2349880,
    applyBlock: 6386736,
    storeResult: 23126
  },
  {
    blockLevel: 1950027,
    dataReady: 227344,
    loadData: 467340,
    applyBlock: 6270163,
    storeResult: 18907
  },
  {
    blockLevel: 1950028,
    dataReady: 202634,
    loadData: 1221956,
    applyBlock: 4947731,
    storeResult: 28951
  },
  {
    blockLevel: 1950029,
    dataReady: 46269,
    loadData: 1394016,
    applyBlock: 3906943,
    storeResult: 21785
  },
  {
    blockLevel: 1950030,
    dataReady: 46903,
    loadData: 2623810,
    applyBlock: 6826692,
    storeResult: 12758
  },
  {
    blockLevel: 1950031,
    dataReady: 472016,
    loadData: 3005628,
    applyBlock: 6136612,
    storeResult: 22037
  },
  {
    blockLevel: 1950032,
    dataReady: 333268,
    loadData: 352254,
    applyBlock: 1896548,
    storeResult: 38100
  },
  {
    blockLevel: 1950033,
    dataReady: 281950,
    loadData: 1711915,
    applyBlock: 2080341,
    storeResult: 28440
  },
  {
    blockLevel: 1950034,
    dataReady: 122585,
    loadData: 509364,
    applyBlock: 2538243,
    storeResult: 13402
  },
  {
    blockLevel: 1950035,
    dataReady: 17201,
    loadData: 2264680,
    applyBlock: 2295599,
    storeResult: 36851
  },
  {
    blockLevel: 1950036,
    dataReady: 160305,
    loadData: 3026472,
    applyBlock: 289254,
    storeResult: 42051
  },
  {
    blockLevel: 1950037,
    dataReady: 47949,
    loadData: 3341929,
    applyBlock: 2727502,
    storeResult: 8839
  },
  {
    blockLevel: 1950038,
    dataReady: 79614,
    loadData: 1482479,
    applyBlock: 4064165,
    storeResult: 12517
  },
  {
    blockLevel: 1950039,
    dataReady: 176108,
    loadData: 2651341,
    applyBlock: 1395381,
    storeResult: 48993
  },
  {
    blockLevel: 1950040,
    dataReady: 441518,
    loadData: 3108261,
    applyBlock: 413437,
    storeResult: 13036
  },
  {
    blockLevel: 1950041,
    dataReady: 198388,
    loadData: 2053434,
    applyBlock: 4243292,
    storeResult: 49303
  },
  {
    blockLevel: 1950042,
    dataReady: 56081,
    loadData: 782422,
    applyBlock: 5693514,
    storeResult: 5254
  },
  {
    blockLevel: 1950043,
    dataReady: 102410,
    loadData: 1631959,
    applyBlock: 996008,
    storeResult: 5303
  },
  {
    blockLevel: 1950044,
    dataReady: 99127,
    loadData: 2316648,
    applyBlock: 5441846,
    storeResult: 16614
  },
  {
    blockLevel: 1950045,
    dataReady: 474896,
    loadData: 1397173,
    applyBlock: 2873128,
    storeResult: 39873
  },
  {
    blockLevel: 1950046,
    dataReady: 440451,
    loadData: 1805832,
    applyBlock: 2275926,
    storeResult: 20944
  },
  {
    blockLevel: 1950047,
    dataReady: 499713,
    loadData: 1447076,
    applyBlock: 3114574,
    storeResult: 18810
  },
  {
    blockLevel: 1950048,
    dataReady: 108790,
    loadData: 3336517,
    applyBlock: 4850887,
    storeResult: 11687
  },
  {
    blockLevel: 1950049,
    dataReady: 399744,
    loadData: 2504595,
    applyBlock: 4466704,
    storeResult: 14500
  },
  {
    blockLevel: 1950050,
    dataReady: 435910,
    loadData: 1559925,
    applyBlock: 3332090,
    storeResult: 45550
  },
  {
    blockLevel: 1950051,
    dataReady: 358624,
    loadData: 3013531,
    applyBlock: 6982170,
    storeResult: 24068
  },
  {
    blockLevel: 1950052,
    dataReady: 346860,
    loadData: 1654593,
    applyBlock: 2725390,
    storeResult: 41327
  },
  {
    blockLevel: 1950053,
    dataReady: 261441,
    loadData: 352166,
    applyBlock: 5923893,
    storeResult: 20189
  },
  {
    blockLevel: 1950054,
    dataReady: 414027,
    loadData: 2745605,
    applyBlock: 3202446,
    storeResult: 21808
  },
  {
    blockLevel: 1950055,
    dataReady: 48434,
    loadData: 1531616,
    applyBlock: 6358128,
    storeResult: 15638
  },
  {
    blockLevel: 1950056,
    dataReady: 230143,
    loadData: 1549532,
    applyBlock: 6188126,
    storeResult: 13584
  },
  {
    blockLevel: 1950057,
    dataReady: 268082,
    loadData: 277372,
    applyBlock: 2237808,
    storeResult: 10592
  },
  {
    blockLevel: 1950058,
    dataReady: 126776,
    loadData: 1007704,
    applyBlock: 1667971,
    storeResult: 45862
  },
  {
    blockLevel: 1950059,
    dataReady: 247506,
    loadData: 2618701,
    applyBlock: 1842146,
    storeResult: 47268
  },
  {
    blockLevel: 1950060,
    dataReady: 255721,
    loadData: 842142,
    applyBlock: 3327197,
    storeResult: 20239
  },
  {
    blockLevel: 1950061,
    dataReady: 68584,
    loadData: 1805090,
    applyBlock: 3127923,
    storeResult: 12849
  },
  {
    blockLevel: 1950062,
    dataReady: 449815,
    loadData: 1753060,
    applyBlock: 476988,
    storeResult: 36387
  },
  {
    blockLevel: 1950063,
    dataReady: 471446,
    loadData: 1149013,
    applyBlock: 1488752,
    storeResult: 11091
  },
  {
    blockLevel: 1950064,
    dataReady: 310484,
    loadData: 3399345,
    applyBlock: 4846382,
    storeResult: 32488
  },
  {
    blockLevel: 1950065,
    dataReady: 362842,
    loadData: 384027,
    applyBlock: 3030214,
    storeResult: 34614
  },
  {
    blockLevel: 1950066,
    dataReady: 139872,
    loadData: 2990805,
    applyBlock: 5371575,
    storeResult: 26414
  },
  {
    blockLevel: 1950067,
    dataReady: 136190,
    loadData: 1146433,
    applyBlock: 5157022,
    storeResult: 4706
  },
  {
    blockLevel: 1950068,
    dataReady: 266017,
    loadData: 3210859,
    applyBlock: 2413105,
    storeResult: 1044
  },
  {
    blockLevel: 1950069,
    dataReady: 298738,
    loadData: 2167423,
    applyBlock: 725630,
    storeResult: 48446
  },
  {
    blockLevel: 1950070,
    dataReady: 104058,
    loadData: 2225501,
    applyBlock: 6451840,
    storeResult: 198
  },
  {
    blockLevel: 1950071,
    dataReady: 357209,
    loadData: 2098116,
    applyBlock: 4130840,
    storeResult: 35736
  },
  {
    blockLevel: 1950072,
    dataReady: 183473,
    loadData: 2866732,
    applyBlock: 5355479,
    storeResult: 6131
  },
  {
    blockLevel: 1950073,
    dataReady: 337000,
    loadData: 2136304,
    applyBlock: 1682765,
    storeResult: 41610
  },
  {
    blockLevel: 1950074,
    dataReady: 367804,
    loadData: 2882077,
    applyBlock: 2578629,
    storeResult: 48129
  },
  {
    blockLevel: 1950075,
    dataReady: 420150,
    loadData: 280758,
    applyBlock: 1716536,
    storeResult: 31283
  },
  {
    blockLevel: 1950076,
    dataReady: 159135,
    loadData: 1902758,
    applyBlock: 3340343,
    storeResult: 39495
  },
  {
    blockLevel: 1950077,
    dataReady: 393000,
    loadData: 2054119,
    applyBlock: 1759270,
    storeResult: 45972
  },
  {
    blockLevel: 1950078,
    dataReady: 176375,
    loadData: 1512707,
    applyBlock: 5709577,
    storeResult: 37275
  },
  {
    blockLevel: 1950079,
    dataReady: 458424,
    loadData: 2873389,
    applyBlock: 4440996,
    storeResult: 6781
  },
  {
    blockLevel: 1950080,
    dataReady: 281786,
    loadData: 2011845,
    applyBlock: 1675054,
    storeResult: 5259
  },
  {
    blockLevel: 1950081,
    dataReady: 412138,
    loadData: 3496665,
    applyBlock: 1346046,
    storeResult: 35692
  },
  {
    blockLevel: 1950082,
    dataReady: 491557,
    loadData: 2522532,
    applyBlock: 4459223,
    storeResult: 16303
  },
  {
    blockLevel: 1950083,
    dataReady: 135132,
    loadData: 1578713,
    applyBlock: 3666347,
    storeResult: 31013
  },
  {
    blockLevel: 1950084,
    dataReady: 356437,
    loadData: 3001567,
    applyBlock: 1008151,
    storeResult: 9644
  },
  {
    blockLevel: 1950085,
    dataReady: 352766,
    loadData: 1544819,
    applyBlock: 6820039,
    storeResult: 40611
  },
  {
    blockLevel: 1950086,
    dataReady: 246051,
    loadData: 502089,
    applyBlock: 3859217,
    storeResult: 32887
  },
  {
    blockLevel: 1950087,
    dataReady: 83564,
    loadData: 434914,
    applyBlock: 5031618,
    storeResult: 12909
  },
  {
    blockLevel: 1950088,
    dataReady: 107352,
    loadData: 1417650,
    applyBlock: 600856,
    storeResult: 49689
  },
  {
    blockLevel: 1950089,
    dataReady: 317397,
    loadData: 1436847,
    applyBlock: 6895508,
    storeResult: 17639
  },
  {
    blockLevel: 1950090,
    dataReady: 468578,
    loadData: 2705105,
    applyBlock: 6498704,
    storeResult: 23893
  },
  {
    blockLevel: 1950091,
    dataReady: 259362,
    loadData: 1072963,
    applyBlock: 1342543,
    storeResult: 33670
  },
  {
    blockLevel: 1950092,
    dataReady: 477936,
    loadData: 2808865,
    applyBlock: 4875202,
    storeResult: 42257
  },
  {
    blockLevel: 1950093,
    dataReady: 341973,
    loadData: 2430650,
    applyBlock: 5562057,
    storeResult: 29032
  },
  {
    blockLevel: 1950094,
    dataReady: 333479,
    loadData: 1342053,
    applyBlock: 2237005,
    storeResult: 35801
  },
  {
    blockLevel: 1950095,
    dataReady: 39777,
    loadData: 827355,
    applyBlock: 5854247,
    storeResult: 27845
  },
  {
    blockLevel: 1950096,
    dataReady: 196652,
    loadData: 278948,
    applyBlock: 3745435,
    storeResult: 20321
  },
  {
    blockLevel: 1950097,
    dataReady: 498581,
    loadData: 3153890,
    applyBlock: 6430281,
    storeResult: 46917
  },
  {
    blockLevel: 1950098,
    dataReady: 263847,
    loadData: 2695656,
    applyBlock: 3682722,
    storeResult: 6667
  },
  {
    blockLevel: 1950099,
    dataReady: 294694,
    loadData: 1740301,
    applyBlock: 4378562,
    storeResult: 14205
  },
  {
    blockLevel: 1950100,
    dataReady: 431217,
    loadData: 3160852,
    applyBlock: 873236,
    storeResult: 32269
  },
  {
    blockLevel: 1950101,
    dataReady: 40361,
    loadData: 1375984,
    applyBlock: 3393281,
    storeResult: 24587
  },
  {
    blockLevel: 1950102,
    dataReady: 349054,
    loadData: 3461800,
    applyBlock: 2974948,
    storeResult: 25699
  },
  {
    blockLevel: 1950103,
    dataReady: 111165,
    loadData: 444392,
    applyBlock: 2626154,
    storeResult: 283
  },
  {
    blockLevel: 1950104,
    dataReady: 66072,
    loadData: 100340,
    applyBlock: 6673408,
    storeResult: 36327
  },
  {
    blockLevel: 1950105,
    dataReady: 37793,
    loadData: 2682256,
    applyBlock: 1834874,
    storeResult: 16773
  },
  {
    blockLevel: 1950106,
    dataReady: 219833,
    loadData: 2943995,
    applyBlock: 4051594,
    storeResult: 18990
  },
  {
    blockLevel: 1950107,
    dataReady: 55160,
    loadData: 3297210,
    applyBlock: 5913318,
    storeResult: 38113
  },
  {
    blockLevel: 1950108,
    dataReady: 422126,
    loadData: 992853,
    applyBlock: 1330528,
    storeResult: 42072
  },
  {
    blockLevel: 1950109,
    dataReady: 454243,
    loadData: 2969559,
    applyBlock: 1988074,
    storeResult: 1831
  },
  {
    blockLevel: 1950110,
    dataReady: 186986,
    loadData: 708043,
    applyBlock: 596930,
    storeResult: 33492
  },
  {
    blockLevel: 1950111,
    dataReady: 193381,
    loadData: 1544834,
    applyBlock: 273697,
    storeResult: 41920
  },
  {
    blockLevel: 1950112,
    dataReady: 251748,
    loadData: 1698047,
    applyBlock: 6212139,
    storeResult: 19766
  },
  {
    blockLevel: 1950113,
    dataReady: 402812,
    loadData: 3366214,
    applyBlock: 6999944,
    storeResult: 16444
  },
  {
    blockLevel: 1950114,
    dataReady: 198826,
    loadData: 3097264,
    applyBlock: 3563559,
    storeResult: 29946
  },
  {
    blockLevel: 1950115,
    dataReady: 402196,
    loadData: 1197997,
    applyBlock: 6727599,
    storeResult: 7508
  },
  {
    blockLevel: 1950116,
    dataReady: 158765,
    loadData: 304648,
    applyBlock: 4746006,
    storeResult: 5397
  },
  {
    blockLevel: 1950117,
    dataReady: 207489,
    loadData: 1643743,
    applyBlock: 2444656,
    storeResult: 31361
  },
  {
    blockLevel: 1950118,
    dataReady: 51791,
    loadData: 2745064,
    applyBlock: 5157886,
    storeResult: 5289
  },
  {
    blockLevel: 1950119,
    dataReady: 106334,
    loadData: 615984,
    applyBlock: 1149792,
    storeResult: 41078
  },
  {
    blockLevel: 1950120,
    dataReady: 301467,
    loadData: 1709778,
    applyBlock: 3254037,
    storeResult: 2561
  },
  {
    blockLevel: 1950121,
    dataReady: 125578,
    loadData: 1806588,
    applyBlock: 394275,
    storeResult: 13419
  },
  {
    blockLevel: 1950122,
    dataReady: 399321,
    loadData: 2457700,
    applyBlock: 1628774,
    storeResult: 20066
  },
  {
    blockLevel: 1950123,
    dataReady: 278395,
    loadData: 1368890,
    applyBlock: 1312045,
    storeResult: 21789
  },
  {
    blockLevel: 1950124,
    dataReady: 188346,
    loadData: 3078344,
    applyBlock: 895072,
    storeResult: 27587
  },
  {
    blockLevel: 1950125,
    dataReady: 275451,
    loadData: 996751,
    applyBlock: 4874932,
    storeResult: 25118
  },
  {
    blockLevel: 1950126,
    dataReady: 282627,
    loadData: 3370858,
    applyBlock: 2186296,
    storeResult: 44398
  },
  {
    blockLevel: 1950127,
    dataReady: 37244,
    loadData: 851943,
    applyBlock: 6280151,
    storeResult: 15101
  },
  {
    blockLevel: 1950128,
    dataReady: 256190,
    loadData: 572609,
    applyBlock: 429017,
    storeResult: 17612
  },
  {
    blockLevel: 1950129,
    dataReady: 117556,
    loadData: 3477508,
    applyBlock: 1138628,
    storeResult: 1976
  },
  {
    blockLevel: 1950130,
    dataReady: 158461,
    loadData: 619611,
    applyBlock: 3879423,
    storeResult: 24733
  },
  {
    blockLevel: 1950131,
    dataReady: 464750,
    loadData: 3021675,
    applyBlock: 4627469,
    storeResult: 47673
  },
  {
    blockLevel: 1950132,
    dataReady: 320485,
    loadData: 3027334,
    applyBlock: 3838167,
    storeResult: 10390
  },
  {
    blockLevel: 1950133,
    dataReady: 272618,
    loadData: 445744,
    applyBlock: 2896768,
    storeResult: 29174
  },
  {
    blockLevel: 1950134,
    dataReady: 204695,
    loadData: 2505865,
    applyBlock: 985882,
    storeResult: 3753
  },
  {
    blockLevel: 1950135,
    dataReady: 448077,
    loadData: 1285703,
    applyBlock: 4013180,
    storeResult: 22747
  },
  {
    blockLevel: 1950136,
    dataReady: 167759,
    loadData: 389671,
    applyBlock: 728311,
    storeResult: 8409
  },
  {
    blockLevel: 1950137,
    dataReady: 144064,
    loadData: 2734424,
    applyBlock: 284526,
    storeResult: 6906
  },
  {
    blockLevel: 1950138,
    dataReady: 175199,
    loadData: 2045924,
    applyBlock: 6483887,
    storeResult: 13574
  },
  {
    blockLevel: 1950139,
    dataReady: 467694,
    loadData: 677156,
    applyBlock: 6189048,
    storeResult: 6294
  },
  {
    blockLevel: 1950140,
    dataReady: 20673,
    loadData: 1279132,
    applyBlock: 640692,
    storeResult: 21148
  },
  {
    blockLevel: 1950141,
    dataReady: 497923,
    loadData: 2568107,
    applyBlock: 2503475,
    storeResult: 38316
  },
  {
    blockLevel: 1950142,
    dataReady: 314286,
    loadData: 103326,
    applyBlock: 5771341,
    storeResult: 7003
  },
  {
    blockLevel: 1950143,
    dataReady: 382428,
    loadData: 1974793,
    applyBlock: 848998,
    storeResult: 35023
  },
  {
    blockLevel: 1950144,
    dataReady: 496454,
    loadData: 273657,
    applyBlock: 2331277,
    storeResult: 33434
  },
  {
    blockLevel: 1950145,
    dataReady: 42135,
    loadData: 2495571,
    applyBlock: 1936467,
    storeResult: 13312
  },
  {
    blockLevel: 1950146,
    dataReady: 28781,
    loadData: 362866,
    applyBlock: 6338837,
    storeResult: 42103
  },
  {
    blockLevel: 1950147,
    dataReady: 364630,
    loadData: 2430584,
    applyBlock: 6039490,
    storeResult: 21687
  },
  {
    blockLevel: 1950148,
    dataReady: 307825,
    loadData: 3326122,
    applyBlock: 1319849,
    storeResult: 49767
  },
  {
    blockLevel: 1950149,
    dataReady: 235067,
    loadData: 1093504,
    applyBlock: 2439852,
    storeResult: 47750
  },
  {
    blockLevel: 1950150,
    dataReady: 247356,
    loadData: 2267490,
    applyBlock: 2689926,
    storeResult: 16735
  },
  {
    blockLevel: 1950151,
    dataReady: 356889,
    loadData: 150696,
    applyBlock: 1623582,
    storeResult: 25030
  },
  {
    blockLevel: 1950152,
    dataReady: 17343,
    loadData: 514400,
    applyBlock: 4137895,
    storeResult: 30853
  },
  {
    blockLevel: 1950153,
    dataReady: 177361,
    loadData: 2477743,
    applyBlock: 1664591,
    storeResult: 18762
  },
  {
    blockLevel: 1950154,
    dataReady: 126973,
    loadData: 1199269,
    applyBlock: 1792619,
    storeResult: 44601
  },
  {
    blockLevel: 1950155,
    dataReady: 58330,
    loadData: 2489128,
    applyBlock: 2458636,
    storeResult: 13740
  },
  {
    blockLevel: 1950156,
    dataReady: 297686,
    loadData: 1651274,
    applyBlock: 5593059,
    storeResult: 41492
  },
  {
    blockLevel: 1950157,
    dataReady: 25720,
    loadData: 2262022,
    applyBlock: 5082708,
    storeResult: 11558
  },
  {
    blockLevel: 1950158,
    dataReady: 87636,
    loadData: 1762539,
    applyBlock: 6204241,
    storeResult: 18443
  },
  {
    blockLevel: 1950159,
    dataReady: 364123,
    loadData: 2266907,
    applyBlock: 5352452,
    storeResult: 9281
  },
  {
    blockLevel: 1950160,
    dataReady: 408176,
    loadData: 885036,
    applyBlock: 5323321,
    storeResult: 44153
  },
  {
    blockLevel: 1950161,
    dataReady: 459912,
    loadData: 2778700,
    applyBlock: 305810,
    storeResult: 49543
  },
  {
    blockLevel: 1950162,
    dataReady: 304343,
    loadData: 2863254,
    applyBlock: 3251144,
    storeResult: 1523
  },
  {
    blockLevel: 1950163,
    dataReady: 352389,
    loadData: 943485,
    applyBlock: 2571387,
    storeResult: 34395
  },
  {
    blockLevel: 1950164,
    dataReady: 165119,
    loadData: 1337723,
    applyBlock: 3896373,
    storeResult: 3566
  },
  {
    blockLevel: 1950165,
    dataReady: 116489,
    loadData: 1673776,
    applyBlock: 207902,
    storeResult: 16214
  },
  {
    blockLevel: 1950166,
    dataReady: 234629,
    loadData: 317297,
    applyBlock: 4116248,
    storeResult: 37245
  },
  {
    blockLevel: 1950167,
    dataReady: 206861,
    loadData: 2266328,
    applyBlock: 6777803,
    storeResult: 46219
  },
  {
    blockLevel: 1950168,
    dataReady: 291155,
    loadData: 263728,
    applyBlock: 6263874,
    storeResult: 9090
  },
  {
    blockLevel: 1950169,
    dataReady: 242005,
    loadData: 2096596,
    applyBlock: 264116,
    storeResult: 29338
  },
  {
    blockLevel: 1950170,
    dataReady: 279487,
    loadData: 1775330,
    applyBlock: 5416069,
    storeResult: 16924
  },
  {
    blockLevel: 1950171,
    dataReady: 381059,
    loadData: 247812,
    applyBlock: 4658291,
    storeResult: 45840
  },
  {
    blockLevel: 1950172,
    dataReady: 161283,
    loadData: 1677765,
    applyBlock: 2549130,
    storeResult: 32463
  },
  {
    blockLevel: 1950173,
    dataReady: 346658,
    loadData: 2329396,
    applyBlock: 5636358,
    storeResult: 22861
  },
  {
    blockLevel: 1950174,
    dataReady: 339964,
    loadData: 2857544,
    applyBlock: 4039281,
    storeResult: 14986
  },
  {
    blockLevel: 1950175,
    dataReady: 91385,
    loadData: 658058,
    applyBlock: 4846771,
    storeResult: 49432
  },
  {
    blockLevel: 1950176,
    dataReady: 35385,
    loadData: 2779024,
    applyBlock: 2000162,
    storeResult: 39538
  },
  {
    blockLevel: 1950177,
    dataReady: 156950,
    loadData: 3079246,
    applyBlock: 6744320,
    storeResult: 613
  },
  {
    blockLevel: 1950178,
    dataReady: 327055,
    loadData: 297586,
    applyBlock: 425887,
    storeResult: 26598
  },
  {
    blockLevel: 1950179,
    dataReady: 58138,
    loadData: 1605200,
    applyBlock: 1147273,
    storeResult: 7541
  },
  {
    blockLevel: 1950180,
    dataReady: 48569,
    loadData: 1528958,
    applyBlock: 496981,
    storeResult: 33975
  },
  {
    blockLevel: 1950181,
    dataReady: 58360,
    loadData: 3473278,
    applyBlock: 6393211,
    storeResult: 39142
  },
  {
    blockLevel: 1950182,
    dataReady: 387925,
    loadData: 495461,
    applyBlock: 5927719,
    storeResult: 21285
  },
  {
    blockLevel: 1950183,
    dataReady: 103566,
    loadData: 829163,
    applyBlock: 1744676,
    storeResult: 33645
  },
  {
    blockLevel: 1950184,
    dataReady: 156079,
    loadData: 3279614,
    applyBlock: 6926902,
    storeResult: 41310
  },
  {
    blockLevel: 1950185,
    dataReady: 266339,
    loadData: 2870849,
    applyBlock: 1092901,
    storeResult: 44551
  },
  {
    blockLevel: 1950186,
    dataReady: 424609,
    loadData: 779191,
    applyBlock: 624389,
    storeResult: 166
  },
  {
    blockLevel: 1950187,
    dataReady: 404478,
    loadData: 2018961,
    applyBlock: 6452899,
    storeResult: 29697
  },
  {
    blockLevel: 1950188,
    dataReady: 345155,
    loadData: 3474854,
    applyBlock: 1000412,
    storeResult: 8113
  },
  {
    blockLevel: 1950189,
    dataReady: 388464,
    loadData: 3214127,
    applyBlock: 5268048,
    storeResult: 47674
  },
  {
    blockLevel: 1950190,
    dataReady: 38828,
    loadData: 2155321,
    applyBlock: 5334697,
    storeResult: 11544
  },
  {
    blockLevel: 1950191,
    dataReady: 200220,
    loadData: 1526120,
    applyBlock: 5496817,
    storeResult: 37995
  },
  {
    blockLevel: 1950192,
    dataReady: 260346,
    loadData: 2943716,
    applyBlock: 3854309,
    storeResult: 46999
  },
  {
    blockLevel: 1950193,
    dataReady: 457385,
    loadData: 1944507,
    applyBlock: 427717,
    storeResult: 12971
  },
  {
    blockLevel: 1950194,
    dataReady: 380705,
    loadData: 3444919,
    applyBlock: 5600985,
    storeResult: 17934
  },
  {
    blockLevel: 1950195,
    dataReady: 264709,
    loadData: 2094879,
    applyBlock: 4936923,
    storeResult: 19829
  },
  {
    blockLevel: 1950196,
    dataReady: 148800,
    loadData: 3226719,
    applyBlock: 6338777,
    storeResult: 139
  },
  {
    blockLevel: 1950197,
    dataReady: 307485,
    loadData: 2249603,
    applyBlock: 5868655,
    storeResult: 2930
  },
  {
    blockLevel: 1950198,
    dataReady: 147665,
    loadData: 1091189,
    applyBlock: 4248259,
    storeResult: 679
  },
  {
    blockLevel: 1950199,
    dataReady: 408357,
    loadData: 996173,
    applyBlock: 1795061,
    storeResult: 29584
  },
  {
    blockLevel: 1950200,
    dataReady: 55609,
    loadData: 704379,
    applyBlock: 2729712,
    storeResult: 28801
  },
  {
    blockLevel: 1950201,
    dataReady: 81644,
    loadData: 2976383,
    applyBlock: 4642906,
    storeResult: 14570
  },
  {
    blockLevel: 1950202,
    dataReady: 482190,
    loadData: 610976,
    applyBlock: 4738640,
    storeResult: 43440
  },
  {
    blockLevel: 1950203,
    dataReady: 188370,
    loadData: 2543894,
    applyBlock: 2156343,
    storeResult: 35610
  },
  {
    blockLevel: 1950204,
    dataReady: 192727,
    loadData: 309912,
    applyBlock: 3146224,
    storeResult: 18194
  },
  {
    blockLevel: 1950205,
    dataReady: 46311,
    loadData: 1653171,
    applyBlock: 1223840,
    storeResult: 20441
  },
  {
    blockLevel: 1950206,
    dataReady: 408537,
    loadData: 1028663,
    applyBlock: 1533057,
    storeResult: 30074
  },
  {
    blockLevel: 1950207,
    dataReady: 53919,
    loadData: 2970522,
    applyBlock: 3221103,
    storeResult: 18698
  },
  {
    blockLevel: 1950208,
    dataReady: 419210,
    loadData: 308507,
    applyBlock: 6929283,
    storeResult: 24258
  },
  {
    blockLevel: 1950209,
    dataReady: 128000,
    loadData: 2223156,
    applyBlock: 1983024,
    storeResult: 10790
  },
  {
    blockLevel: 1950210,
    dataReady: 487301,
    loadData: 1075491,
    applyBlock: 2054470,
    storeResult: 45955
  },
  {
    blockLevel: 1950211,
    dataReady: 421621,
    loadData: 2265204,
    applyBlock: 3515531,
    storeResult: 29442
  },
  {
    blockLevel: 1950212,
    dataReady: 397038,
    loadData: 2072176,
    applyBlock: 1970448,
    storeResult: 28099
  },
  {
    blockLevel: 1950213,
    dataReady: 27599,
    loadData: 672579,
    applyBlock: 3286122,
    storeResult: 21368
  },
  {
    blockLevel: 1950214,
    dataReady: 257177,
    loadData: 968837,
    applyBlock: 289625,
    storeResult: 45375
  },
  {
    blockLevel: 1950215,
    dataReady: 205604,
    loadData: 1442914,
    applyBlock: 1994413,
    storeResult: 35359
  },
  {
    blockLevel: 1950216,
    dataReady: 44234,
    loadData: 2860769,
    applyBlock: 5475585,
    storeResult: 15092
  },
  {
    blockLevel: 1950217,
    dataReady: 28656,
    loadData: 1541143,
    applyBlock: 1321211,
    storeResult: 19464
  },
  {
    blockLevel: 1950218,
    dataReady: 241503,
    loadData: 1441137,
    applyBlock: 5414268,
    storeResult: 44570
  },
  {
    blockLevel: 1950219,
    dataReady: 314654,
    loadData: 620809,
    applyBlock: 4187825,
    storeResult: 10709
  },
  {
    blockLevel: 1950220,
    dataReady: 291826,
    loadData: 2719319,
    applyBlock: 5701793,
    storeResult: 22520
  },
  {
    blockLevel: 1950221,
    dataReady: 229073,
    loadData: 1213668,
    applyBlock: 3847715,
    storeResult: 3187
  },
  {
    blockLevel: 1950222,
    dataReady: 339110,
    loadData: 220367,
    applyBlock: 4346635,
    storeResult: 22753
  },
  {
    blockLevel: 1950223,
    dataReady: 52345,
    loadData: 355732,
    applyBlock: 4971924,
    storeResult: 5615
  },
  {
    blockLevel: 1950224,
    dataReady: 59885,
    loadData: 2657362,
    applyBlock: 2888361,
    storeResult: 48976
  },
  {
    blockLevel: 1950225,
    dataReady: 352844,
    loadData: 1143114,
    applyBlock: 951638,
    storeResult: 40457
  },
  {
    blockLevel: 1950226,
    dataReady: 262818,
    loadData: 1974226,
    applyBlock: 2153516,
    storeResult: 13707
  },
  {
    blockLevel: 1950227,
    dataReady: 113524,
    loadData: 1595272,
    applyBlock: 2916549,
    storeResult: 45516
  },
  {
    blockLevel: 1950228,
    dataReady: 151200,
    loadData: 1925123,
    applyBlock: 1177224,
    storeResult: 20067
  },
  {
    blockLevel: 1950229,
    dataReady: 326521,
    loadData: 3077032,
    applyBlock: 2232846,
    storeResult: 27037
  },
  {
    blockLevel: 1950230,
    dataReady: 371926,
    loadData: 2814417,
    applyBlock: 6819651,
    storeResult: 40605
  },
  {
    blockLevel: 1950231,
    dataReady: 285176,
    loadData: 638595,
    applyBlock: 2429420,
    storeResult: 26888
  },
  {
    blockLevel: 1950232,
    dataReady: 34148,
    loadData: 2537661,
    applyBlock: 2376165,
    storeResult: 4301
  },
  {
    blockLevel: 1950233,
    dataReady: 324614,
    loadData: 3484148,
    applyBlock: 4697093,
    storeResult: 41226
  },
  {
    blockLevel: 1950234,
    dataReady: 383318,
    loadData: 2757059,
    applyBlock: 928093,
    storeResult: 48965
  },
  {
    blockLevel: 1950235,
    dataReady: 260480,
    loadData: 1897591,
    applyBlock: 4910015,
    storeResult: 34991
  },
  {
    blockLevel: 1950236,
    dataReady: 232693,
    loadData: 3346411,
    applyBlock: 2018338,
    storeResult: 28249
  },
  {
    blockLevel: 1950237,
    dataReady: 68189,
    loadData: 1230388,
    applyBlock: 2224517,
    storeResult: 22594
  },
  {
    blockLevel: 1950238,
    dataReady: 235653,
    loadData: 3407839,
    applyBlock: 3176289,
    storeResult: 1385
  },
  {
    blockLevel: 1950239,
    dataReady: 430075,
    loadData: 1824470,
    applyBlock: 5462249,
    storeResult: 14037
  },
  {
    blockLevel: 1950240,
    dataReady: 148613,
    loadData: 1760474,
    applyBlock: 2602641,
    storeResult: 11325
  },
  {
    blockLevel: 1950241,
    dataReady: 448450,
    loadData: 2569647,
    applyBlock: 4420374,
    storeResult: 12575
  },
  {
    blockLevel: 1950242,
    dataReady: 445830,
    loadData: 2851736,
    applyBlock: 4931614,
    storeResult: 4360
  },
  {
    blockLevel: 1950243,
    dataReady: 330047,
    loadData: 1572433,
    applyBlock: 6442785,
    storeResult: 45406
  },
  {
    blockLevel: 1950244,
    dataReady: 326714,
    loadData: 1245273,
    applyBlock: 3980903,
    storeResult: 5769
  },
  {
    blockLevel: 1950245,
    dataReady: 107446,
    loadData: 3333727,
    applyBlock: 1103279,
    storeResult: 42442
  },
  {
    blockLevel: 1950246,
    dataReady: 420693,
    loadData: 1216612,
    applyBlock: 2459014,
    storeResult: 10118
  },
  {
    blockLevel: 1950247,
    dataReady: 15525,
    loadData: 3059636,
    applyBlock: 2246050,
    storeResult: 27858
  },
  {
    blockLevel: 1950248,
    dataReady: 465439,
    loadData: 1663034,
    applyBlock: 2928243,
    storeResult: 46855
  },
  {
    blockLevel: 1950249,
    dataReady: 483842,
    loadData: 3218266,
    applyBlock: 674288,
    storeResult: 11710
  },
  {
    blockLevel: 1950250,
    dataReady: 32478,
    loadData: 3157988,
    applyBlock: 1289854,
    storeResult: 4038
  },
  {
    blockLevel: 1950251,
    dataReady: 140290,
    loadData: 899920,
    applyBlock: 6812322,
    storeResult: 10147
  },
  {
    blockLevel: 1950252,
    dataReady: 244761,
    loadData: 422879,
    applyBlock: 2401372,
    storeResult: 12698
  },
  {
    blockLevel: 1950253,
    dataReady: 293142,
    loadData: 3101213,
    applyBlock: 4843792,
    storeResult: 7269
  },
  {
    blockLevel: 1950254,
    dataReady: 130762,
    loadData: 456197,
    applyBlock: 6975190,
    storeResult: 19495
  },
  {
    blockLevel: 1950255,
    dataReady: 384402,
    loadData: 2365184,
    applyBlock: 2971336,
    storeResult: 11338
  },
  {
    blockLevel: 1950256,
    dataReady: 114907,
    loadData: 2694768,
    applyBlock: 1473439,
    storeResult: 678
  },
  {
    blockLevel: 1950257,
    dataReady: 32383,
    loadData: 287213,
    applyBlock: 3443711,
    storeResult: 43166
  },
  {
    blockLevel: 1950258,
    dataReady: 182469,
    loadData: 768741,
    applyBlock: 4763256,
    storeResult: 21394
  },
  {
    blockLevel: 1950259,
    dataReady: 465155,
    loadData: 820553,
    applyBlock: 1851451,
    storeResult: 47831
  },
  {
    blockLevel: 1950260,
    dataReady: 195124,
    loadData: 2243729,
    applyBlock: 2131095,
    storeResult: 31669
  },
  {
    blockLevel: 1950261,
    dataReady: 487845,
    loadData: 1393898,
    applyBlock: 6391331,
    storeResult: 27486
  },
  {
    blockLevel: 1950262,
    dataReady: 221535,
    loadData: 2569165,
    applyBlock: 4243587,
    storeResult: 8402
  },
  {
    blockLevel: 1950263,
    dataReady: 220680,
    loadData: 3400881,
    applyBlock: 2314887,
    storeResult: 26326
  },
  {
    blockLevel: 1950264,
    dataReady: 89800,
    loadData: 167680,
    applyBlock: 2873474,
    storeResult: 10416
  },
  {
    blockLevel: 1950265,
    dataReady: 349360,
    loadData: 488255,
    applyBlock: 2536893,
    storeResult: 13193
  },
  {
    blockLevel: 1950266,
    dataReady: 32719,
    loadData: 1622198,
    applyBlock: 1429167,
    storeResult: 10634
  },
  {
    blockLevel: 1950267,
    dataReady: 106387,
    loadData: 484525,
    applyBlock: 3838402,
    storeResult: 24399
  },
  {
    blockLevel: 1950268,
    dataReady: 292573,
    loadData: 2630549,
    applyBlock: 6431699,
    storeResult: 1048
  },
  {
    blockLevel: 1950269,
    dataReady: 250154,
    loadData: 3302474,
    applyBlock: 5340091,
    storeResult: 45844
  },
  {
    blockLevel: 1950270,
    dataReady: 306750,
    loadData: 1626008,
    applyBlock: 2498822,
    storeResult: 18746
  },
  {
    blockLevel: 1950271,
    dataReady: 405637,
    loadData: 3251569,
    applyBlock: 763660,
    storeResult: 31788
  },
  {
    blockLevel: 1950272,
    dataReady: 84588,
    loadData: 2155342,
    applyBlock: 6213845,
    storeResult: 33962
  },
  {
    blockLevel: 1950273,
    dataReady: 310684,
    loadData: 2396609,
    applyBlock: 1022739,
    storeResult: 18875
  },
  {
    blockLevel: 1950274,
    dataReady: 47209,
    loadData: 226299,
    applyBlock: 3444962,
    storeResult: 22337
  },
  {
    blockLevel: 1950275,
    dataReady: 285291,
    loadData: 271074,
    applyBlock: 483498,
    storeResult: 18724
  },
  {
    blockLevel: 1950276,
    dataReady: 116145,
    loadData: 3174111,
    applyBlock: 458241,
    storeResult: 48714
  },
  {
    blockLevel: 1950277,
    dataReady: 274184,
    loadData: 2720918,
    applyBlock: 5898952,
    storeResult: 2876
  },
  {
    blockLevel: 1950278,
    dataReady: 77804,
    loadData: 927849,
    applyBlock: 5068314,
    storeResult: 23544
  },
  {
    blockLevel: 1950279,
    dataReady: 109091,
    loadData: 2642379,
    applyBlock: 1210906,
    storeResult: 35549
  },
  {
    blockLevel: 1950280,
    dataReady: 456521,
    loadData: 1509834,
    applyBlock: 3756752,
    storeResult: 17545
  },
  {
    blockLevel: 1950281,
    dataReady: 189433,
    loadData: 469878,
    applyBlock: 2229989,
    storeResult: 44302
  },
  {
    blockLevel: 1950282,
    dataReady: 369760,
    loadData: 2793382,
    applyBlock: 4772253,
    storeResult: 26072
  },
  {
    blockLevel: 1950283,
    dataReady: 355293,
    loadData: 1529850,
    applyBlock: 2219456,
    storeResult: 31073
  },
  {
    blockLevel: 1950284,
    dataReady: 475084,
    loadData: 176602,
    applyBlock: 2961546,
    storeResult: 14639
  },
  {
    blockLevel: 1950285,
    dataReady: 468892,
    loadData: 1425490,
    applyBlock: 3692855,
    storeResult: 15503
  },
  {
    blockLevel: 1950286,
    dataReady: 297038,
    loadData: 850516,
    applyBlock: 5991963,
    storeResult: 40808
  },
  {
    blockLevel: 1950287,
    dataReady: 412538,
    loadData: 482308,
    applyBlock: 1537202,
    storeResult: 42034
  },
  {
    blockLevel: 1950288,
    dataReady: 477580,
    loadData: 736480,
    applyBlock: 4414856,
    storeResult: 1201
  },
  {
    blockLevel: 1950289,
    dataReady: 323071,
    loadData: 767474,
    applyBlock: 1970174,
    storeResult: 49629
  },
  {
    blockLevel: 1950290,
    dataReady: 190358,
    loadData: 2444336,
    applyBlock: 6314255,
    storeResult: 35887
  },
  {
    blockLevel: 1950291,
    dataReady: 397123,
    loadData: 583769,
    applyBlock: 2406425,
    storeResult: 22699
  },
  {
    blockLevel: 1950292,
    dataReady: 383427,
    loadData: 2358853,
    applyBlock: 3127008,
    storeResult: 24007
  },
  {
    blockLevel: 1950293,
    dataReady: 94336,
    loadData: 3360822,
    applyBlock: 2843158,
    storeResult: 48957
  },
  {
    blockLevel: 1950294,
    dataReady: 275051,
    loadData: 2782540,
    applyBlock: 2514494,
    storeResult: 4995
  },
  {
    blockLevel: 1950295,
    dataReady: 401528,
    loadData: 425977,
    applyBlock: 1441566,
    storeResult: 117
  },
  {
    blockLevel: 1950296,
    dataReady: 170236,
    loadData: 2221503,
    applyBlock: 3012807,
    storeResult: 31461
  },
  {
    blockLevel: 1950297,
    dataReady: 403103,
    loadData: 2790189,
    applyBlock: 5034293,
    storeResult: 22549
  },
  {
    blockLevel: 1950298,
    dataReady: 290742,
    loadData: 2021332,
    applyBlock: 5427168,
    storeResult: 35896
  },
  {
    blockLevel: 1950299,
    dataReady: 140467,
    loadData: 1948355,
    applyBlock: 5602956,
    storeResult: 35982
  },
  {
    blockLevel: 1950300,
    dataReady: 221676,
    loadData: 3038744,
    applyBlock: 3147920,
    storeResult: 47035
  },
  {
    blockLevel: 1950301,
    dataReady: 268459,
    loadData: 2427977,
    applyBlock: 3202810,
    storeResult: 46420
  },
  {
    blockLevel: 1950302,
    dataReady: 109900,
    loadData: 3095928,
    applyBlock: 1399880,
    storeResult: 5994
  },
  {
    blockLevel: 1950303,
    dataReady: 272631,
    loadData: 3220921,
    applyBlock: 3581674,
    storeResult: 48575
  },
  {
    blockLevel: 1950304,
    dataReady: 284641,
    loadData: 955253,
    applyBlock: 3070154,
    storeResult: 5457
  },
  {
    blockLevel: 1950305,
    dataReady: 260553,
    loadData: 2223794,
    applyBlock: 2430785,
    storeResult: 3335
  },
  {
    blockLevel: 1950306,
    dataReady: 406238,
    loadData: 2363991,
    applyBlock: 6107228,
    storeResult: 6527
  },
  {
    blockLevel: 1950307,
    dataReady: 465715,
    loadData: 591001,
    applyBlock: 4599982,
    storeResult: 12968
  },
  {
    blockLevel: 1950308,
    dataReady: 478151,
    loadData: 1506638,
    applyBlock: 4560510,
    storeResult: 3974
  },
  {
    blockLevel: 1950309,
    dataReady: 54956,
    loadData: 1197849,
    applyBlock: 6642117,
    storeResult: 37798
  },
  {
    blockLevel: 1950310,
    dataReady: 138890,
    loadData: 116345,
    applyBlock: 4983494,
    storeResult: 49114
  },
  {
    blockLevel: 1950311,
    dataReady: 103691,
    loadData: 2862667,
    applyBlock: 4956406,
    storeResult: 23289
  },
  {
    blockLevel: 1950312,
    dataReady: 334321,
    loadData: 2798392,
    applyBlock: 3118024,
    storeResult: 26377
  },
  {
    blockLevel: 1950313,
    dataReady: 267432,
    loadData: 2148379,
    applyBlock: 2396079,
    storeResult: 133
  },
  {
    blockLevel: 1950314,
    dataReady: 358246,
    loadData: 333603,
    applyBlock: 3704759,
    storeResult: 35144
  },
  {
    blockLevel: 1950315,
    dataReady: 75005,
    loadData: 2752726,
    applyBlock: 4786248,
    storeResult: 13867
  },
  {
    blockLevel: 1950316,
    dataReady: 173493,
    loadData: 2409801,
    applyBlock: 913507,
    storeResult: 49783
  },
  {
    blockLevel: 1950317,
    dataReady: 143449,
    loadData: 1481119,
    applyBlock: 4006335,
    storeResult: 41953
  },
  {
    blockLevel: 1950318,
    dataReady: 464527,
    loadData: 594224,
    applyBlock: 4555584,
    storeResult: 460
  },
  {
    blockLevel: 1950319,
    dataReady: 305543,
    loadData: 518128,
    applyBlock: 2286890,
    storeResult: 42167
  },
  {
    blockLevel: 1950320,
    dataReady: 224836,
    loadData: 2453777,
    applyBlock: 6487620,
    storeResult: 33662
  },
  {
    blockLevel: 1950321,
    dataReady: 237449,
    loadData: 2375903,
    applyBlock: 1788598,
    storeResult: 19739
  },
  {
    blockLevel: 1950322,
    dataReady: 440306,
    loadData: 2402576,
    applyBlock: 5763749,
    storeResult: 34997
  },
  {
    blockLevel: 1950323,
    dataReady: 248965,
    loadData: 2934272,
    applyBlock: 6118326,
    storeResult: 4213
  },
  {
    blockLevel: 1950324,
    dataReady: 283605,
    loadData: 2140941,
    applyBlock: 6561915,
    storeResult: 28356
  },
  {
    blockLevel: 1950325,
    dataReady: 21375,
    loadData: 745458,
    applyBlock: 6659158,
    storeResult: 4926
  },
  {
    blockLevel: 1950326,
    dataReady: 457362,
    loadData: 1789300,
    applyBlock: 399632,
    storeResult: 47221
  },
  {
    blockLevel: 1950327,
    dataReady: 233437,
    loadData: 2545637,
    applyBlock: 265610,
    storeResult: 48570
  },
  {
    blockLevel: 1950328,
    dataReady: 432381,
    loadData: 3290590,
    applyBlock: 6958094,
    storeResult: 47403
  },
  {
    blockLevel: 1950329,
    dataReady: 196865,
    loadData: 1221652,
    applyBlock: 4495041,
    storeResult: 39046
  },
  {
    blockLevel: 1950330,
    dataReady: 315530,
    loadData: 2094655,
    applyBlock: 5881291,
    storeResult: 28168
  },
  {
    blockLevel: 1950331,
    dataReady: 401907,
    loadData: 3156470,
    applyBlock: 2362151,
    storeResult: 17090
  },
  {
    blockLevel: 1950332,
    dataReady: 140384,
    loadData: 3384065,
    applyBlock: 4148135,
    storeResult: 6048
  },
  {
    blockLevel: 1950333,
    dataReady: 472778,
    loadData: 663549,
    applyBlock: 3064217,
    storeResult: 1949
  },
  {
    blockLevel: 1950334,
    dataReady: 224071,
    loadData: 3181788,
    applyBlock: 593503,
    storeResult: 41342
  },
  {
    blockLevel: 1950335,
    dataReady: 216157,
    loadData: 432770,
    applyBlock: 6367399,
    storeResult: 16287
  },
  {
    blockLevel: 1950336,
    dataReady: 326473,
    loadData: 2531744,
    applyBlock: 4133363,
    storeResult: 21400
  },
  {
    blockLevel: 1950337,
    dataReady: 336875,
    loadData: 1213940,
    applyBlock: 2039897,
    storeResult: 11428
  },
  {
    blockLevel: 1950338,
    dataReady: 442395,
    loadData: 447477,
    applyBlock: 1977369,
    storeResult: 37887
  },
  {
    blockLevel: 1950339,
    dataReady: 322453,
    loadData: 2001706,
    applyBlock: 495052,
    storeResult: 8520
  },
  {
    blockLevel: 1950340,
    dataReady: 210827,
    loadData: 237519,
    applyBlock: 4229832,
    storeResult: 20561
  },
  {
    blockLevel: 1950341,
    dataReady: 189915,
    loadData: 225061,
    applyBlock: 4968239,
    storeResult: 45807
  },
  {
    blockLevel: 1950342,
    dataReady: 16259,
    loadData: 1980316,
    applyBlock: 708587,
    storeResult: 10258
  },
  {
    blockLevel: 1950343,
    dataReady: 38716,
    loadData: 316970,
    applyBlock: 6182120,
    storeResult: 25978
  },
  {
    blockLevel: 1950344,
    dataReady: 366075,
    loadData: 2169722,
    applyBlock: 5554086,
    storeResult: 7970
  },
  {
    blockLevel: 1950345,
    dataReady: 62187,
    loadData: 2006185,
    applyBlock: 5495383,
    storeResult: 44195
  },
  {
    blockLevel: 1950346,
    dataReady: 413487,
    loadData: 3489462,
    applyBlock: 1373592,
    storeResult: 35734
  },
  {
    blockLevel: 1950347,
    dataReady: 109551,
    loadData: 2802621,
    applyBlock: 5741962,
    storeResult: 1568
  },
  {
    blockLevel: 1950348,
    dataReady: 25247,
    loadData: 2338184,
    applyBlock: 1314337,
    storeResult: 24532
  },
  {
    blockLevel: 1950349,
    dataReady: 470024,
    loadData: 1687013,
    applyBlock: 5805316,
    storeResult: 24605
  },
  {
    blockLevel: 1950350,
    dataReady: 200749,
    loadData: 1659768,
    applyBlock: 3059803,
    storeResult: 6777
  },
  {
    blockLevel: 1950351,
    dataReady: 89918,
    loadData: 1838512,
    applyBlock: 6515122,
    storeResult: 31237
  },
  {
    blockLevel: 1950352,
    dataReady: 236940,
    loadData: 437028,
    applyBlock: 454556,
    storeResult: 8994
  },
  {
    blockLevel: 1950353,
    dataReady: 106742,
    loadData: 3021285,
    applyBlock: 3405749,
    storeResult: 8953
  },
  {
    blockLevel: 1950354,
    dataReady: 225984,
    loadData: 1663456,
    applyBlock: 5679318,
    storeResult: 9579
  },
  {
    blockLevel: 1950355,
    dataReady: 51058,
    loadData: 3157479,
    applyBlock: 1464162,
    storeResult: 25038
  },
  {
    blockLevel: 1950356,
    dataReady: 390214,
    loadData: 3053049,
    applyBlock: 2130853,
    storeResult: 32570
  },
  {
    blockLevel: 1950357,
    dataReady: 215178,
    loadData: 1854437,
    applyBlock: 1634719,
    storeResult: 43754
  },
  {
    blockLevel: 1950358,
    dataReady: 240475,
    loadData: 2871868,
    applyBlock: 5213724,
    storeResult: 41198
  },
  {
    blockLevel: 1950359,
    dataReady: 14351,
    loadData: 187339,
    applyBlock: 6171897,
    storeResult: 45506
  },
  {
    blockLevel: 1950360,
    dataReady: 152398,
    loadData: 603382,
    applyBlock: 2653572,
    storeResult: 10720
  },
  {
    blockLevel: 1950361,
    dataReady: 377170,
    loadData: 1704267,
    applyBlock: 6774432,
    storeResult: 38069
  },
  {
    blockLevel: 1950362,
    dataReady: 432377,
    loadData: 2706184,
    applyBlock: 5924118,
    storeResult: 244
  },
  {
    blockLevel: 1950363,
    dataReady: 67884,
    loadData: 1666383,
    applyBlock: 5366654,
    storeResult: 41367
  },
  {
    blockLevel: 1950364,
    dataReady: 183843,
    loadData: 871624,
    applyBlock: 1970893,
    storeResult: 24669
  },
  {
    blockLevel: 1950365,
    dataReady: 156640,
    loadData: 2896312,
    applyBlock: 4772506,
    storeResult: 6807
  },
  {
    blockLevel: 1950366,
    dataReady: 457205,
    loadData: 305332,
    applyBlock: 4031147,
    storeResult: 33740
  },
  {
    blockLevel: 1950367,
    dataReady: 239468,
    loadData: 2441567,
    applyBlock: 4057695,
    storeResult: 1420
  },
  {
    blockLevel: 1950368,
    dataReady: 484030,
    loadData: 436774,
    applyBlock: 3704838,
    storeResult: 31002
  },
  {
    blockLevel: 1950369,
    dataReady: 155099,
    loadData: 2668172,
    applyBlock: 6630738,
    storeResult: 7219
  },
  {
    blockLevel: 1950370,
    dataReady: 235236,
    loadData: 3206316,
    applyBlock: 5930686,
    storeResult: 36392
  },
  {
    blockLevel: 1950371,
    dataReady: 380514,
    loadData: 2369850,
    applyBlock: 2154355,
    storeResult: 21126
  },
  {
    blockLevel: 1950372,
    dataReady: 466870,
    loadData: 2761646,
    applyBlock: 310878,
    storeResult: 32693
  },
  {
    blockLevel: 1950373,
    dataReady: 266667,
    loadData: 3274169,
    applyBlock: 568405,
    storeResult: 41989
  },
  {
    blockLevel: 1950374,
    dataReady: 445173,
    loadData: 1454326,
    applyBlock: 3197566,
    storeResult: 16052
  },
  {
    blockLevel: 1950375,
    dataReady: 366453,
    loadData: 2820257,
    applyBlock: 1402562,
    storeResult: 14413
  },
  {
    blockLevel: 1950376,
    dataReady: 116124,
    loadData: 2475185,
    applyBlock: 2030840,
    storeResult: 42813
  },
  {
    blockLevel: 1950377,
    dataReady: 282571,
    loadData: 142059,
    applyBlock: 6054850,
    storeResult: 38551
  },
  {
    blockLevel: 1950378,
    dataReady: 296283,
    loadData: 263233,
    applyBlock: 3193282,
    storeResult: 5362
  },
  {
    blockLevel: 1950379,
    dataReady: 142651,
    loadData: 1298638,
    applyBlock: 1406529,
    storeResult: 10263
  },
  {
    blockLevel: 1950380,
    dataReady: 186752,
    loadData: 1865182,
    applyBlock: 5277338,
    storeResult: 41344
  },
  {
    blockLevel: 1950381,
    dataReady: 472412,
    loadData: 2442493,
    applyBlock: 5184077,
    storeResult: 38134
  },
  {
    blockLevel: 1950382,
    dataReady: 287525,
    loadData: 1648825,
    applyBlock: 5024415,
    storeResult: 19861
  },
  {
    blockLevel: 1950383,
    dataReady: 106976,
    loadData: 825829,
    applyBlock: 3816150,
    storeResult: 32227
  },
  {
    blockLevel: 1950384,
    dataReady: 299917,
    loadData: 3208570,
    applyBlock: 6374029,
    storeResult: 11452
  },
  {
    blockLevel: 1950385,
    dataReady: 296341,
    loadData: 909986,
    applyBlock: 2915281,
    storeResult: 7860
  },
  {
    blockLevel: 1950386,
    dataReady: 253659,
    loadData: 2692515,
    applyBlock: 3161597,
    storeResult: 40376
  },
  {
    blockLevel: 1950387,
    dataReady: 335563,
    loadData: 1438614,
    applyBlock: 328302,
    storeResult: 15182
  },
  {
    blockLevel: 1950388,
    dataReady: 42664,
    loadData: 2844948,
    applyBlock: 2135539,
    storeResult: 43960
  },
  {
    blockLevel: 1950389,
    dataReady: 439886,
    loadData: 3150700,
    applyBlock: 2565271,
    storeResult: 5136
  },
  {
    blockLevel: 1950390,
    dataReady: 285137,
    loadData: 720525,
    applyBlock: 5366263,
    storeResult: 12733
  },
  {
    blockLevel: 1950391,
    dataReady: 249820,
    loadData: 1498077,
    applyBlock: 4140504,
    storeResult: 29669
  },
  {
    blockLevel: 1950392,
    dataReady: 243899,
    loadData: 1791964,
    applyBlock: 5433497,
    storeResult: 10833
  },
  {
    blockLevel: 1950393,
    dataReady: 33810,
    loadData: 1786809,
    applyBlock: 2033673,
    storeResult: 44885
  },
  {
    blockLevel: 1950394,
    dataReady: 235521,
    loadData: 853544,
    applyBlock: 6529245,
    storeResult: 1863
  },
  {
    blockLevel: 1950395,
    dataReady: 422809,
    loadData: 709394,
    applyBlock: 2968835,
    storeResult: 761
  },
  {
    blockLevel: 1950396,
    dataReady: 263705,
    loadData: 2954890,
    applyBlock: 2296562,
    storeResult: 28104
  },
  {
    blockLevel: 1950397,
    dataReady: 314361,
    loadData: 1593359,
    applyBlock: 6625401,
    storeResult: 39233
  },
  {
    blockLevel: 1950398,
    dataReady: 345258,
    loadData: 166199,
    applyBlock: 4336293,
    storeResult: 2860
  },
  {
    blockLevel: 1950399,
    dataReady: 447689,
    loadData: 1124069,
    applyBlock: 1094850,
    storeResult: 44360
  },
  {
    blockLevel: 1950400,
    dataReady: 461381,
    loadData: 3067029,
    applyBlock: 1944374,
    storeResult: 28290
  },
  {
    blockLevel: 1950401,
    dataReady: 217878,
    loadData: 2851016,
    applyBlock: 4819337,
    storeResult: 37734
  },
  {
    blockLevel: 1950402,
    dataReady: 334276,
    loadData: 2973727,
    applyBlock: 5525913,
    storeResult: 27659
  },
  {
    blockLevel: 1950403,
    dataReady: 134379,
    loadData: 1635578,
    applyBlock: 1470810,
    storeResult: 22166
  },
  {
    blockLevel: 1950404,
    dataReady: 149809,
    loadData: 2435716,
    applyBlock: 2650378,
    storeResult: 26737
  },
  {
    blockLevel: 1950405,
    dataReady: 295450,
    loadData: 1079489,
    applyBlock: 4969349,
    storeResult: 32296
  },
  {
    blockLevel: 1950406,
    dataReady: 204220,
    loadData: 2698777,
    applyBlock: 6261546,
    storeResult: 1746
  },
  {
    blockLevel: 1950407,
    dataReady: 93471,
    loadData: 2460595,
    applyBlock: 6291964,
    storeResult: 28224
  },
  {
    blockLevel: 1950408,
    dataReady: 436469,
    loadData: 358828,
    applyBlock: 2058720,
    storeResult: 35645
  },
  {
    blockLevel: 1950409,
    dataReady: 52468,
    loadData: 2199737,
    applyBlock: 6115154,
    storeResult: 24216
  },
  {
    blockLevel: 1950410,
    dataReady: 203970,
    loadData: 1671279,
    applyBlock: 2443726,
    storeResult: 24556
  },
  {
    blockLevel: 1950411,
    dataReady: 108608,
    loadData: 3204099,
    applyBlock: 6769181,
    storeResult: 1403
  },
  {
    blockLevel: 1950412,
    dataReady: 117621,
    loadData: 3100994,
    applyBlock: 4999313,
    storeResult: 38382
  },
  {
    blockLevel: 1950413,
    dataReady: 132493,
    loadData: 2091836,
    applyBlock: 6232553,
    storeResult: 23635
  },
  {
    blockLevel: 1950414,
    dataReady: 497404,
    loadData: 1468792,
    applyBlock: 6977346,
    storeResult: 27766
  },
  {
    blockLevel: 1950415,
    dataReady: 191708,
    loadData: 2233390,
    applyBlock: 5377655,
    storeResult: 15181
  },
  {
    blockLevel: 1950416,
    dataReady: 74603,
    loadData: 2698980,
    applyBlock: 287590,
    storeResult: 6208
  },
  {
    blockLevel: 1950417,
    dataReady: 97349,
    loadData: 135316,
    applyBlock: 3867957,
    storeResult: 18812
  },
  {
    blockLevel: 1950418,
    dataReady: 399372,
    loadData: 3238190,
    applyBlock: 6664875,
    storeResult: 16044
  },
  {
    blockLevel: 1950419,
    dataReady: 139429,
    loadData: 1604074,
    applyBlock: 712874,
    storeResult: 34305
  },
  {
    blockLevel: 1950420,
    dataReady: 370526,
    loadData: 2175130,
    applyBlock: 2567931,
    storeResult: 23377
  },
  {
    blockLevel: 1950421,
    dataReady: 488995,
    loadData: 3414573,
    applyBlock: 1275666,
    storeResult: 45678
  },
  {
    blockLevel: 1950422,
    dataReady: 378736,
    loadData: 693419,
    applyBlock: 2450782,
    storeResult: 7396
  },
  {
    blockLevel: 1950423,
    dataReady: 443065,
    loadData: 471502,
    applyBlock: 3361018,
    storeResult: 35713
  },
  {
    blockLevel: 1950424,
    dataReady: 443565,
    loadData: 3010496,
    applyBlock: 2545854,
    storeResult: 3724
  },
  {
    blockLevel: 1950425,
    dataReady: 45972,
    loadData: 515767,
    applyBlock: 1830720,
    storeResult: 618
  },
  {
    blockLevel: 1950426,
    dataReady: 414332,
    loadData: 1048997,
    applyBlock: 4191755,
    storeResult: 44282
  },
  {
    blockLevel: 1950427,
    dataReady: 403026,
    loadData: 1190289,
    applyBlock: 2028930,
    storeResult: 6312
  },
  {
    blockLevel: 1950428,
    dataReady: 10038,
    loadData: 2954414,
    applyBlock: 3485631,
    storeResult: 3832
  },
  {
    blockLevel: 1950429,
    dataReady: 442673,
    loadData: 982384,
    applyBlock: 6041582,
    storeResult: 24490
  },
  {
    blockLevel: 1950430,
    dataReady: 451329,
    loadData: 1645374,
    applyBlock: 6669187,
    storeResult: 42060
  },
  {
    blockLevel: 1950431,
    dataReady: 296246,
    loadData: 1950338,
    applyBlock: 3607998,
    storeResult: 5880
  },
  {
    blockLevel: 1950432,
    dataReady: 458345,
    loadData: 2075115,
    applyBlock: 1622751,
    storeResult: 15067
  },
  {
    blockLevel: 1950433,
    dataReady: 362733,
    loadData: 2110946,
    applyBlock: 443818,
    storeResult: 23828
  },
  {
    blockLevel: 1950434,
    dataReady: 495171,
    loadData: 2953762,
    applyBlock: 5472429,
    storeResult: 17934
  },
  {
    blockLevel: 1950435,
    dataReady: 248601,
    loadData: 1731701,
    applyBlock: 4622019,
    storeResult: 24025
  },
  {
    blockLevel: 1950436,
    dataReady: 170145,
    loadData: 1813072,
    applyBlock: 3080338,
    storeResult: 6727
  },
  {
    blockLevel: 1950437,
    dataReady: 238318,
    loadData: 2325145,
    applyBlock: 2050891,
    storeResult: 22470
  },
  {
    blockLevel: 1950438,
    dataReady: 170339,
    loadData: 3272073,
    applyBlock: 938264,
    storeResult: 33585
  },
  {
    blockLevel: 1950439,
    dataReady: 441294,
    loadData: 2359801,
    applyBlock: 3850005,
    storeResult: 19875
  },
  {
    blockLevel: 1950440,
    dataReady: 353817,
    loadData: 2158308,
    applyBlock: 303680,
    storeResult: 30683
  },
  {
    blockLevel: 1950441,
    dataReady: 413620,
    loadData: 388019,
    applyBlock: 3578395,
    storeResult: 33011
  },
  {
    blockLevel: 1950442,
    dataReady: 351229,
    loadData: 2560479,
    applyBlock: 3578953,
    storeResult: 33976
  },
  {
    blockLevel: 1950443,
    dataReady: 493415,
    loadData: 714607,
    applyBlock: 3864392,
    storeResult: 29663
  },
  {
    blockLevel: 1950444,
    dataReady: 174657,
    loadData: 3234105,
    applyBlock: 4027507,
    storeResult: 15060
  },
  {
    blockLevel: 1950445,
    dataReady: 408098,
    loadData: 1245875,
    applyBlock: 3715738,
    storeResult: 41070
  },
  {
    blockLevel: 1950446,
    dataReady: 255060,
    loadData: 2994684,
    applyBlock: 278647,
    storeResult: 25798
  },
  {
    blockLevel: 1950447,
    dataReady: 119725,
    loadData: 2245201,
    applyBlock: 1531647,
    storeResult: 8849
  },
  {
    blockLevel: 1950448,
    dataReady: 488798,
    loadData: 2964309,
    applyBlock: 2055615,
    storeResult: 11851
  },
  {
    blockLevel: 1950449,
    dataReady: 430033,
    loadData: 1461014,
    applyBlock: 6994455,
    storeResult: 30453
  },
  {
    blockLevel: 1950450,
    dataReady: 41037,
    loadData: 3484930,
    applyBlock: 5304483,
    storeResult: 19214
  },
  {
    blockLevel: 1950451,
    dataReady: 415766,
    loadData: 1587973,
    applyBlock: 5913621,
    storeResult: 8608
  },
  {
    blockLevel: 1950452,
    dataReady: 322248,
    loadData: 2242798,
    applyBlock: 3351105,
    storeResult: 19584
  },
  {
    blockLevel: 1950453,
    dataReady: 139972,
    loadData: 2303218,
    applyBlock: 247619,
    storeResult: 2260
  },
  {
    blockLevel: 1950454,
    dataReady: 114211,
    loadData: 541204,
    applyBlock: 6952659,
    storeResult: 32320
  },
  {
    blockLevel: 1950455,
    dataReady: 70849,
    loadData: 977335,
    applyBlock: 6463711,
    storeResult: 32969
  },
  {
    blockLevel: 1950456,
    dataReady: 457819,
    loadData: 451554,
    applyBlock: 6811053,
    storeResult: 9849
  },
  {
    blockLevel: 1950457,
    dataReady: 29841,
    loadData: 1848346,
    applyBlock: 5270382,
    storeResult: 23112
  },
  {
    blockLevel: 1950458,
    dataReady: 294053,
    loadData: 1686179,
    applyBlock: 4495154,
    storeResult: 3310
  },
  {
    blockLevel: 1950459,
    dataReady: 57753,
    loadData: 305126,
    applyBlock: 1298878,
    storeResult: 40303
  },
  {
    blockLevel: 1950460,
    dataReady: 278621,
    loadData: 2432461,
    applyBlock: 6240217,
    storeResult: 20809
  },
  {
    blockLevel: 1950461,
    dataReady: 463024,
    loadData: 1493277,
    applyBlock: 6768827,
    storeResult: 41430
  },
  {
    blockLevel: 1950462,
    dataReady: 344220,
    loadData: 3063780,
    applyBlock: 2848089,
    storeResult: 32220
  },
  {
    blockLevel: 1950463,
    dataReady: 77973,
    loadData: 1368637,
    applyBlock: 4963512,
    storeResult: 4111
  },
  {
    blockLevel: 1950464,
    dataReady: 73384,
    loadData: 2109490,
    applyBlock: 2310739,
    storeResult: 34260
  },
  {
    blockLevel: 1950465,
    dataReady: 126547,
    loadData: 1559088,
    applyBlock: 3619036,
    storeResult: 29050
  },
  {
    blockLevel: 1950466,
    dataReady: 68008,
    loadData: 1477519,
    applyBlock: 4167727,
    storeResult: 22453
  },
  {
    blockLevel: 1950467,
    dataReady: 55949,
    loadData: 291685,
    applyBlock: 1136487,
    storeResult: 32638
  },
  {
    blockLevel: 1950468,
    dataReady: 428867,
    loadData: 1291805,
    applyBlock: 5491848,
    storeResult: 7274
  },
  {
    blockLevel: 1950469,
    dataReady: 375274,
    loadData: 1743290,
    applyBlock: 3963237,
    storeResult: 32336
  },
  {
    blockLevel: 1950470,
    dataReady: 331613,
    loadData: 2754040,
    applyBlock: 3797007,
    storeResult: 49395
  },
  {
    blockLevel: 1950471,
    dataReady: 477052,
    loadData: 3033171,
    applyBlock: 4251712,
    storeResult: 24726
  },
  {
    blockLevel: 1950472,
    dataReady: 210364,
    loadData: 1679787,
    applyBlock: 6864378,
    storeResult: 38767
  },
  {
    blockLevel: 1950473,
    dataReady: 386720,
    loadData: 1214228,
    applyBlock: 3279668,
    storeResult: 48540
  },
  {
    blockLevel: 1950474,
    dataReady: 309312,
    loadData: 1515243,
    applyBlock: 1187375,
    storeResult: 24744
  },
  {
    blockLevel: 1950475,
    dataReady: 410631,
    loadData: 182510,
    applyBlock: 1778581,
    storeResult: 10330
  },
  {
    blockLevel: 1950476,
    dataReady: 433030,
    loadData: 3192418,
    applyBlock: 4112361,
    storeResult: 12887
  },
  {
    blockLevel: 1950477,
    dataReady: 359198,
    loadData: 1332621,
    applyBlock: 891648,
    storeResult: 39496
  },
  {
    blockLevel: 1950478,
    dataReady: 222388,
    loadData: 2494964,
    applyBlock: 2283988,
    storeResult: 25828
  },
  {
    blockLevel: 1950479,
    dataReady: 116494,
    loadData: 1629180,
    applyBlock: 6675573,
    storeResult: 26388
  },
  {
    blockLevel: 1950480,
    dataReady: 381656,
    loadData: 1598872,
    applyBlock: 3575013,
    storeResult: 19682
  },
  {
    blockLevel: 1950481,
    dataReady: 295962,
    loadData: 1137771,
    applyBlock: 1573934,
    storeResult: 16748
  },
  {
    blockLevel: 1950482,
    dataReady: 283179,
    loadData: 1420246,
    applyBlock: 6099917,
    storeResult: 27995
  },
  {
    blockLevel: 1950483,
    dataReady: 53027,
    loadData: 466411,
    applyBlock: 3702769,
    storeResult: 31130
  },
  {
    blockLevel: 1950484,
    dataReady: 144832,
    loadData: 358917,
    applyBlock: 4576919,
    storeResult: 43965
  },
  {
    blockLevel: 1950485,
    dataReady: 217956,
    loadData: 3332208,
    applyBlock: 2672076,
    storeResult: 17273
  },
  {
    blockLevel: 1950486,
    dataReady: 384851,
    loadData: 1733358,
    applyBlock: 3855032,
    storeResult: 1453
  },
  {
    blockLevel: 1950487,
    dataReady: 95403,
    loadData: 1021685,
    applyBlock: 4019998,
    storeResult: 9324
  },
  {
    blockLevel: 1950488,
    dataReady: 16200,
    loadData: 2340926,
    applyBlock: 5868616,
    storeResult: 24589
  },
  {
    blockLevel: 1950489,
    dataReady: 106061,
    loadData: 2332168,
    applyBlock: 1865787,
    storeResult: 37323
  },
  {
    blockLevel: 1950490,
    dataReady: 149464,
    loadData: 2541371,
    applyBlock: 6315943,
    storeResult: 5914
  },
  {
    blockLevel: 1950491,
    dataReady: 272858,
    loadData: 2359406,
    applyBlock: 1865593,
    storeResult: 24863
  },
  {
    blockLevel: 1950492,
    dataReady: 314376,
    loadData: 1031231,
    applyBlock: 4475882,
    storeResult: 43872
  },
  {
    blockLevel: 1950493,
    dataReady: 156583,
    loadData: 202814,
    applyBlock: 565247,
    storeResult: 4680
  },
  {
    blockLevel: 1950494,
    dataReady: 475987,
    loadData: 2014841,
    applyBlock: 5962835,
    storeResult: 47766
  },
  {
    blockLevel: 1950495,
    dataReady: 386000,
    loadData: 1939555,
    applyBlock: 881583,
    storeResult: 2890
  },
  {
    blockLevel: 1950496,
    dataReady: 75344,
    loadData: 1683639,
    applyBlock: 4565777,
    storeResult: 36789
  },
  {
    blockLevel: 1950497,
    dataReady: 178921,
    loadData: 1467506,
    applyBlock: 4503444,
    storeResult: 18669
  },
  {
    blockLevel: 1950498,
    dataReady: 290152,
    loadData: 1069629,
    applyBlock: 6535928,
    storeResult: 12873
  },
  {
    blockLevel: 1950499,
    dataReady: 98510,
    loadData: 3152583,
    applyBlock: 1046302,
    storeResult: 5632
  },
  {
    blockLevel: 1950500,
    dataReady: 21556,
    loadData: 1509534,
    applyBlock: 2919421,
    storeResult: 29565
  },
  {
    blockLevel: 1950501,
    dataReady: 472244,
    loadData: 1421705,
    applyBlock: 997252,
    storeResult: 15464
  },
  {
    blockLevel: 1950502,
    dataReady: 474079,
    loadData: 2409861,
    applyBlock: 1006071,
    storeResult: 18629
  },
  {
    blockLevel: 1950503,
    dataReady: 377177,
    loadData: 2724250,
    applyBlock: 1584107,
    storeResult: 41691
  },
  {
    blockLevel: 1950504,
    dataReady: 484206,
    loadData: 2503334,
    applyBlock: 3863910,
    storeResult: 5095
  },
  {
    blockLevel: 1950505,
    dataReady: 451121,
    loadData: 1015010,
    applyBlock: 2859554,
    storeResult: 16182
  },
  {
    blockLevel: 1950506,
    dataReady: 104035,
    loadData: 2033291,
    applyBlock: 6433262,
    storeResult: 30969
  },
  {
    blockLevel: 1950507,
    dataReady: 50429,
    loadData: 905497,
    applyBlock: 6882397,
    storeResult: 22002
  },
  {
    blockLevel: 1950508,
    dataReady: 99562,
    loadData: 993699,
    applyBlock: 6439602,
    storeResult: 32318
  },
  {
    blockLevel: 1950509,
    dataReady: 22222,
    loadData: 918562,
    applyBlock: 4084024,
    storeResult: 25900
  },
  {
    blockLevel: 1950510,
    dataReady: 365445,
    loadData: 1775463,
    applyBlock: 6919859,
    storeResult: 38212
  },
  {
    blockLevel: 1950511,
    dataReady: 482259,
    loadData: 2766739,
    applyBlock: 847044,
    storeResult: 22935
  },
  {
    blockLevel: 1950512,
    dataReady: 52023,
    loadData: 503654,
    applyBlock: 2913793,
    storeResult: 9521
  },
  {
    blockLevel: 1950513,
    dataReady: 411926,
    loadData: 1830546,
    applyBlock: 5386960,
    storeResult: 37496
  },
  {
    blockLevel: 1950514,
    dataReady: 38251,
    loadData: 1578726,
    applyBlock: 5223260,
    storeResult: 41593
  },
  {
    blockLevel: 1950515,
    dataReady: 498582,
    loadData: 742318,
    applyBlock: 5628934,
    storeResult: 2004
  },
  {
    blockLevel: 1950516,
    dataReady: 85583,
    loadData: 818536,
    applyBlock: 1522274,
    storeResult: 24515
  },
  {
    blockLevel: 1950517,
    dataReady: 466889,
    loadData: 1466452,
    applyBlock: 1110850,
    storeResult: 3232
  },
  {
    blockLevel: 1950518,
    dataReady: 194355,
    loadData: 1416612,
    applyBlock: 4785445,
    storeResult: 25841
  },
  {
    blockLevel: 1950519,
    dataReady: 211828,
    loadData: 1219449,
    applyBlock: 5022114,
    storeResult: 49637
  },
  {
    blockLevel: 1950520,
    dataReady: 194646,
    loadData: 1140518,
    applyBlock: 3793648,
    storeResult: 48943
  },
  {
    blockLevel: 1950521,
    dataReady: 367771,
    loadData: 2397045,
    applyBlock: 4884600,
    storeResult: 27131
  },
  {
    blockLevel: 1950522,
    dataReady: 352367,
    loadData: 626951,
    applyBlock: 6770556,
    storeResult: 49244
  },
  {
    blockLevel: 1950523,
    dataReady: 341854,
    loadData: 1560817,
    applyBlock: 5106748,
    storeResult: 11473
  },
  {
    blockLevel: 1950524,
    dataReady: 253633,
    loadData: 1747968,
    applyBlock: 5333299,
    storeResult: 30346
  },
  {
    blockLevel: 1950525,
    dataReady: 219647,
    loadData: 1004947,
    applyBlock: 5009920,
    storeResult: 18048
  },
  {
    blockLevel: 1950526,
    dataReady: 271105,
    loadData: 3174659,
    applyBlock: 1967694,
    storeResult: 13242
  },
  {
    blockLevel: 1950527,
    dataReady: 348515,
    loadData: 1617016,
    applyBlock: 1529963,
    storeResult: 12755
  },
  {
    blockLevel: 1950528,
    dataReady: 395809,
    loadData: 1137444,
    applyBlock: 5398844,
    storeResult: 45891
  },
  {
    blockLevel: 1950529,
    dataReady: 283360,
    loadData: 1880224,
    applyBlock: 587029,
    storeResult: 4924
  },
  {
    blockLevel: 1950530,
    dataReady: 395173,
    loadData: 3247017,
    applyBlock: 5190349,
    storeResult: 21736
  },
  {
    blockLevel: 1950531,
    dataReady: 181726,
    loadData: 2272657,
    applyBlock: 3769955,
    storeResult: 46276
  },
  {
    blockLevel: 1950532,
    dataReady: 163189,
    loadData: 477781,
    applyBlock: 1036936,
    storeResult: 8390
  },
  {
    blockLevel: 1950533,
    dataReady: 320300,
    loadData: 161391,
    applyBlock: 6507721,
    storeResult: 39971
  },
  {
    blockLevel: 1950534,
    dataReady: 328924,
    loadData: 560604,
    applyBlock: 6488130,
    storeResult: 39199
  },
  {
    blockLevel: 1950535,
    dataReady: 64342,
    loadData: 1850970,
    applyBlock: 4041690,
    storeResult: 2736
  },
  {
    blockLevel: 1950536,
    dataReady: 220237,
    loadData: 307598,
    applyBlock: 5793683,
    storeResult: 23723
  },
  {
    blockLevel: 1950537,
    dataReady: 354001,
    loadData: 115564,
    applyBlock: 2927962,
    storeResult: 46216
  },
  {
    blockLevel: 1950538,
    dataReady: 328193,
    loadData: 1793754,
    applyBlock: 5885950,
    storeResult: 45695
  },
  {
    blockLevel: 1950539,
    dataReady: 475024,
    loadData: 2285723,
    applyBlock: 2739113,
    storeResult: 15298
  },
  {
    blockLevel: 1950540,
    dataReady: 362898,
    loadData: 1037706,
    applyBlock: 5785406,
    storeResult: 2762
  },
  {
    blockLevel: 1950541,
    dataReady: 416117,
    loadData: 3057371,
    applyBlock: 1603542,
    storeResult: 48972
  },
  {
    blockLevel: 1950542,
    dataReady: 167643,
    loadData: 3429354,
    applyBlock: 5178533,
    storeResult: 21138
  },
  {
    blockLevel: 1950543,
    dataReady: 157591,
    loadData: 3387526,
    applyBlock: 5827741,
    storeResult: 37968
  },
  {
    blockLevel: 1950544,
    dataReady: 153781,
    loadData: 855851,
    applyBlock: 6697176,
    storeResult: 48957
  },
  {
    blockLevel: 1950545,
    dataReady: 97544,
    loadData: 252330,
    applyBlock: 6761603,
    storeResult: 40041
  },
  {
    blockLevel: 1950546,
    dataReady: 474354,
    loadData: 3109941,
    applyBlock: 3299010,
    storeResult: 43545
  },
  {
    blockLevel: 1950547,
    dataReady: 434548,
    loadData: 1322420,
    applyBlock: 239633,
    storeResult: 35221
  },
  {
    blockLevel: 1950548,
    dataReady: 183554,
    loadData: 2430386,
    applyBlock: 2286812,
    storeResult: 45985
  },
  {
    blockLevel: 1950549,
    dataReady: 495897,
    loadData: 2406879,
    applyBlock: 2430027,
    storeResult: 45478
  },
  {
    blockLevel: 1950550,
    dataReady: 195872,
    loadData: 1262659,
    applyBlock: 1200562,
    storeResult: 33709
  },
  {
    blockLevel: 1950551,
    dataReady: 148788,
    loadData: 3479477,
    applyBlock: 4110103,
    storeResult: 4403
  },
  {
    blockLevel: 1950552,
    dataReady: 355398,
    loadData: 3416888,
    applyBlock: 5926848,
    storeResult: 36343
  },
  {
    blockLevel: 1950553,
    dataReady: 269974,
    loadData: 2147054,
    applyBlock: 4723443,
    storeResult: 24418
  },
  {
    blockLevel: 1950554,
    dataReady: 487973,
    loadData: 374748,
    applyBlock: 6967088,
    storeResult: 48262
  },
  {
    blockLevel: 1950555,
    dataReady: 456425,
    loadData: 101929,
    applyBlock: 4990706,
    storeResult: 24365
  },
  {
    blockLevel: 1950556,
    dataReady: 322628,
    loadData: 295211,
    applyBlock: 5127415,
    storeResult: 12619
  },
  {
    blockLevel: 1950557,
    dataReady: 255139,
    loadData: 971731,
    applyBlock: 4536612,
    storeResult: 15037
  },
  {
    blockLevel: 1950558,
    dataReady: 118521,
    loadData: 1355621,
    applyBlock: 5440295,
    storeResult: 42037
  },
  {
    blockLevel: 1950559,
    dataReady: 330695,
    loadData: 2020941,
    applyBlock: 3124977,
    storeResult: 28193
  },
  {
    blockLevel: 1950560,
    dataReady: 29184,
    loadData: 2205898,
    applyBlock: 3897757,
    storeResult: 12706
  },
  {
    blockLevel: 1950561,
    dataReady: 373567,
    loadData: 939913,
    applyBlock: 5732419,
    storeResult: 35113
  },
  {
    blockLevel: 1950562,
    dataReady: 215214,
    loadData: 3381160,
    applyBlock: 1199248,
    storeResult: 42445
  },
  {
    blockLevel: 1950563,
    dataReady: 180998,
    loadData: 762948,
    applyBlock: 2522778,
    storeResult: 9004
  },
  {
    blockLevel: 1950564,
    dataReady: 312969,
    loadData: 1358738,
    applyBlock: 5797762,
    storeResult: 1495
  },
  {
    blockLevel: 1950565,
    dataReady: 460698,
    loadData: 3123008,
    applyBlock: 3485847,
    storeResult: 21418
  },
  {
    blockLevel: 1950566,
    dataReady: 51375,
    loadData: 651606,
    applyBlock: 2605674,
    storeResult: 4531
  },
  {
    blockLevel: 1950567,
    dataReady: 303438,
    loadData: 174234,
    applyBlock: 4833702,
    storeResult: 25652
  },
  {
    blockLevel: 1950568,
    dataReady: 319506,
    loadData: 2951073,
    applyBlock: 6060875,
    storeResult: 23296
  },
  {
    blockLevel: 1950569,
    dataReady: 283414,
    loadData: 3224558,
    applyBlock: 2624811,
    storeResult: 11702
  },
  {
    blockLevel: 1950570,
    dataReady: 168493,
    loadData: 2583725,
    applyBlock: 4802775,
    storeResult: 35136
  },
  {
    blockLevel: 1950571,
    dataReady: 456276,
    loadData: 391247,
    applyBlock: 4932947,
    storeResult: 35144
  },
  {
    blockLevel: 1950572,
    dataReady: 463596,
    loadData: 1750389,
    applyBlock: 3503150,
    storeResult: 7712
  },
  {
    blockLevel: 1950573,
    dataReady: 397736,
    loadData: 2199109,
    applyBlock: 722733,
    storeResult: 28525
  },
  {
    blockLevel: 1950574,
    dataReady: 240862,
    loadData: 3275035,
    applyBlock: 5274788,
    storeResult: 36590
  },
  {
    blockLevel: 1950575,
    dataReady: 375337,
    loadData: 816308,
    applyBlock: 2966722,
    storeResult: 18703
  },
  {
    blockLevel: 1950576,
    dataReady: 327300,
    loadData: 1898980,
    applyBlock: 5558709,
    storeResult: 48170
  },
  {
    blockLevel: 1950577,
    dataReady: 499078,
    loadData: 3084259,
    applyBlock: 1038444,
    storeResult: 17402
  },
  {
    blockLevel: 1950578,
    dataReady: 94858,
    loadData: 201568,
    applyBlock: 1717454,
    storeResult: 23086
  },
  {
    blockLevel: 1950579,
    dataReady: 197949,
    loadData: 1668697,
    applyBlock: 5731982,
    storeResult: 21709
  },
  {
    blockLevel: 1950580,
    dataReady: 296725,
    loadData: 1656333,
    applyBlock: 6290103,
    storeResult: 15722
  },
  {
    blockLevel: 1950581,
    dataReady: 342537,
    loadData: 2911977,
    applyBlock: 1774835,
    storeResult: 30143
  },
  {
    blockLevel: 1950582,
    dataReady: 227008,
    loadData: 2125673,
    applyBlock: 426659,
    storeResult: 18882
  },
  {
    blockLevel: 1950583,
    dataReady: 330628,
    loadData: 3376342,
    applyBlock: 6128711,
    storeResult: 11472
  },
  {
    blockLevel: 1950584,
    dataReady: 318508,
    loadData: 1503899,
    applyBlock: 243041,
    storeResult: 7007
  },
  {
    blockLevel: 1950585,
    dataReady: 71739,
    loadData: 2965291,
    applyBlock: 4595544,
    storeResult: 30226
  },
  {
    blockLevel: 1950586,
    dataReady: 410751,
    loadData: 688051,
    applyBlock: 3464382,
    storeResult: 21634
  },
  {
    blockLevel: 1950587,
    dataReady: 486297,
    loadData: 1208075,
    applyBlock: 1515182,
    storeResult: 8318
  },
  {
    blockLevel: 1950588,
    dataReady: 31058,
    loadData: 3270404,
    applyBlock: 479758,
    storeResult: 28995
  },
  {
    blockLevel: 1950589,
    dataReady: 177950,
    loadData: 1316653,
    applyBlock: 5708589,
    storeResult: 45994
  },
  {
    blockLevel: 1950590,
    dataReady: 198722,
    loadData: 1873656,
    applyBlock: 3654583,
    storeResult: 49816
  },
  {
    blockLevel: 1950591,
    dataReady: 451318,
    loadData: 796548,
    applyBlock: 353223,
    storeResult: 38038
  },
  {
    blockLevel: 1950592,
    dataReady: 118048,
    loadData: 2989951,
    applyBlock: 1756028,
    storeResult: 2690
  },
  {
    blockLevel: 1950593,
    dataReady: 19139,
    loadData: 3455470,
    applyBlock: 2260031,
    storeResult: 44664
  },
  {
    blockLevel: 1950594,
    dataReady: 345887,
    loadData: 2908657,
    applyBlock: 4887446,
    storeResult: 45986
  },
  {
    blockLevel: 1950595,
    dataReady: 394334,
    loadData: 2598239,
    applyBlock: 3484500,
    storeResult: 19278
  },
  {
    blockLevel: 1950596,
    dataReady: 381423,
    loadData: 473136,
    applyBlock: 1954704,
    storeResult: 13105
  },
  {
    blockLevel: 1950597,
    dataReady: 404707,
    loadData: 1742554,
    applyBlock: 6826673,
    storeResult: 22984
  },
  {
    blockLevel: 1950598,
    dataReady: 307486,
    loadData: 2400220,
    applyBlock: 1427938,
    storeResult: 47628
  },
  {
    blockLevel: 1950599,
    dataReady: 84925,
    loadData: 3104377,
    applyBlock: 5400008,
    storeResult: 32602
  },
  {
    blockLevel: 1950600,
    dataReady: 277941,
    loadData: 515689,
    applyBlock: 582933,
    storeResult: 29346
  },
  {
    blockLevel: 1950601,
    dataReady: 154808,
    loadData: 784642,
    applyBlock: 6962822,
    storeResult: 45062
  },
  {
    blockLevel: 1950602,
    dataReady: 31812,
    loadData: 643528,
    applyBlock: 6552804,
    storeResult: 5861
  },
  {
    blockLevel: 1950603,
    dataReady: 31163,
    loadData: 1733493,
    applyBlock: 1625272,
    storeResult: 10284
  },
  {
    blockLevel: 1950604,
    dataReady: 350419,
    loadData: 2638993,
    applyBlock: 2546847,
    storeResult: 6153
  },
  {
    blockLevel: 1950605,
    dataReady: 43500,
    loadData: 2679476,
    applyBlock: 1463612,
    storeResult: 44351
  },
  {
    blockLevel: 1950606,
    dataReady: 235259,
    loadData: 2777749,
    applyBlock: 5641221,
    storeResult: 18293
  },
  {
    blockLevel: 1950607,
    dataReady: 10065,
    loadData: 2391375,
    applyBlock: 446807,
    storeResult: 39062
  },
  {
    blockLevel: 1950608,
    dataReady: 53447,
    loadData: 2674341,
    applyBlock: 1880941,
    storeResult: 32531
  },
  {
    blockLevel: 1950609,
    dataReady: 117113,
    loadData: 1582370,
    applyBlock: 1480103,
    storeResult: 17490
  },
  {
    blockLevel: 1950610,
    dataReady: 468356,
    loadData: 3327053,
    applyBlock: 4247637,
    storeResult: 16830
  },
  {
    blockLevel: 1950611,
    dataReady: 128512,
    loadData: 3356187,
    applyBlock: 1255544,
    storeResult: 18016
  },
  {
    blockLevel: 1950612,
    dataReady: 54796,
    loadData: 2489715,
    applyBlock: 2971473,
    storeResult: 39320
  },
  {
    blockLevel: 1950613,
    dataReady: 23264,
    loadData: 3408094,
    applyBlock: 2673173,
    storeResult: 28771
  },
  {
    blockLevel: 1950614,
    dataReady: 92379,
    loadData: 150959,
    applyBlock: 5004519,
    storeResult: 48696
  },
  {
    blockLevel: 1950615,
    dataReady: 472224,
    loadData: 3307139,
    applyBlock: 3101067,
    storeResult: 42548
  },
  {
    blockLevel: 1950616,
    dataReady: 420567,
    loadData: 1502500,
    applyBlock: 6199176,
    storeResult: 32661
  },
  {
    blockLevel: 1950617,
    dataReady: 190792,
    loadData: 2687855,
    applyBlock: 4169529,
    storeResult: 37172
  },
  {
    blockLevel: 1950618,
    dataReady: 21465,
    loadData: 1239691,
    applyBlock: 5788053,
    storeResult: 47287
  },
  {
    blockLevel: 1950619,
    dataReady: 439734,
    loadData: 765336,
    applyBlock: 4131461,
    storeResult: 26193
  },
  {
    blockLevel: 1950620,
    dataReady: 404691,
    loadData: 3340169,
    applyBlock: 2182941,
    storeResult: 15592
  },
  {
    blockLevel: 1950621,
    dataReady: 287731,
    loadData: 1544185,
    applyBlock: 5057127,
    storeResult: 8576
  },
  {
    blockLevel: 1950622,
    dataReady: 269502,
    loadData: 2247973,
    applyBlock: 6548624,
    storeResult: 42445
  },
  {
    blockLevel: 1950623,
    dataReady: 18054,
    loadData: 2734112,
    applyBlock: 3872895,
    storeResult: 32282
  },
  {
    blockLevel: 1950624,
    dataReady: 201806,
    loadData: 2998016,
    applyBlock: 6140422,
    storeResult: 28553
  },
  {
    blockLevel: 1950625,
    dataReady: 368295,
    loadData: 860578,
    applyBlock: 3218231,
    storeResult: 15682
  },
  {
    blockLevel: 1950626,
    dataReady: 372087,
    loadData: 2133604,
    applyBlock: 5089513,
    storeResult: 6155
  },
  {
    blockLevel: 1950627,
    dataReady: 490696,
    loadData: 1351959,
    applyBlock: 5020692,
    storeResult: 12526
  },
  {
    blockLevel: 1950628,
    dataReady: 421466,
    loadData: 3451041,
    applyBlock: 5370560,
    storeResult: 3099
  },
  {
    blockLevel: 1950629,
    dataReady: 226959,
    loadData: 1749061,
    applyBlock: 5314557,
    storeResult: 14189
  },
  {
    blockLevel: 1950630,
    dataReady: 266309,
    loadData: 1007463,
    applyBlock: 4220746,
    storeResult: 31312
  },
  {
    blockLevel: 1950631,
    dataReady: 252374,
    loadData: 2241555,
    applyBlock: 4121291,
    storeResult: 3897
  },
  {
    blockLevel: 1950632,
    dataReady: 342134,
    loadData: 3086142,
    applyBlock: 1748362,
    storeResult: 35368
  },
  {
    blockLevel: 1950633,
    dataReady: 113267,
    loadData: 2794065,
    applyBlock: 4213618,
    storeResult: 28433
  },
  {
    blockLevel: 1950634,
    dataReady: 292287,
    loadData: 1790018,
    applyBlock: 5480976,
    storeResult: 6479
  },
  {
    blockLevel: 1950635,
    dataReady: 105788,
    loadData: 416423,
    applyBlock: 2776072,
    storeResult: 7709
  },
  {
    blockLevel: 1950636,
    dataReady: 318862,
    loadData: 1109999,
    applyBlock: 2944857,
    storeResult: 22949
  },
  {
    blockLevel: 1950637,
    dataReady: 59563,
    loadData: 3362915,
    applyBlock: 3119231,
    storeResult: 38864
  },
  {
    blockLevel: 1950638,
    dataReady: 201702,
    loadData: 2740564,
    applyBlock: 6913277,
    storeResult: 12113
  },
  {
    blockLevel: 1950639,
    dataReady: 317420,
    loadData: 115644,
    applyBlock: 1410256,
    storeResult: 13040
  },
  {
    blockLevel: 1950640,
    dataReady: 268929,
    loadData: 747430,
    applyBlock: 2215113,
    storeResult: 32204
  },
  {
    blockLevel: 1950641,
    dataReady: 298726,
    loadData: 1116179,
    applyBlock: 6478677,
    storeResult: 2976
  },
  {
    blockLevel: 1950642,
    dataReady: 289895,
    loadData: 1371491,
    applyBlock: 6346543,
    storeResult: 9065
  },
  {
    blockLevel: 1950643,
    dataReady: 30091,
    loadData: 1388699,
    applyBlock: 1713204,
    storeResult: 4054
  },
  {
    blockLevel: 1950644,
    dataReady: 491069,
    loadData: 3327166,
    applyBlock: 2897845,
    storeResult: 8283
  },
  {
    blockLevel: 1950645,
    dataReady: 269477,
    loadData: 165989,
    applyBlock: 1790175,
    storeResult: 47626
  },
  {
    blockLevel: 1950646,
    dataReady: 137444,
    loadData: 1525888,
    applyBlock: 3229133,
    storeResult: 31850
  },
  {
    blockLevel: 1950647,
    dataReady: 59599,
    loadData: 500712,
    applyBlock: 5440750,
    storeResult: 22562
  },
  {
    blockLevel: 1950648,
    dataReady: 453259,
    loadData: 2755942,
    applyBlock: 3047247,
    storeResult: 26235
  },
  {
    blockLevel: 1950649,
    dataReady: 95688,
    loadData: 2564026,
    applyBlock: 6665704,
    storeResult: 26176
  },
  {
    blockLevel: 1950650,
    dataReady: 489673,
    loadData: 1297578,
    applyBlock: 2294198,
    storeResult: 18865
  },
  {
    blockLevel: 1950651,
    dataReady: 270879,
    loadData: 1841099,
    applyBlock: 4196828,
    storeResult: 39105
  },
  {
    blockLevel: 1950652,
    dataReady: 388686,
    loadData: 1168766,
    applyBlock: 2795991,
    storeResult: 19231
  },
  {
    blockLevel: 1950653,
    dataReady: 215093,
    loadData: 1624315,
    applyBlock: 1063476,
    storeResult: 4945
  },
  {
    blockLevel: 1950654,
    dataReady: 316372,
    loadData: 2143364,
    applyBlock: 5869204,
    storeResult: 29218
  },
  {
    blockLevel: 1950655,
    dataReady: 477329,
    loadData: 2516616,
    applyBlock: 214950,
    storeResult: 29692
  },
  {
    blockLevel: 1950656,
    dataReady: 448917,
    loadData: 1940665,
    applyBlock: 2051202,
    storeResult: 29807
  },
  {
    blockLevel: 1950657,
    dataReady: 352085,
    loadData: 3441599,
    applyBlock: 1834904,
    storeResult: 38411
  },
  {
    blockLevel: 1950658,
    dataReady: 193096,
    loadData: 686862,
    applyBlock: 5028717,
    storeResult: 27886
  },
  {
    blockLevel: 1950659,
    dataReady: 61680,
    loadData: 2380375,
    applyBlock: 1909572,
    storeResult: 39573
  },
  {
    blockLevel: 1950660,
    dataReady: 113652,
    loadData: 3010587,
    applyBlock: 4672850,
    storeResult: 21918
  },
  {
    blockLevel: 1950661,
    dataReady: 47916,
    loadData: 970143,
    applyBlock: 895370,
    storeResult: 48187
  },
  {
    blockLevel: 1950662,
    dataReady: 487180,
    loadData: 525068,
    applyBlock: 1970156,
    storeResult: 43994
  },
  {
    blockLevel: 1950663,
    dataReady: 54047,
    loadData: 1850244,
    applyBlock: 4141866,
    storeResult: 31435
  },
  {
    blockLevel: 1950664,
    dataReady: 305434,
    loadData: 3156935,
    applyBlock: 1082624,
    storeResult: 22137
  },
  {
    blockLevel: 1950665,
    dataReady: 74856,
    loadData: 2647029,
    applyBlock: 3752326,
    storeResult: 44914
  },
  {
    blockLevel: 1950666,
    dataReady: 68833,
    loadData: 2390799,
    applyBlock: 6173448,
    storeResult: 38261
  },
  {
    blockLevel: 1950667,
    dataReady: 457778,
    loadData: 201527,
    applyBlock: 4896670,
    storeResult: 19668
  },
  {
    blockLevel: 1950668,
    dataReady: 313797,
    loadData: 1393051,
    applyBlock: 4898085,
    storeResult: 44104
  },
  {
    blockLevel: 1950669,
    dataReady: 243076,
    loadData: 1970541,
    applyBlock: 706453,
    storeResult: 1009
  },
  {
    blockLevel: 1950670,
    dataReady: 400974,
    loadData: 2591834,
    applyBlock: 205803,
    storeResult: 7196
  },
  {
    blockLevel: 1950671,
    dataReady: 457705,
    loadData: 2291283,
    applyBlock: 5163521,
    storeResult: 33983
  },
  {
    blockLevel: 1950672,
    dataReady: 455570,
    loadData: 2690833,
    applyBlock: 4099980,
    storeResult: 45943
  },
  {
    blockLevel: 1950673,
    dataReady: 388769,
    loadData: 1476503,
    applyBlock: 6334034,
    storeResult: 35157
  },
  {
    blockLevel: 1950674,
    dataReady: 26959,
    loadData: 2302839,
    applyBlock: 3585508,
    storeResult: 33497
  },
  {
    blockLevel: 1950675,
    dataReady: 120527,
    loadData: 1433904,
    applyBlock: 997522,
    storeResult: 17920
  },
  {
    blockLevel: 1950676,
    dataReady: 87215,
    loadData: 2356073,
    applyBlock: 824199,
    storeResult: 43997
  },
  {
    blockLevel: 1950677,
    dataReady: 497741,
    loadData: 2866299,
    applyBlock: 1812779,
    storeResult: 5555
  },
  {
    blockLevel: 1950678,
    dataReady: 265689,
    loadData: 156550,
    applyBlock: 1406751,
    storeResult: 9016
  },
  {
    blockLevel: 1950679,
    dataReady: 442730,
    loadData: 3092179,
    applyBlock: 2394179,
    storeResult: 34931
  },
  {
    blockLevel: 1950680,
    dataReady: 316171,
    loadData: 1322564,
    applyBlock: 1337022,
    storeResult: 1062
  },
  {
    blockLevel: 1950681,
    dataReady: 488186,
    loadData: 1557998,
    applyBlock: 5603705,
    storeResult: 18924
  },
  {
    blockLevel: 1950682,
    dataReady: 134214,
    loadData: 2417715,
    applyBlock: 3200041,
    storeResult: 14254
  },
  {
    blockLevel: 1950683,
    dataReady: 224382,
    loadData: 3172457,
    applyBlock: 5963665,
    storeResult: 21711
  },
  {
    blockLevel: 1950684,
    dataReady: 127904,
    loadData: 580501,
    applyBlock: 2308656,
    storeResult: 2865
  },
  {
    blockLevel: 1950685,
    dataReady: 405200,
    loadData: 705928,
    applyBlock: 487199,
    storeResult: 9719
  },
  {
    blockLevel: 1950686,
    dataReady: 492544,
    loadData: 2425984,
    applyBlock: 6499589,
    storeResult: 34025
  },
  {
    blockLevel: 1950687,
    dataReady: 417821,
    loadData: 3017107,
    applyBlock: 6618904,
    storeResult: 11497
  },
  {
    blockLevel: 1950688,
    dataReady: 361565,
    loadData: 2626985,
    applyBlock: 6722737,
    storeResult: 18267
  },
  {
    blockLevel: 1950689,
    dataReady: 443960,
    loadData: 912191,
    applyBlock: 6833494,
    storeResult: 5747
  },
  {
    blockLevel: 1950690,
    dataReady: 222241,
    loadData: 1053947,
    applyBlock: 2171007,
    storeResult: 16807
  },
  {
    blockLevel: 1950691,
    dataReady: 456769,
    loadData: 2421371,
    applyBlock: 420592,
    storeResult: 1221
  },
  {
    blockLevel: 1950692,
    dataReady: 455457,
    loadData: 812553,
    applyBlock: 5732433,
    storeResult: 8590
  },
  {
    blockLevel: 1950693,
    dataReady: 471394,
    loadData: 508982,
    applyBlock: 4183757,
    storeResult: 30090
  },
  {
    blockLevel: 1950694,
    dataReady: 272075,
    loadData: 2732557,
    applyBlock: 6442856,
    storeResult: 31713
  },
  {
    blockLevel: 1950695,
    dataReady: 50042,
    loadData: 2603278,
    applyBlock: 3398686,
    storeResult: 21722
  },
  {
    blockLevel: 1950696,
    dataReady: 211774,
    loadData: 2216210,
    applyBlock: 2940809,
    storeResult: 16253
  },
  {
    blockLevel: 1950697,
    dataReady: 413810,
    loadData: 3349343,
    applyBlock: 3176347,
    storeResult: 16007
  },
  {
    blockLevel: 1950698,
    dataReady: 329663,
    loadData: 1426864,
    applyBlock: 2977154,
    storeResult: 1608
  },
  {
    blockLevel: 1950699,
    dataReady: 252894,
    loadData: 246896,
    applyBlock: 5583802,
    storeResult: 42615
  },
  {
    blockLevel: 1950700,
    dataReady: 354031,
    loadData: 914321,
    applyBlock: 6890662,
    storeResult: 35847
  },
  {
    blockLevel: 1950701,
    dataReady: 77778,
    loadData: 522657,
    applyBlock: 364753,
    storeResult: 31809
  },
  {
    blockLevel: 1950702,
    dataReady: 252573,
    loadData: 2371514,
    applyBlock: 6063570,
    storeResult: 21227
  },
  {
    blockLevel: 1950703,
    dataReady: 307528,
    loadData: 3489234,
    applyBlock: 556429,
    storeResult: 23604
  },
  {
    blockLevel: 1950704,
    dataReady: 35140,
    loadData: 1220031,
    applyBlock: 3634498,
    storeResult: 17711
  },
  {
    blockLevel: 1950705,
    dataReady: 358523,
    loadData: 2115439,
    applyBlock: 4174858,
    storeResult: 24468
  },
  {
    blockLevel: 1950706,
    dataReady: 390008,
    loadData: 1333783,
    applyBlock: 5011921,
    storeResult: 24806
  },
  {
    blockLevel: 1950707,
    dataReady: 163532,
    loadData: 3182541,
    applyBlock: 1968314,
    storeResult: 19095
  },
  {
    blockLevel: 1950708,
    dataReady: 390618,
    loadData: 838621,
    applyBlock: 245064,
    storeResult: 23304
  },
  {
    blockLevel: 1950709,
    dataReady: 90398,
    loadData: 1714684,
    applyBlock: 2553671,
    storeResult: 32168
  },
  {
    blockLevel: 1950710,
    dataReady: 404721,
    loadData: 1077933,
    applyBlock: 1144670,
    storeResult: 33297
  },
  {
    blockLevel: 1950711,
    dataReady: 377014,
    loadData: 684239,
    applyBlock: 3475620,
    storeResult: 29120
  },
  {
    blockLevel: 1950712,
    dataReady: 115621,
    loadData: 1282982,
    applyBlock: 3552983,
    storeResult: 25355
  },
  {
    blockLevel: 1950713,
    dataReady: 221059,
    loadData: 2879986,
    applyBlock: 1314339,
    storeResult: 31614
  },
  {
    blockLevel: 1950714,
    dataReady: 473733,
    loadData: 2304428,
    applyBlock: 5019481,
    storeResult: 30570
  },
  {
    blockLevel: 1950715,
    dataReady: 213310,
    loadData: 175858,
    applyBlock: 1968431,
    storeResult: 28420
  },
  {
    blockLevel: 1950716,
    dataReady: 111336,
    loadData: 1204715,
    applyBlock: 5686210,
    storeResult: 41589
  },
  {
    blockLevel: 1950717,
    dataReady: 210832,
    loadData: 2467962,
    applyBlock: 3094109,
    storeResult: 21155
  },
  {
    blockLevel: 1950718,
    dataReady: 151155,
    loadData: 1155121,
    applyBlock: 603346,
    storeResult: 2088
  },
  {
    blockLevel: 1950719,
    dataReady: 171802,
    loadData: 2723261,
    applyBlock: 6381717,
    storeResult: 8351
  },
  {
    blockLevel: 1950720,
    dataReady: 434003,
    loadData: 1809105,
    applyBlock: 4142032,
    storeResult: 37880
  },
  {
    blockLevel: 1950721,
    dataReady: 276719,
    loadData: 1009254,
    applyBlock: 1502384,
    storeResult: 30036
  },
  {
    blockLevel: 1950722,
    dataReady: 137260,
    loadData: 462892,
    applyBlock: 5801209,
    storeResult: 12453
  },
  {
    blockLevel: 1950723,
    dataReady: 341808,
    loadData: 2078058,
    applyBlock: 3049153,
    storeResult: 36384
  },
  {
    blockLevel: 1950724,
    dataReady: 358496,
    loadData: 2811237,
    applyBlock: 1478878,
    storeResult: 29605
  },
  {
    blockLevel: 1950725,
    dataReady: 346669,
    loadData: 3175917,
    applyBlock: 5351094,
    storeResult: 1990
  },
  {
    blockLevel: 1950726,
    dataReady: 55275,
    loadData: 2522577,
    applyBlock: 2989118,
    storeResult: 43882
  },
  {
    blockLevel: 1950727,
    dataReady: 149462,
    loadData: 633149,
    applyBlock: 2981632,
    storeResult: 10891
  },
  {
    blockLevel: 1950728,
    dataReady: 145178,
    loadData: 2722280,
    applyBlock: 1591791,
    storeResult: 36913
  },
  {
    blockLevel: 1950729,
    dataReady: 128439,
    loadData: 2620495,
    applyBlock: 4096088,
    storeResult: 28005
  },
  {
    blockLevel: 1950730,
    dataReady: 60796,
    loadData: 1122543,
    applyBlock: 3809124,
    storeResult: 43985
  },
  {
    blockLevel: 1950731,
    dataReady: 158069,
    loadData: 116145,
    applyBlock: 3633294,
    storeResult: 11338
  },
  {
    blockLevel: 1950732,
    dataReady: 72911,
    loadData: 1811848,
    applyBlock: 3075950,
    storeResult: 30036
  },
  {
    blockLevel: 1950733,
    dataReady: 191026,
    loadData: 120379,
    applyBlock: 4479748,
    storeResult: 23671
  },
  {
    blockLevel: 1950734,
    dataReady: 273926,
    loadData: 2162271,
    applyBlock: 942535,
    storeResult: 851
  },
  {
    blockLevel: 1950735,
    dataReady: 292395,
    loadData: 2222214,
    applyBlock: 4508742,
    storeResult: 20300
  },
  {
    blockLevel: 1950736,
    dataReady: 183673,
    loadData: 902611,
    applyBlock: 5235474,
    storeResult: 11531
  },
  {
    blockLevel: 1950737,
    dataReady: 488751,
    loadData: 2864963,
    applyBlock: 3977779,
    storeResult: 37370
  },
  {
    blockLevel: 1950738,
    dataReady: 379548,
    loadData: 1444842,
    applyBlock: 1955876,
    storeResult: 20256
  },
  {
    blockLevel: 1950739,
    dataReady: 22148,
    loadData: 1800828,
    applyBlock: 2446603,
    storeResult: 23434
  },
  {
    blockLevel: 1950740,
    dataReady: 384825,
    loadData: 154158,
    applyBlock: 784613,
    storeResult: 2366
  },
  {
    blockLevel: 1950741,
    dataReady: 449126,
    loadData: 2250228,
    applyBlock: 6964929,
    storeResult: 32448
  },
  {
    blockLevel: 1950742,
    dataReady: 381913,
    loadData: 2764872,
    applyBlock: 1391759,
    storeResult: 21706
  },
  {
    blockLevel: 1950743,
    dataReady: 119204,
    loadData: 2424929,
    applyBlock: 3344367,
    storeResult: 18939
  },
  {
    blockLevel: 1950744,
    dataReady: 439756,
    loadData: 1090901,
    applyBlock: 4997985,
    storeResult: 1213
  },
  {
    blockLevel: 1950745,
    dataReady: 403561,
    loadData: 144596,
    applyBlock: 670356,
    storeResult: 13535
  },
  {
    blockLevel: 1950746,
    dataReady: 408062,
    loadData: 2995632,
    applyBlock: 921625,
    storeResult: 35892
  },
  {
    blockLevel: 1950747,
    dataReady: 69131,
    loadData: 2753459,
    applyBlock: 5940497,
    storeResult: 17719
  },
  {
    blockLevel: 1950748,
    dataReady: 473013,
    loadData: 2110823,
    applyBlock: 499205,
    storeResult: 41149
  },
  {
    blockLevel: 1950749,
    dataReady: 80689,
    loadData: 2758313,
    applyBlock: 3644688,
    storeResult: 31578
  },
  {
    blockLevel: 1950750,
    dataReady: 248482,
    loadData: 3085788,
    applyBlock: 1617286,
    storeResult: 7522
  },
  {
    blockLevel: 1950751,
    dataReady: 324812,
    loadData: 1367057,
    applyBlock: 4595429,
    storeResult: 28027
  },
  {
    blockLevel: 1950752,
    dataReady: 69216,
    loadData: 3366534,
    applyBlock: 2733281,
    storeResult: 18736
  },
  {
    blockLevel: 1950753,
    dataReady: 417685,
    loadData: 1227897,
    applyBlock: 4530442,
    storeResult: 6034
  },
  {
    blockLevel: 1950754,
    dataReady: 134279,
    loadData: 3008357,
    applyBlock: 1001784,
    storeResult: 5860
  },
  {
    blockLevel: 1950755,
    dataReady: 488943,
    loadData: 193314,
    applyBlock: 1239025,
    storeResult: 29434
  },
  {
    blockLevel: 1950756,
    dataReady: 262695,
    loadData: 249727,
    applyBlock: 5657981,
    storeResult: 32303
  },
  {
    blockLevel: 1950757,
    dataReady: 87432,
    loadData: 1925102,
    applyBlock: 1855255,
    storeResult: 36967
  },
  {
    blockLevel: 1950758,
    dataReady: 301296,
    loadData: 2883143,
    applyBlock: 1106987,
    storeResult: 4443
  },
  {
    blockLevel: 1950759,
    dataReady: 213882,
    loadData: 2189712,
    applyBlock: 5993001,
    storeResult: 38139
  },
  {
    blockLevel: 1950760,
    dataReady: 133798,
    loadData: 952327,
    applyBlock: 4510859,
    storeResult: 16805
  },
  {
    blockLevel: 1950761,
    dataReady: 300355,
    loadData: 823065,
    applyBlock: 1986507,
    storeResult: 31310
  },
  {
    blockLevel: 1950762,
    dataReady: 472606,
    loadData: 333106,
    applyBlock: 2166946,
    storeResult: 7216
  },
  {
    blockLevel: 1950763,
    dataReady: 231836,
    loadData: 1213875,
    applyBlock: 1691482,
    storeResult: 771
  },
  {
    blockLevel: 1950764,
    dataReady: 437476,
    loadData: 3305920,
    applyBlock: 1888361,
    storeResult: 49383
  },
  {
    blockLevel: 1950765,
    dataReady: 428580,
    loadData: 2225463,
    applyBlock: 4533771,
    storeResult: 41703
  },
  {
    blockLevel: 1950766,
    dataReady: 377914,
    loadData: 2164797,
    applyBlock: 6165622,
    storeResult: 41630
  },
  {
    blockLevel: 1950767,
    dataReady: 219355,
    loadData: 2806071,
    applyBlock: 6669034,
    storeResult: 48511
  },
  {
    blockLevel: 1950768,
    dataReady: 371418,
    loadData: 2314805,
    applyBlock: 5933736,
    storeResult: 44858
  },
  {
    blockLevel: 1950769,
    dataReady: 422513,
    loadData: 2482991,
    applyBlock: 1744027,
    storeResult: 7941
  },
  {
    blockLevel: 1950770,
    dataReady: 452747,
    loadData: 2435915,
    applyBlock: 2494780,
    storeResult: 18660
  },
  {
    blockLevel: 1950771,
    dataReady: 309787,
    loadData: 2611170,
    applyBlock: 271237,
    storeResult: 32580
  },
  {
    blockLevel: 1950772,
    dataReady: 190558,
    loadData: 280175,
    applyBlock: 2549026,
    storeResult: 45277
  },
  {
    blockLevel: 1950773,
    dataReady: 75123,
    loadData: 2043977,
    applyBlock: 4307746,
    storeResult: 25756
  },
  {
    blockLevel: 1950774,
    dataReady: 117992,
    loadData: 1403915,
    applyBlock: 2289253,
    storeResult: 20534
  },
  {
    blockLevel: 1950775,
    dataReady: 307539,
    loadData: 193461,
    applyBlock: 2405596,
    storeResult: 19978
  },
  {
    blockLevel: 1950776,
    dataReady: 270741,
    loadData: 2935354,
    applyBlock: 2455862,
    storeResult: 24349
  },
  {
    blockLevel: 1950777,
    dataReady: 296229,
    loadData: 2121176,
    applyBlock: 1496282,
    storeResult: 17672
  },
  {
    blockLevel: 1950778,
    dataReady: 112742,
    loadData: 2769679,
    applyBlock: 3047550,
    storeResult: 18278
  },
  {
    blockLevel: 1950779,
    dataReady: 280601,
    loadData: 134976,
    applyBlock: 4523872,
    storeResult: 47609
  },
  {
    blockLevel: 1950780,
    dataReady: 149273,
    loadData: 3422096,
    applyBlock: 4725840,
    storeResult: 9790
  },
  {
    blockLevel: 1950781,
    dataReady: 244692,
    loadData: 1900269,
    applyBlock: 2764737,
    storeResult: 523
  },
  {
    blockLevel: 1950782,
    dataReady: 93034,
    loadData: 2714052,
    applyBlock: 6430175,
    storeResult: 11313
  },
  {
    blockLevel: 1950783,
    dataReady: 17762,
    loadData: 3369537,
    applyBlock: 5302925,
    storeResult: 49299
  },
  {
    blockLevel: 1950784,
    dataReady: 436444,
    loadData: 1097198,
    applyBlock: 3296835,
    storeResult: 9181
  },
  {
    blockLevel: 1950785,
    dataReady: 456801,
    loadData: 2081611,
    applyBlock: 1177713,
    storeResult: 43456
  },
  {
    blockLevel: 1950786,
    dataReady: 251144,
    loadData: 179507,
    applyBlock: 6359652,
    storeResult: 16362
  },
  {
    blockLevel: 1950787,
    dataReady: 305180,
    loadData: 1751547,
    applyBlock: 3808515,
    storeResult: 24954
  },
  {
    blockLevel: 1950788,
    dataReady: 280586,
    loadData: 2773171,
    applyBlock: 5445410,
    storeResult: 46291
  },
  {
    blockLevel: 1950789,
    dataReady: 457193,
    loadData: 1763429,
    applyBlock: 5403447,
    storeResult: 6771
  },
  {
    blockLevel: 1950790,
    dataReady: 182314,
    loadData: 1619451,
    applyBlock: 4544217,
    storeResult: 25092
  },
  {
    blockLevel: 1950791,
    dataReady: 423871,
    loadData: 390117,
    applyBlock: 3880499,
    storeResult: 1645
  },
  {
    blockLevel: 1950792,
    dataReady: 142574,
    loadData: 1211371,
    applyBlock: 6637841,
    storeResult: 32386
  },
  {
    blockLevel: 1950793,
    dataReady: 333406,
    loadData: 2628434,
    applyBlock: 2695218,
    storeResult: 11048
  },
  {
    blockLevel: 1950794,
    dataReady: 15719,
    loadData: 2588241,
    applyBlock: 981562,
    storeResult: 27683
  },
  {
    blockLevel: 1950795,
    dataReady: 433652,
    loadData: 1568880,
    applyBlock: 1810921,
    storeResult: 36969
  },
  {
    blockLevel: 1950796,
    dataReady: 34664,
    loadData: 2101595,
    applyBlock: 1020227,
    storeResult: 48283
  },
  {
    blockLevel: 1950797,
    dataReady: 145537,
    loadData: 209131,
    applyBlock: 1187798,
    storeResult: 24097
  },
  {
    blockLevel: 1950798,
    dataReady: 100930,
    loadData: 742991,
    applyBlock: 2789576,
    storeResult: 25306
  },
  {
    blockLevel: 1950799,
    dataReady: 229134,
    loadData: 2187958,
    applyBlock: 2053176,
    storeResult: 14606
  },
  {
    blockLevel: 1950800,
    dataReady: 482904,
    loadData: 506841,
    applyBlock: 3688442,
    storeResult: 1820
  },
  {
    blockLevel: 1950801,
    dataReady: 166184,
    loadData: 479735,
    applyBlock: 5761074,
    storeResult: 47471
  },
  {
    blockLevel: 1950802,
    dataReady: 180069,
    loadData: 2428865,
    applyBlock: 5076017,
    storeResult: 16354
  },
  {
    blockLevel: 1950803,
    dataReady: 184480,
    loadData: 318895,
    applyBlock: 1990422,
    storeResult: 30153
  },
  {
    blockLevel: 1950804,
    dataReady: 482071,
    loadData: 2057809,
    applyBlock: 1455898,
    storeResult: 31073
  },
  {
    blockLevel: 1950805,
    dataReady: 122696,
    loadData: 2283906,
    applyBlock: 1991001,
    storeResult: 24993
  },
  {
    blockLevel: 1950806,
    dataReady: 297557,
    loadData: 225867,
    applyBlock: 5175595,
    storeResult: 38912
  },
  {
    blockLevel: 1950807,
    dataReady: 197033,
    loadData: 2047212,
    applyBlock: 4284980,
    storeResult: 15044
  },
  {
    blockLevel: 1950808,
    dataReady: 454239,
    loadData: 1308036,
    applyBlock: 6910964,
    storeResult: 28652
  },
  {
    blockLevel: 1950809,
    dataReady: 54576,
    loadData: 240276,
    applyBlock: 1032891,
    storeResult: 49178
  },
  {
    blockLevel: 1950810,
    dataReady: 202429,
    loadData: 2226838,
    applyBlock: 2595783,
    storeResult: 28335
  },
  {
    blockLevel: 1950811,
    dataReady: 327513,
    loadData: 1037340,
    applyBlock: 2299661,
    storeResult: 15235
  },
  {
    blockLevel: 1950812,
    dataReady: 22252,
    loadData: 3188214,
    applyBlock: 4533620,
    storeResult: 45858
  },
  {
    blockLevel: 1950813,
    dataReady: 124047,
    loadData: 2702648,
    applyBlock: 1353417,
    storeResult: 7941
  },
  {
    blockLevel: 1950814,
    dataReady: 468366,
    loadData: 2958140,
    applyBlock: 5948380,
    storeResult: 1424
  },
  {
    blockLevel: 1950815,
    dataReady: 355968,
    loadData: 2437605,
    applyBlock: 2268033,
    storeResult: 28278
  },
  {
    blockLevel: 1950816,
    dataReady: 90671,
    loadData: 2245425,
    applyBlock: 6136165,
    storeResult: 12770
  },
  {
    blockLevel: 1950817,
    dataReady: 434830,
    loadData: 291252,
    applyBlock: 5649166,
    storeResult: 4020
  },
  {
    blockLevel: 1950818,
    dataReady: 418486,
    loadData: 3381789,
    applyBlock: 3753586,
    storeResult: 45794
  },
  {
    blockLevel: 1950819,
    dataReady: 277989,
    loadData: 906608,
    applyBlock: 2779087,
    storeResult: 26852
  },
  {
    blockLevel: 1950820,
    dataReady: 317934,
    loadData: 1843326,
    applyBlock: 2002379,
    storeResult: 11899
  },
  {
    blockLevel: 1950821,
    dataReady: 32514,
    loadData: 3004448,
    applyBlock: 2845675,
    storeResult: 16038
  },
  {
    blockLevel: 1950822,
    dataReady: 188208,
    loadData: 254948,
    applyBlock: 710786,
    storeResult: 1796
  },
  {
    blockLevel: 1950823,
    dataReady: 143598,
    loadData: 1139275,
    applyBlock: 5372103,
    storeResult: 32276
  },
  {
    blockLevel: 1950824,
    dataReady: 272421,
    loadData: 692682,
    applyBlock: 2745919,
    storeResult: 28164
  },
  {
    blockLevel: 1950825,
    dataReady: 138103,
    loadData: 988804,
    applyBlock: 2526541,
    storeResult: 6998
  },
  {
    blockLevel: 1950826,
    dataReady: 109430,
    loadData: 1559882,
    applyBlock: 6098344,
    storeResult: 10508
  },
  {
    blockLevel: 1950827,
    dataReady: 414986,
    loadData: 886088,
    applyBlock: 1323249,
    storeResult: 18270
  },
  {
    blockLevel: 1950828,
    dataReady: 181084,
    loadData: 1036451,
    applyBlock: 3093524,
    storeResult: 33031
  },
  {
    blockLevel: 1950829,
    dataReady: 293476,
    loadData: 2615655,
    applyBlock: 1043605,
    storeResult: 211
  },
  {
    blockLevel: 1950830,
    dataReady: 451671,
    loadData: 240105,
    applyBlock: 4283055,
    storeResult: 2730
  },
  {
    blockLevel: 1950831,
    dataReady: 255444,
    loadData: 1908724,
    applyBlock: 3809351,
    storeResult: 8482
  },
  {
    blockLevel: 1950832,
    dataReady: 364386,
    loadData: 2336698,
    applyBlock: 1238646,
    storeResult: 18162
  },
  {
    blockLevel: 1950833,
    dataReady: 363134,
    loadData: 193783,
    applyBlock: 2909024,
    storeResult: 27542
  },
  {
    blockLevel: 1950834,
    dataReady: 224399,
    loadData: 1557838,
    applyBlock: 2941210,
    storeResult: 7359
  },
  {
    blockLevel: 1950835,
    dataReady: 453199,
    loadData: 3077146,
    applyBlock: 2190985,
    storeResult: 32483
  },
  {
    blockLevel: 1950836,
    dataReady: 64810,
    loadData: 1593210,
    applyBlock: 4369089,
    storeResult: 7914
  },
  {
    blockLevel: 1950837,
    dataReady: 175412,
    loadData: 765605,
    applyBlock: 2984152,
    storeResult: 26476
  },
  {
    blockLevel: 1950838,
    dataReady: 471930,
    loadData: 2473232,
    applyBlock: 1640751,
    storeResult: 35293
  },
  {
    blockLevel: 1950839,
    dataReady: 494633,
    loadData: 2916701,
    applyBlock: 2120293,
    storeResult: 15136
  },
  {
    blockLevel: 1950840,
    dataReady: 127998,
    loadData: 1186247,
    applyBlock: 4421543,
    storeResult: 15330
  },
  {
    blockLevel: 1950841,
    dataReady: 60293,
    loadData: 131176,
    applyBlock: 1647761,
    storeResult: 26783
  },
  {
    blockLevel: 1950842,
    dataReady: 341175,
    loadData: 1717897,
    applyBlock: 2244156,
    storeResult: 14469
  },
  {
    blockLevel: 1950843,
    dataReady: 215235,
    loadData: 3040434,
    applyBlock: 4421796,
    storeResult: 25669
  },
  {
    blockLevel: 1950844,
    dataReady: 66306,
    loadData: 755701,
    applyBlock: 3408788,
    storeResult: 24636
  },
  {
    blockLevel: 1950845,
    dataReady: 460567,
    loadData: 3182822,
    applyBlock: 5308546,
    storeResult: 18841
  },
  {
    blockLevel: 1950846,
    dataReady: 69522,
    loadData: 2434209,
    applyBlock: 6602179,
    storeResult: 5425
  },
  {
    blockLevel: 1950847,
    dataReady: 70523,
    loadData: 3187909,
    applyBlock: 3853882,
    storeResult: 15687
  },
  {
    blockLevel: 1950848,
    dataReady: 144937,
    loadData: 1180732,
    applyBlock: 2824317,
    storeResult: 26344
  },
  {
    blockLevel: 1950849,
    dataReady: 39836,
    loadData: 891336,
    applyBlock: 6490656,
    storeResult: 3706
  },
  {
    blockLevel: 1950850,
    dataReady: 162088,
    loadData: 192302,
    applyBlock: 6633298,
    storeResult: 16311
  },
  {
    blockLevel: 1950851,
    dataReady: 488853,
    loadData: 116634,
    applyBlock: 5640611,
    storeResult: 19237
  },
  {
    blockLevel: 1950852,
    dataReady: 446970,
    loadData: 1105693,
    applyBlock: 5689617,
    storeResult: 20697
  },
  {
    blockLevel: 1950853,
    dataReady: 195468,
    loadData: 2127488,
    applyBlock: 6323326,
    storeResult: 29204
  },
  {
    blockLevel: 1950854,
    dataReady: 410168,
    loadData: 3334886,
    applyBlock: 5417059,
    storeResult: 24811
  },
  {
    blockLevel: 1950855,
    dataReady: 25758,
    loadData: 2920155,
    applyBlock: 238455,
    storeResult: 27895
  },
  {
    blockLevel: 1950856,
    dataReady: 165709,
    loadData: 2981189,
    applyBlock: 1455206,
    storeResult: 29950
  },
  {
    blockLevel: 1950857,
    dataReady: 155995,
    loadData: 2266047,
    applyBlock: 4272272,
    storeResult: 27347
  },
  {
    blockLevel: 1950858,
    dataReady: 488202,
    loadData: 3284518,
    applyBlock: 3675144,
    storeResult: 6287
  },
  {
    blockLevel: 1950859,
    dataReady: 251711,
    loadData: 2273118,
    applyBlock: 3389236,
    storeResult: 36803
  },
  {
    blockLevel: 1950860,
    dataReady: 412548,
    loadData: 2059452,
    applyBlock: 5227456,
    storeResult: 44290
  },
  {
    blockLevel: 1950861,
    dataReady: 350811,
    loadData: 1065628,
    applyBlock: 2848181,
    storeResult: 8759
  },
  {
    blockLevel: 1950862,
    dataReady: 351772,
    loadData: 381396,
    applyBlock: 4433529,
    storeResult: 9934
  },
  {
    blockLevel: 1950863,
    dataReady: 400558,
    loadData: 2032545,
    applyBlock: 661566,
    storeResult: 17366
  },
  {
    blockLevel: 1950864,
    dataReady: 295673,
    loadData: 2147451,
    applyBlock: 1995281,
    storeResult: 11756
  },
  {
    blockLevel: 1950865,
    dataReady: 72216,
    loadData: 2425539,
    applyBlock: 3742313,
    storeResult: 23512
  },
  {
    blockLevel: 1950866,
    dataReady: 35066,
    loadData: 1544017,
    applyBlock: 2983389,
    storeResult: 6600
  },
  {
    blockLevel: 1950867,
    dataReady: 252679,
    loadData: 1754923,
    applyBlock: 6636007,
    storeResult: 16391
  },
  {
    blockLevel: 1950868,
    dataReady: 69765,
    loadData: 970410,
    applyBlock: 6137777,
    storeResult: 25637
  },
  {
    blockLevel: 1950869,
    dataReady: 461158,
    loadData: 1274455,
    applyBlock: 3268825,
    storeResult: 37641
  },
  {
    blockLevel: 1950870,
    dataReady: 133850,
    loadData: 1195544,
    applyBlock: 1595685,
    storeResult: 20036
  },
  {
    blockLevel: 1950871,
    dataReady: 69445,
    loadData: 572345,
    applyBlock: 445152,
    storeResult: 36511
  },
  {
    blockLevel: 1950872,
    dataReady: 460912,
    loadData: 2606691,
    applyBlock: 3149126,
    storeResult: 14440
  },
  {
    blockLevel: 1950873,
    dataReady: 478608,
    loadData: 738049,
    applyBlock: 3120571,
    storeResult: 17302
  },
  {
    blockLevel: 1950874,
    dataReady: 121031,
    loadData: 2141864,
    applyBlock: 3284230,
    storeResult: 7840
  },
  {
    blockLevel: 1950875,
    dataReady: 309770,
    loadData: 2341380,
    applyBlock: 3915319,
    storeResult: 48390
  },
  {
    blockLevel: 1950876,
    dataReady: 259305,
    loadData: 3456067,
    applyBlock: 2144848,
    storeResult: 45815
  },
  {
    blockLevel: 1950877,
    dataReady: 499160,
    loadData: 1785836,
    applyBlock: 4872968,
    storeResult: 4216
  },
  {
    blockLevel: 1950878,
    dataReady: 145539,
    loadData: 3339285,
    applyBlock: 6196449,
    storeResult: 25807
  },
  {
    blockLevel: 1950879,
    dataReady: 277986,
    loadData: 882626,
    applyBlock: 6557396,
    storeResult: 49518
  },
  {
    blockLevel: 1950880,
    dataReady: 99471,
    loadData: 408636,
    applyBlock: 1811210,
    storeResult: 4618
  },
  {
    blockLevel: 1950881,
    dataReady: 384283,
    loadData: 1919772,
    applyBlock: 1608372,
    storeResult: 8800
  },
  {
    blockLevel: 1950882,
    dataReady: 156266,
    loadData: 2512892,
    applyBlock: 300822,
    storeResult: 19152
  },
  {
    blockLevel: 1950883,
    dataReady: 440439,
    loadData: 3142988,
    applyBlock: 1435971,
    storeResult: 9519
  },
  {
    blockLevel: 1950884,
    dataReady: 22456,
    loadData: 2912566,
    applyBlock: 3169635,
    storeResult: 46401
  },
  {
    blockLevel: 1950885,
    dataReady: 466548,
    loadData: 3029138,
    applyBlock: 1145473,
    storeResult: 4714
  },
  {
    blockLevel: 1950886,
    dataReady: 340427,
    loadData: 2850649,
    applyBlock: 1499657,
    storeResult: 37640
  },
  {
    blockLevel: 1950887,
    dataReady: 217158,
    loadData: 1463714,
    applyBlock: 1161255,
    storeResult: 26632
  },
  {
    blockLevel: 1950888,
    dataReady: 325217,
    loadData: 1902100,
    applyBlock: 6420624,
    storeResult: 30519
  },
  {
    blockLevel: 1950889,
    dataReady: 88760,
    loadData: 988333,
    applyBlock: 5137349,
    storeResult: 36947
  },
  {
    blockLevel: 1950890,
    dataReady: 485771,
    loadData: 143954,
    applyBlock: 6724474,
    storeResult: 26309
  },
  {
    blockLevel: 1950891,
    dataReady: 394554,
    loadData: 3416835,
    applyBlock: 1457230,
    storeResult: 28812
  },
  {
    blockLevel: 1950892,
    dataReady: 108168,
    loadData: 945493,
    applyBlock: 1716729,
    storeResult: 12055
  },
  {
    blockLevel: 1950893,
    dataReady: 311092,
    loadData: 3016975,
    applyBlock: 610990,
    storeResult: 43492
  },
  {
    blockLevel: 1950894,
    dataReady: 144146,
    loadData: 1361680,
    applyBlock: 5220117,
    storeResult: 5387
  },
  {
    blockLevel: 1950895,
    dataReady: 262599,
    loadData: 1599510,
    applyBlock: 6207296,
    storeResult: 13117
  },
  {
    blockLevel: 1950896,
    dataReady: 135083,
    loadData: 1134210,
    applyBlock: 4494536,
    storeResult: 6351
  },
  {
    blockLevel: 1950897,
    dataReady: 292159,
    loadData: 1737729,
    applyBlock: 5635464,
    storeResult: 23762
  },
  {
    blockLevel: 1950898,
    dataReady: 362107,
    loadData: 2768725,
    applyBlock: 416376,
    storeResult: 43279
  },
  {
    blockLevel: 1950899,
    dataReady: 346990,
    loadData: 1153219,
    applyBlock: 755349,
    storeResult: 35234
  },
  {
    blockLevel: 1950900,
    dataReady: 246579,
    loadData: 834866,
    applyBlock: 2381928,
    storeResult: 20134
  },
  {
    blockLevel: 1950901,
    dataReady: 412857,
    loadData: 1080381,
    applyBlock: 5034230,
    storeResult: 47129
  },
  {
    blockLevel: 1950902,
    dataReady: 140580,
    loadData: 2696537,
    applyBlock: 466114,
    storeResult: 43614
  },
  {
    blockLevel: 1950903,
    dataReady: 284710,
    loadData: 408170,
    applyBlock: 5542804,
    storeResult: 6568
  },
  {
    blockLevel: 1950904,
    dataReady: 78167,
    loadData: 1313303,
    applyBlock: 1167218,
    storeResult: 34089
  },
  {
    blockLevel: 1950905,
    dataReady: 78707,
    loadData: 2587312,
    applyBlock: 2747223,
    storeResult: 3654
  },
  {
    blockLevel: 1950906,
    dataReady: 319221,
    loadData: 1143581,
    applyBlock: 746303,
    storeResult: 47574
  },
  {
    blockLevel: 1950907,
    dataReady: 138770,
    loadData: 569719,
    applyBlock: 6974069,
    storeResult: 976
  },
  {
    blockLevel: 1950908,
    dataReady: 257755,
    loadData: 111082,
    applyBlock: 2543657,
    storeResult: 14631
  },
  {
    blockLevel: 1950909,
    dataReady: 353687,
    loadData: 2308107,
    applyBlock: 5773780,
    storeResult: 7925
  },
  {
    blockLevel: 1950910,
    dataReady: 211648,
    loadData: 2754233,
    applyBlock: 1381422,
    storeResult: 19937
  },
  {
    blockLevel: 1950911,
    dataReady: 388536,
    loadData: 3241738,
    applyBlock: 1141701,
    storeResult: 16232
  },
  {
    blockLevel: 1950912,
    dataReady: 454743,
    loadData: 3353492,
    applyBlock: 360511,
    storeResult: 23730
  },
  {
    blockLevel: 1950913,
    dataReady: 353596,
    loadData: 1182443,
    applyBlock: 833853,
    storeResult: 31578
  },
  {
    blockLevel: 1950914,
    dataReady: 295211,
    loadData: 442510,
    applyBlock: 6530091,
    storeResult: 38671
  },
  {
    blockLevel: 1950915,
    dataReady: 418354,
    loadData: 609139,
    applyBlock: 3794157,
    storeResult: 16594
  },
  {
    blockLevel: 1950916,
    dataReady: 145471,
    loadData: 584489,
    applyBlock: 3721362,
    storeResult: 41043
  },
  {
    blockLevel: 1950917,
    dataReady: 169226,
    loadData: 2323749,
    applyBlock: 3519623,
    storeResult: 33867
  },
  {
    blockLevel: 1950918,
    dataReady: 54501,
    loadData: 3422946,
    applyBlock: 4563534,
    storeResult: 7706
  },
  {
    blockLevel: 1950919,
    dataReady: 91984,
    loadData: 633509,
    applyBlock: 3838431,
    storeResult: 11200
  },
  {
    blockLevel: 1950920,
    dataReady: 454520,
    loadData: 3451598,
    applyBlock: 5446417,
    storeResult: 25344
  },
  {
    blockLevel: 1950921,
    dataReady: 95370,
    loadData: 438554,
    applyBlock: 4520342,
    storeResult: 44229
  },
  {
    blockLevel: 1950922,
    dataReady: 43135,
    loadData: 1573090,
    applyBlock: 2386567,
    storeResult: 5893
  },
  {
    blockLevel: 1950923,
    dataReady: 362287,
    loadData: 1413876,
    applyBlock: 6003775,
    storeResult: 2868
  },
  {
    blockLevel: 1950924,
    dataReady: 445022,
    loadData: 3346905,
    applyBlock: 5305987,
    storeResult: 28217
  },
  {
    blockLevel: 1950925,
    dataReady: 311877,
    loadData: 2993720,
    applyBlock: 1634562,
    storeResult: 37658
  },
  {
    blockLevel: 1950926,
    dataReady: 435153,
    loadData: 1185138,
    applyBlock: 2442807,
    storeResult: 22997
  },
  {
    blockLevel: 1950927,
    dataReady: 46684,
    loadData: 2554542,
    applyBlock: 395145,
    storeResult: 13606
  },
  {
    blockLevel: 1950928,
    dataReady: 141350,
    loadData: 532883,
    applyBlock: 3090685,
    storeResult: 42679
  },
  {
    blockLevel: 1950929,
    dataReady: 488551,
    loadData: 3253988,
    applyBlock: 3207461,
    storeResult: 45221
  },
  {
    blockLevel: 1950930,
    dataReady: 486792,
    loadData: 2249050,
    applyBlock: 1541778,
    storeResult: 13957
  },
  {
    blockLevel: 1950931,
    dataReady: 433199,
    loadData: 2797512,
    applyBlock: 3618171,
    storeResult: 27960
  },
  {
    blockLevel: 1950932,
    dataReady: 98447,
    loadData: 1842700,
    applyBlock: 5718326,
    storeResult: 31194
  },
  {
    blockLevel: 1950933,
    dataReady: 223682,
    loadData: 1245376,
    applyBlock: 3348500,
    storeResult: 35527
  },
  {
    blockLevel: 1950934,
    dataReady: 143021,
    loadData: 1839208,
    applyBlock: 1660059,
    storeResult: 6782
  },
  {
    blockLevel: 1950935,
    dataReady: 290330,
    loadData: 702631,
    applyBlock: 3099320,
    storeResult: 17229
  },
  {
    blockLevel: 1950936,
    dataReady: 287566,
    loadData: 364847,
    applyBlock: 3001877,
    storeResult: 35923
  },
  {
    blockLevel: 1950937,
    dataReady: 205740,
    loadData: 2065547,
    applyBlock: 208961,
    storeResult: 17366
  },
  {
    blockLevel: 1950938,
    dataReady: 251116,
    loadData: 2664837,
    applyBlock: 6752737,
    storeResult: 5638
  },
  {
    blockLevel: 1950939,
    dataReady: 401934,
    loadData: 3389148,
    applyBlock: 2247864,
    storeResult: 43891
  },
  {
    blockLevel: 1950940,
    dataReady: 326619,
    loadData: 300421,
    applyBlock: 354566,
    storeResult: 11870
  },
  {
    blockLevel: 1950941,
    dataReady: 267771,
    loadData: 2096231,
    applyBlock: 4799543,
    storeResult: 17747
  },
  {
    blockLevel: 1950942,
    dataReady: 23233,
    loadData: 1678537,
    applyBlock: 4332204,
    storeResult: 17707
  },
  {
    blockLevel: 1950943,
    dataReady: 77844,
    loadData: 1019904,
    applyBlock: 3974441,
    storeResult: 2413
  },
  {
    blockLevel: 1950944,
    dataReady: 134044,
    loadData: 2280990,
    applyBlock: 760858,
    storeResult: 4216
  },
  {
    blockLevel: 1950945,
    dataReady: 455663,
    loadData: 3371524,
    applyBlock: 4768827,
    storeResult: 19925
  },
  {
    blockLevel: 1950946,
    dataReady: 267770,
    loadData: 3270306,
    applyBlock: 2451851,
    storeResult: 39531
  },
  {
    blockLevel: 1950947,
    dataReady: 397905,
    loadData: 3094611,
    applyBlock: 3777460,
    storeResult: 5435
  },
  {
    blockLevel: 1950948,
    dataReady: 178399,
    loadData: 1950682,
    applyBlock: 1465915,
    storeResult: 19997
  },
  {
    blockLevel: 1950949,
    dataReady: 429712,
    loadData: 1066615,
    applyBlock: 1824817,
    storeResult: 37974
  },
  {
    blockLevel: 1950950,
    dataReady: 116456,
    loadData: 419531,
    applyBlock: 3467944,
    storeResult: 38705
  },
  {
    blockLevel: 1950951,
    dataReady: 109166,
    loadData: 584333,
    applyBlock: 5496207,
    storeResult: 24774
  },
  {
    blockLevel: 1950952,
    dataReady: 138642,
    loadData: 254292,
    applyBlock: 331870,
    storeResult: 33862
  },
  {
    blockLevel: 1950953,
    dataReady: 470804,
    loadData: 2477891,
    applyBlock: 2437891,
    storeResult: 26280
  },
  {
    blockLevel: 1950954,
    dataReady: 499962,
    loadData: 1209740,
    applyBlock: 2971577,
    storeResult: 2653
  },
  {
    blockLevel: 1950955,
    dataReady: 330455,
    loadData: 2810321,
    applyBlock: 2881023,
    storeResult: 30978
  },
  {
    blockLevel: 1950956,
    dataReady: 34203,
    loadData: 3088837,
    applyBlock: 5313561,
    storeResult: 37877
  },
  {
    blockLevel: 1950957,
    dataReady: 365298,
    loadData: 2277081,
    applyBlock: 5659767,
    storeResult: 47592
  },
  {
    blockLevel: 1950958,
    dataReady: 463309,
    loadData: 1800361,
    applyBlock: 1461658,
    storeResult: 45814
  },
  {
    blockLevel: 1950959,
    dataReady: 22819,
    loadData: 2585463,
    applyBlock: 438238,
    storeResult: 38116
  },
  {
    blockLevel: 1950960,
    dataReady: 436555,
    loadData: 2490933,
    applyBlock: 2393608,
    storeResult: 6582
  },
  {
    blockLevel: 1950961,
    dataReady: 187951,
    loadData: 2775230,
    applyBlock: 6759624,
    storeResult: 22494
  },
  {
    blockLevel: 1950962,
    dataReady: 68067,
    loadData: 2452263,
    applyBlock: 4198874,
    storeResult: 34620
  },
  {
    blockLevel: 1950963,
    dataReady: 175294,
    loadData: 3076795,
    applyBlock: 476903,
    storeResult: 46466
  },
  {
    blockLevel: 1950964,
    dataReady: 355423,
    loadData: 2519640,
    applyBlock: 6846276,
    storeResult: 32205
  },
  {
    blockLevel: 1950965,
    dataReady: 59433,
    loadData: 1857824,
    applyBlock: 4986311,
    storeResult: 25971
  },
  {
    blockLevel: 1950966,
    dataReady: 405241,
    loadData: 2408306,
    applyBlock: 5692616,
    storeResult: 34323
  },
  {
    blockLevel: 1950967,
    dataReady: 67484,
    loadData: 1006856,
    applyBlock: 4046633,
    storeResult: 41603
  },
  {
    blockLevel: 1950968,
    dataReady: 250903,
    loadData: 3414341,
    applyBlock: 6603446,
    storeResult: 18162
  },
  {
    blockLevel: 1950969,
    dataReady: 381462,
    loadData: 1618722,
    applyBlock: 5237747,
    storeResult: 44055
  },
  {
    blockLevel: 1950970,
    dataReady: 157212,
    loadData: 1452039,
    applyBlock: 2106901,
    storeResult: 10262
  },
  {
    blockLevel: 1950971,
    dataReady: 253794,
    loadData: 688424,
    applyBlock: 5657863,
    storeResult: 15710
  },
  {
    blockLevel: 1950972,
    dataReady: 236553,
    loadData: 472151,
    applyBlock: 789934,
    storeResult: 24425
  },
  {
    blockLevel: 1950973,
    dataReady: 107863,
    loadData: 2703546,
    applyBlock: 5147765,
    storeResult: 30963
  },
  {
    blockLevel: 1950974,
    dataReady: 164557,
    loadData: 107567,
    applyBlock: 2185381,
    storeResult: 32919
  },
  {
    blockLevel: 1950975,
    dataReady: 225842,
    loadData: 2005988,
    applyBlock: 6574721,
    storeResult: 36472
  },
  {
    blockLevel: 1950976,
    dataReady: 423219,
    loadData: 1227111,
    applyBlock: 1454239,
    storeResult: 45730
  },
  {
    blockLevel: 1950977,
    dataReady: 230617,
    loadData: 1210910,
    applyBlock: 1791348,
    storeResult: 28768
  },
  {
    blockLevel: 1950978,
    dataReady: 36370,
    loadData: 3325832,
    applyBlock: 707630,
    storeResult: 37761
  },
  {
    blockLevel: 1950979,
    dataReady: 414220,
    loadData: 837673,
    applyBlock: 1403999,
    storeResult: 25726
  },
  {
    blockLevel: 1950980,
    dataReady: 482069,
    loadData: 1613920,
    applyBlock: 3245326,
    storeResult: 38224
  },
  {
    blockLevel: 1950981,
    dataReady: 311523,
    loadData: 1555073,
    applyBlock: 2329960,
    storeResult: 30745
  },
  {
    blockLevel: 1950982,
    dataReady: 264829,
    loadData: 1759565,
    applyBlock: 1517721,
    storeResult: 16804
  },
  {
    blockLevel: 1950983,
    dataReady: 176248,
    loadData: 2182831,
    applyBlock: 4883403,
    storeResult: 35452
  },
  {
    blockLevel: 1950984,
    dataReady: 21414,
    loadData: 1318256,
    applyBlock: 6640871,
    storeResult: 6953
  },
  {
    blockLevel: 1950985,
    dataReady: 253114,
    loadData: 3241083,
    applyBlock: 3553591,
    storeResult: 37751
  },
  {
    blockLevel: 1950986,
    dataReady: 246885,
    loadData: 636983,
    applyBlock: 5125398,
    storeResult: 13391
  },
  {
    blockLevel: 1950987,
    dataReady: 328018,
    loadData: 1738077,
    applyBlock: 4286354,
    storeResult: 10368
  },
  {
    blockLevel: 1950988,
    dataReady: 478060,
    loadData: 2451866,
    applyBlock: 2325181,
    storeResult: 22806
  },
  {
    blockLevel: 1950989,
    dataReady: 111504,
    loadData: 2066389,
    applyBlock: 737548,
    storeResult: 19877
  },
  {
    blockLevel: 1950990,
    dataReady: 470765,
    loadData: 3446997,
    applyBlock: 6248496,
    storeResult: 43734
  },
  {
    blockLevel: 1950991,
    dataReady: 139665,
    loadData: 361499,
    applyBlock: 1820893,
    storeResult: 16922
  },
  {
    blockLevel: 1950992,
    dataReady: 306450,
    loadData: 1192668,
    applyBlock: 2882482,
    storeResult: 21171
  },
  {
    blockLevel: 1950993,
    dataReady: 423671,
    loadData: 608999,
    applyBlock: 5022834,
    storeResult: 27905
  },
  {
    blockLevel: 1950994,
    dataReady: 207699,
    loadData: 507292,
    applyBlock: 2976120,
    storeResult: 1112
  },
  {
    blockLevel: 1950995,
    dataReady: 319225,
    loadData: 2336747,
    applyBlock: 4200993,
    storeResult: 45350
  },
  {
    blockLevel: 1950996,
    dataReady: 324222,
    loadData: 1276165,
    applyBlock: 5731163,
    storeResult: 42194
  },
  {
    blockLevel: 1950997,
    dataReady: 400596,
    loadData: 1958493,
    applyBlock: 266280,
    storeResult: 46451
  },
  {
    blockLevel: 1950998,
    dataReady: 459544,
    loadData: 2575262,
    applyBlock: 4640391,
    storeResult: 1113
  },
  {
    blockLevel: 1950999,
    dataReady: 311640,
    loadData: 1967761,
    applyBlock: 6593321,
    storeResult: 44741
  },
  {
    blockLevel: 1951000,
    dataReady: 22626,
    loadData: 2184871,
    applyBlock: 4843803,
    storeResult: 24682
  }
];
