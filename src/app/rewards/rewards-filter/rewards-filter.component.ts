import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MergedRoute } from '@shared/router/merged-route';
import { REWARDS_SET_ACTIVE_BAKER, RewardsSetActiveBaker } from '@rewards/rewards.actions';
import { selectRewardsBakers } from '@rewards/rewards.index';
import { RewardsBaker } from '@shared/types/rewards/rewards-baker.type';

@UntilDestroy()
@Component({
  selector: 'app-rewards-filter',
  templateUrl: './rewards-filter.component.html',
  styleUrls: ['./rewards-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RewardsFilterComponent implements OnInit {

  formGroup: FormGroup;

  private bakers: RewardsBaker[];
  private routedHash: string;

  constructor(private router: Router,
              private store: Store<State>,
              private builder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.listenToRouteChange();
    this.listenToBakerList();
  }

  search(): void {
    const value = this.formGroup.get('search').value;
    if (this.routedHash !== value) {
      if (value && !this.bakers.find(b => b.hash === value)) {
        return;
      }
      this.routedHash = value;
      if (value) {
        this.dispatchSetActiveBaker();
      }
      const commands = ['rewards'];
      if (this.routedHash) {
        commands.push(this.routedHash);
      }
      this.router.navigate(commands);
    }
  }

  private initForm(): void {
    this.formGroup = this.builder.group({
      search: new FormControl(),
    });
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(untilDestroyed(this))
      .subscribe((route: MergedRoute) => {
        if (this.routedHash !== route.params.hash) {
          this.routedHash = route.params.hash;
          this.formGroup.get('search').setValue(this.routedHash);
          this.dispatchSetActiveBaker();
        }
      });
  }

  private listenToBakerList(): void {
    this.store.select(selectRewardsBakers)
      .pipe(untilDestroyed(this))
      .subscribe((bakers: RewardsBaker[]) => this.bakers = bakers);
  }

  private dispatchSetActiveBaker(): void {
    this.store.dispatch<RewardsSetActiveBaker>({
      type: REWARDS_SET_ACTIVE_BAKER,
      payload: { hash: this.routedHash }
    });
  }
}
