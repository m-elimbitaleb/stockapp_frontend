import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Injectable} from "@angular/core";
import {ConfirmDialogComponent} from "./confirm-dialog.component";

@Injectable()
export class ConfirmDialogService {

  constructor(private modalService: NgbModal) {
  }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'Confirmer',
    btnCancelText: string = 'Annuler',
    dialogSize: 'sm' | 'md' | 'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {size: dialogSize});
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}
