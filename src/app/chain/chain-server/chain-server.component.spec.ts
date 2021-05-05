import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChainServerComponent } from './chain-server.component';

describe('ChainServerComponent', () => {
  let component: ChainServerComponent;
  let fixture: ComponentFixture<ChainServerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChainServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
