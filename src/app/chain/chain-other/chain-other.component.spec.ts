import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChainOtherComponent } from './chain-other.component';

describe('ChainOtherComponent', () => {
  let component: ChainOtherComponent;
  let fixture: ComponentFixture<ChainOtherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChainOtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
