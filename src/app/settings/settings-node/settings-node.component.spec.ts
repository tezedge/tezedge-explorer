import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsNodeComponent } from './settings-node.component';

describe('SettingsNodeComponent', () => {
  let component: SettingsNodeComponent;
  let fixture: ComponentFixture<SettingsNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
