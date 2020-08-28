import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxStatusBarComponent } from './sandbox-status-bar.component';

describe('SandboxStatusBarComponent', () => {
  let component: SandboxStatusBarComponent;
  let fixture: ComponentFixture<SandboxStatusBarComponent>;

  beforeEach(async(() => {
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
