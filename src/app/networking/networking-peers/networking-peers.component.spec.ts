import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkingPeersComponent } from './networking-peers.component';

describe('NetworkingPeersComponent', () => {
  let component: NetworkingPeersComponent;
  let fixture: ComponentFixture<NetworkingPeersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkingPeersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkingPeersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
