import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MergedRoute } from '@shared/router/merged-route';
import { BAKING_SET_ACTIVE_BAKER, BakingSetActiveBaker } from '@baking/baking.actions';

@UntilDestroy()
@Component({
  selector: 'app-baking-filter',
  templateUrl: './baking-filter.component.html',
  styleUrls: ['./baking-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BakingFilterComponent implements OnInit {

  formGroup: FormGroup;

  private routedHash: string;

  constructor(private router: Router,
              private store: Store<State>,
              private builder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.listenToRouteChange();
  }

  search(): void {
    const value = this.formGroup.get('search').value;
    if (this.routedHash !== value) {
      this.routedHash = value;
      this.dispatchSetActiveBaker();
      const commands = ['baking'];
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

  private dispatchSetActiveBaker(): void {
    this.store.dispatch<BakingSetActiveBaker>({
      type: BAKING_SET_ACTIVE_BAKER,
      payload: { hash: this.routedHash }
    });
  }
}
