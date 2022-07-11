/*
 * Copyright (c) 2021. stockapp.
 * Proprietary source code; any copy or modification is prohibited.
 *
 * @author Moulaye Abderrahmane <moolsbytheway@gmail.com>
 *
 */

import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'm-modal-confirm',
  template: `
    <div class="modal-header">
      <h3 class="modal-title" id="modal-title">{{title}}</h3>
      <button type="button" class="close" (click)="modal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{text}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary"
              (click)="modal.dismiss()">Cancel
      </button>
      <button type="button" class="btn btn-danger"
              (click)="modal.close(true)">Ok
      </button>
    </div>
  `
})
export class MConfirmModal {
  title: string;
  text: string;

  constructor(public modal: NgbActiveModal) {
  }
}
