import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import SwaggerUI from 'swagger-ui';

@Component({
  selector: 'app-swagger',
  templateUrl: './swagger.component.html',
  styleUrls: ['./swagger.component.scss']
})
export class SwaggerComponent implements AfterViewInit, OnDestroy {

  // private swaggerElement: HTMLElement;

  ngAfterViewInit(): void {
    // this.swaggerElement = document.getElementById('tezedge-swagger');
    // this.swaggerElement.style.display = 'block';
    // SwaggerUI({
    //   dom_id: '#tezedge-swagger',
    //   spec: 'assets/swagger.json',
    // });
  }

  ngOnDestroy(): void {
    // this.swaggerElement.style.display = 'none';
  }
}
