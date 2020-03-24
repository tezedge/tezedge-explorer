import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkHistoryComponent } from './network-history.component';

describe('NetworkHistoryComponent', () => {
  let component: NetworkHistoryComponent;
  let fixture: ComponentFixture<NetworkHistoryComponent>;

  beforeEach(async(() => {
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
