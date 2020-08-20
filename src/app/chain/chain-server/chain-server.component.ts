import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subject, of } from 'rxjs';


@Component({
  selector: 'app-chain-server',
  templateUrl: './chain-server.component.html',
  styleUrls: ['./chain-server.component.css']
})
export class ChainServerComponent implements OnInit {

  public chainServer

  constructor(
    public store: Store<any>,
    public fb: FormBuilder,
  ) { }


  ngOnInit(): void {

    // create form group
    this.chainServer = this.fb.group({
      port: ['', [Validators.required]],
    })

  }

}
