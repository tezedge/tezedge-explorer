import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkingStatsComponent } from './networking-stats.component';

describe('NetworkingStatsComponent', () => {
  let component: NetworkingStatsComponent;
  let fixture: ComponentFixture<NetworkingStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkingStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkingStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
