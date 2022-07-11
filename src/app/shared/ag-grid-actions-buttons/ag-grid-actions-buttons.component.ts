import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {IAfterGuiAttachedParams, ICellRendererParams} from 'ag-grid-community';

export interface AgGridButton {
  title: string;
  fn: any;
  text?: string;
  icon?: string;
  before?: Function;
  disabled?: any;
  hidden?: any;
  style?: any;
  hasRole?: any[];
}

export interface ButtonParams extends ICellRendererParams {
  title?: string;
  buttons?: AgGridButton[];
  data: any;
}

@Component({
  selector: 'app-ag-grid-actions-buttons',
  templateUrl: './ag-grid-actions-buttons.component.html',
  styleUrls: ['./ag-grid-actions-buttons.component.scss']
})
export class AgGridActionsButtonsComponent implements ICellRendererAngularComp {
  buttons: any[];
  title: string;
  data: any;

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  refresh(params: any): boolean {
    return false;
  }

  agInit(params: ButtonParams): void {
    params.buttons.forEach(button => {
      if(!button.hasRole) {
        button.hasRole= []
      }
    })
    this.data = params.data;
    this.buttons = params.buttons;
    this.title = params.title;

  }

}
