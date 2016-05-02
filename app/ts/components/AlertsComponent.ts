import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {AlertComponent} from 'ng2-bootstrap/ng2-bootstrap';
import {Headquarter}       from "../services/Headquarter";


@Component({
  selector: 'alerts-holder',
  template: `

  <div class="alert-container panel panel-primary" *ngIf="alerts && alerts.length > 0">
    <div class="panel-heading alert-container-title">Message</div>
    <div class="panel-body">
    <alert *ngFor="#alert of alerts;#i = index" [type]="alert.type" dismissible="true" (close)="closeAlert(i)">
      {{ alert?.msg }}
    </alert>
    </div>
  </div>`,
  directives: [AlertComponent, CORE_DIRECTIVES]
})
export class AlertsComponent {

  alerts:Array<Object>;

  constructor(public HQ : Headquarter){

    this.alerts = new Array<Object>();
    this.HQ.alert$.subscribe(
      (err) => {
        this.addAlert(err);
      }
    );
  }

  public closeAlert(i:number):void {
    this.alerts.splice(i, 1);
  }

  public addAlert(err):void {
    this.alerts.push({msg: err, type: 'danger', closable: true});
  }
}

