import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SandboxStatusBarComponent } from './sandbox-status-bar.component';

describe('SandboxStatusBarComponent', () => {
  let component: SandboxStatusBarComponent;
  let fixture: ComponentFixture<SandboxStatusBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SandboxStatusBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandboxStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
