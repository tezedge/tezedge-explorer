import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainWalletsComponent } from './chain-wallets.component';

describe('ChainWalletsComponent', () => {
  let component: ChainWalletsComponent;
  let fixture: ComponentFixture<ChainWalletsComponent>;

  beforeEach(async(() => {
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
