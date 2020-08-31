import { Component, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {

  constructor(private store: Store<any>, private router: Router) { }

  ngOnInit(): void {
    // hide sidenav and toolbar
    this.toggleSidenavVisibility(false);
  }

  nextStep(stepper: MatStepper){
    stepper.next();
  }

  closePage(){
    this.toggleSidenavVisibility(true);
    this.router.navigate(['/chain']);
  }
  
  uploadConfig(){
    // TODO
  }

  toggleSidenavVisibility(isVisible: boolean){
    this.store.dispatch({
      type: 'SIDENAV_VISIBILITY_CHANGE',
      payload: isVisible,
    });
    this.store.dispatch({
      type: 'TOOLBAR_VISIBILITY_CHANGE',
      payload: isVisible,
    });
  }
}
