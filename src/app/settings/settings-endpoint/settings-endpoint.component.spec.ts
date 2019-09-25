import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsEndpointComponent } from './settings-endpoint.component';

describe('SettingsEndpointComponent', () => {
  let component: SettingsEndpointComponent;
  let fixture: ComponentFixture<SettingsEndpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsEndpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
