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
import {RoleEnum} from "../../model/user";
import {Warehouse} from "../../model/warehouse";
import {WarehouseService} from "../../services/warehouse.service";
import {location} from "ngx-bootstrap/utils/facade/browser";

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss'],
})
export class WarehouseListComponent implements OnInit {
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
      text: "Add",
      icon: "fa fa-warehouse-plus",
      fn: () => {
        this.createWarehouse();
      }
    }
  ] as HeaderButton[];
  editableWarehouseItem: Warehouse = new Warehouse();

  constructor(private authenticationService: AuthenticationService,
              private toastr: ToastrService,
              private datepipe: DatePipe, private modalService: NgbModal,
              private warehouseService: WarehouseService) {
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
        resizable: true, floatingFilter: true, filter: true
      },
      rowData: [],
      columnDefs: [
        {
          headerName: "ID#",
          field: "id"
        },
        {
          headerName: "Name",
          field: "name"
        },
        {
          headerName: "Location",
          field: "location",
          cellRenderer: (params) => {
            if (!params.value || params.value.split(",").length < 2) return params.value;

            return `<a href="https://www.google.com/maps/place/${params.value.trim()}" target="_blank" rel="noopener">Show on Map</a>`
          }
        },
        {
          headerName: 'Created At',
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
                fn: (warehouse) => this.editWarehouse(warehouse),

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
    this.loadAllWarehouses();
  }

  private loadAllWarehouses() {
    this.warehouseService.getAll()
      .subscribe(warehouses => {
        this.gridApi.setRowData([...warehouses as Warehouse[]]);
      });
  }

  private createWarehouse() {
    this.editableWarehouseItem = new Warehouse();
    this.modal.show();
  }

  private editWarehouse(warehouse) {
    this.editableWarehouseItem = {...warehouse}
    this.modal.show();
  }

  onWarehouseInput(warehouse: Warehouse) {
    this.modal.hide();
    if (!warehouse) {
      return;
    }
    this.warehouseService.save(warehouse).subscribe(
      res => {
        this.loadAllWarehouses();
        this.toastr.success("Opération réussie");
      },
      err => this.toastr.error(err));

  }
}
