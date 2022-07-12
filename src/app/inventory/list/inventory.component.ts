import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {ColumnApi, GridApi, GridOptions} from 'ag-grid-community';
import {AG_GRID_LOCALE_FR} from '../../shared/ag-grid-i18n/locale.fr';
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  AgGridActionsButtonsComponent,
  AgGridButton
} from "../../shared/ag-grid-actions-buttons/ag-grid-actions-buttons.component";
import {HeaderButton} from "../../shared/components/header.component";
import {MModalComponent} from "../../shared/components/m-modal/m-modal.component";
import {ToastrService} from "ngx-toastr";
import {InventoryItem} from "../../model/inventory-item";
import {InventoryService} from "../../services/inventory.service";
import {RoleEnum} from "../../model/user";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryListComponent implements OnInit {
  @ViewChild(MModalComponent)
  private modal;

  gridOptions: GridOptions;
  frameworkComponents: any;
  rowData = [];
  localeText: any;
  gridApi: GridApi;
  private columnApi: ColumnApi;
  actionButtons = [
    {
      text: "Ajouter",
      icon: "fa fa-inventory-plus",
      fn: () => {
        this.createInventoryItem();
      }
    }
  ] as HeaderButton[];
  editableInventoryItem: InventoryItem = new InventoryItem();

  constructor(private authenticationService: AuthenticationService,
              private toastr: ToastrService,
              private datepipe: DatePipe, private modalService: NgbModal,
              private inventoryService: InventoryService) {
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
                icon: 'fa fa-pencil-square-o',
                style: {color: 'rgb(39, 39, 89)'},
                title: 'Modifier',
                hasRole: [RoleEnum.USER],
                fn: (inventory) => this.editInventoryItem(inventory),

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
    this.loadAllInventoryItems();
  }

  private loadAllInventoryItems() {
    this.inventoryService.getAll()
      .subscribe(inventoryItems => {
        this.gridApi.setRowData([...inventoryItems as InventoryItem[]]);
      });
  }

  private createInventoryItem() {
    this.editableInventoryItem = new InventoryItem();
    this.modal.show();
  }

  private editInventoryItem(inventory) {
    this.editableInventoryItem = {...inventory}
    this.modal.show();
  }

  onInventoryItemInput(inventory: InventoryItem) {
    this.modal.hide();
    if (!inventory) {
      return;
    }
    this.inventoryService.save(inventory).subscribe(
      res => {
        this.loadAllInventoryItems();
        this.toastr.success("Opération réussie");
      },
      err => this.toastr.error(err));

  }
}
