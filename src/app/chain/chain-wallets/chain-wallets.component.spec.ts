import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChainWalletsComponent } from './chain-wallets.component';

describe('ChainWalletsComponent', () => {
  let component: ChainWalletsComponent;
  let fixture: ComponentFixture<ChainWalletsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChainWalletsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainWalletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
