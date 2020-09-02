import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chain-wallets',
  templateUrl: './chain-wallets.component.html',
  styleUrls: ['./chain-wallets.component.css']
})
export class ChainWalletsComponent implements OnInit {
  @Input() isReadonly?: boolean;
  
  constructor() { }

  ngOnInit(): void {
    
		// disable form if isReadonly is passed
		if(this.isReadonly){
			// this.chainWalletsForm.disable();
		}
  }

}
