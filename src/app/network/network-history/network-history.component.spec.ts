import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NetworkHistoryComponent } from './network-history.component';

describe('NetworkHistoryComponent', () => {
  let component: NetworkHistoryComponent;
  let fixture: ComponentFixture<NetworkHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
