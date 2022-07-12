/*
 * Copyright (c) 2021. stockapp.
 * Proprietary source code; any copy or modification is prohibited.
 *
 * @author Moulaye Abderrahmane <moolsbytheway@gmail.com>
 *
 */

import {Component, EventEmitter, Input} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: "m-modal",
  styleUrls: ["m-modal.scss"],
  template: `
    <div class="offscreen" [class.active]="active">
      <div class="container">
        <ng-content></ng-content>
      </div>
    </div>
  `

})
export class MModalComponent {
  active: boolean;

  public show() {
    this.active = true;
  }

  public hide() {
    this.active = false;
  }
}

export interface MModalResult {
  onResult: EventEmitter<any>
}
