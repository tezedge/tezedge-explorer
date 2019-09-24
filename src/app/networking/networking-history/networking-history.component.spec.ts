import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkingHistoryComponent } from './networking-history.component';

describe('NetworkingHistoryComponent', () => {
  let component: NetworkingHistoryComponent;
  let fixture: ComponentFixture<NetworkingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
