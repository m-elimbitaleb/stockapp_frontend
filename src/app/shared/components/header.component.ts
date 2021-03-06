/*
 * Copyright (c) 2021. stockapp.
 * Proprietary source code; any copy or modification is prohibited.
 *
 * @author Moulaye Abderrahmane <moolsbytheway@gmail.com>
 *
 */

import {Component, Input} from "@angular/core";

@Component({
  selector: "m-header",
  template: `
    <div class="d-flex justify-content-between align-items-center mt-1 mb-1">
      <h4 class="mt-1 title">{{title}}</h4>
      <div *ngIf="buttons" class="action-buttons">
        <button
          style="margin-left: 5px"
          *ngFor="let button of buttons"
          [ngClass]="button.class"
          [title]="button.title ? button.title : button.text"
          (click)="button.fn()"
          class="btn btn-primary">
          <ng-container *ngIf="button.icon">
            <i [class]="button.icon"></i>
          </ng-container>
          <span>{{button.text}}</span>
        </button>
      </div>
    </div>
  `

})
export class HeaderComponent {
  @Input() buttons: HeaderButton[];
  @Input() title: string;
}

export type HeaderButton = {
  text: string,
  fn: Function,
  icon?: string,
  class?: string,
  title?: string
}
