import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {UserService} from '../../services/user.service';
import {ColumnApi, GridApi, GridOptions} from 'ag-grid-community';
import {AG_GRID_LOCALE_FR} from '../../shared/ag-grid-i18n/locale.fr';
import {RoleEnum, Token, User} from "../../model/user";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  AgGridActionsButtonsComponent,
  AgGridButton
} from "../../shared/ag-grid-actions-buttons/ag-grid-actions-buttons.component";
import {HeaderButton} from "../../shared/components/header.component";
import {MModalComponent} from "../../shared/components/m-modal/m-modal.component";
import {Toast, ToastrService} from "ngx-toastr";
import {MConfirmModal} from "../../shared/components/m-confirm-modal";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @ViewChild(MModalComponent)
  private modal;

  gridOptions: GridOptions;
  frameworkComponents: any;
  rowData = [];
  token: Token;
  users: any[] = [];
  localeText: any;
  gridApi: GridApi;
  private columnApi: ColumnApi;
  actionButtons = [
    {
      text: "Ajouter un utilisateur",
      icon: "fa fa-user-plus",
      fn: () => {
        this.createUser();
      }
    }
  ] as HeaderButton[];
  editableUser: User = new User();

  constructor(private authenticationService: AuthenticationService,
              private toastr: ToastrService,
              private datepipe: DatePipe, private modalService: NgbModal,
              private userService: UserService) {
    this.token = this.authenticationService.tokenValue;
    this.frameworkComponents = {
      buttonRenderer: AgGridActionsButtonsComponent,
    };
  }

  ngOnInit() {
    this.initAgGrid();
  }

  initAgGrid() {
    this.gridOptions = <GridOptions>{
      pagination: false,
      rowModelType: 'clientSide',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      defaultColDef: {
        resizable: true
      },
      rowData: [],
      columnDefs: [
        {
        headerName: "ID#",
        field: "id"
        },
        {
          headerName: 'Nom et Prénom',
          valueFormatter: params => params.data.firstName + ' ' + params.data.lastName
        },
        {
          headerName: "Username",
          field: "username"
        },
        {
          headerName: "Phone",
          field: "phone"
        },
        {
          headerName: "Email",
          field: "email"
        },
        {
          headerName: "Role",
          field: "role"
        },
        {
          headerName: 'Date de création',
          field: 'createdAt',
          valueFormatter: params => this.datepipe.transform(params.data.createdAt, 'yyyy-MM-dd H:mm')
        },
        {

          cellRenderer: 'buttonRenderer',
          resizable: false,
          suppressMovable: true,
          suppressMenu: true,
          sortable: false,
          minWidth: 100,
          pinned: 'left',
          floatingFilter: false,
          cellRendererParams: {
            buttons: [
              {
                icon: 'fa fa-user-times',
                title: 'Désactiver',
                style: {color: 'red'},
                hasRole: [RoleEnum.ADMIN],
                hidden: (user) => !user.activeUser,
                fn: (user) => this.disableUser(user),
              }, {
                icon: 'fa fa-user-plus',
                title: 'Activer',
                hasRole: [RoleEnum.ADMIN],
                hidden: (user) => user.activeUser,
                fn: (user) => this.enableUser(user),
              },
              {
                icon: 'fa fa-pencil-square-o',
                style: {color: 'rgb(39, 39, 89)'},
                title: 'Modifier',
                hasRole: [RoleEnum.ADMIN],
                fn: (user) => this.editUser(user),

              },
            ] as AgGridButton[]
          }
        }
      ]
    };
    this.localeText = this.initAgGridLocale();
  }

  initAgGridLocale() {
    const AG_GRID_LOCAL = {};
    Object.keys(AG_GRID_LOCALE_FR).forEach((key) => {
      AG_GRID_LOCAL[key] = AG_GRID_LOCALE_FR[key];
    });
    return AG_GRID_LOCAL;
  }

  onGridReady($event) {
    this.gridApi = $event.api;
    this.columnApi = $event.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.loadAllUsers();
  }

  private loadAllUsers() {
    this.userService.getAll()
      .subscribe(users => {
        this.gridApi.setRowData([...users as User[]]);
      });
  }

  private disableUser(user) {
    const modalRef = this.modalService.open(MConfirmModal, {size: "xl"});
    modalRef.componentInstance.title = "Confirmation"
    modalRef.componentInstance.text = `Are you sure you want to delete user ${user.username}`

    modalRef.result.then(confirmed => {
      if (confirmed) {
        this.userService.disableUser(user.id).subscribe(
          res => {
            this.loadAllUsers();
            this.toastr.success("Opération réussie");
          },
          err => this.toastr.error(err));
      }
    })
  }

  private enableUser(user) {
    const modalRef = this.modalService.open(MConfirmModal, {size: "xl"});
    modalRef.componentInstance.title = "Confirmation"
    modalRef.componentInstance.text = `Are you sure you want to activate user ${user.username}`

    modalRef.result.then(confirmed => {
      if (confirmed) {
        this.userService.enableUser(user.id).subscribe(
          res => {
            this.loadAllUsers();
            this.toastr.success("Opération réussie");
          },
          err => this.toastr.error(err));
      }
    })
  }

  private createUser() {
    this.editableUser = new User();
    this.modal.show();
  }

  private editUser(user) {
    this.editableUser = {...user}
    this.modal.show();
  }

  onUserInput(user: User) {
    this.modal.hide();
    if (!user) {
      return;
    }
    this.userService.save(user).subscribe(
      res => {
        this.loadAllUsers();
        this.toastr.success("Opération réussie");
      },
      err => this.toastr.error(err));

  }
}
