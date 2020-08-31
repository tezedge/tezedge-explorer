import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-chain-finish',
  templateUrl: './chain-finish.component.html',
  styleUrls: ['./chain-finish.component.scss']
})
export class ChainFinishComponent implements OnInit {
  chainFinish: FormGroup;
  
  constructor(private store: Store<any>, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.chainFinish = this.fb.group({
      googleAnalytics: ['', [Validators.required]], 
    });
  }

}
