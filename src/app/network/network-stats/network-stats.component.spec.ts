import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkStatsComponent } from './network-stats.component';

describe('NetworkStatsComponent', () => {
  let component: NetworkStatsComponent;
  let fixture: ComponentFixture<NetworkStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
