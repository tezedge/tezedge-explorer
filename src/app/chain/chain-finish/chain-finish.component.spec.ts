import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChainFinishComponent } from './chain-finish.component';

describe('ChainFinishComponent', () => {
  let component: ChainFinishComponent;
  let fixture: ComponentFixture<ChainFinishComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChainFinishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
