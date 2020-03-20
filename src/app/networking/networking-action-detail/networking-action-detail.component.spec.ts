import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkingActionDetailComponent } from './networking-action-detail.component';

describe('NetworkingActionDetailComponent', () => {
  let component: NetworkingActionDetailComponent;
  let fixture: ComponentFixture<NetworkingActionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkingActionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkingActionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
