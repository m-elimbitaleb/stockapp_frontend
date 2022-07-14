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
import {Shipment} from "../../model/shipment";
import {ShipmentService} from "../../services/shipment.service";
import {InventoryMode} from "../../shared/utils/utils";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.scss'],
})
export class ShipmentListComponent implements OnInit {
  gridOptions: GridOptions;
  frameworkComponents: any;
  rowData = [];
  localeText: any;
  gridApi: GridApi;
  editableShipment: Shipment = new Shipment();
  actionButtons: HeaderButton[] = [];
  mode: InventoryMode = InventoryMode.SHIPMENT;
  @ViewChild(MModalComponent)
  private modal;
  private columnApi: ColumnApi;

  constructor(private authenticationService: AuthenticationService,
              private toastr: ToastrService,
              private activatedRoute: ActivatedRoute,
              private datepipe: DatePipe, private modalService: NgbModal,
              private shipmentService: ShipmentService) {
    this.mode = this.activatedRoute.snapshot.data.mode;
    this.frameworkComponents = {
      buttonRenderer: AgGridActionsButtonsComponent,
    };


  }

  get title() {
    return this.mode == InventoryMode.SHIPMENT ? "Shipment" : "Cross-Dock"
  }

  ngOnInit() {
    if (this.mode == InventoryMode.SHIPMENT) this.actionButtons.push({
      text: "Create shipment",
      icon: "fa fa-truck",
      fn: () => {
        this.createShipment();
      }
    });
    if (this.mode == InventoryMode.CROSSDOCK) this.actionButtons.push({
      text: "Create Cross-Dock",
      icon: "fa fa-exchange",
      fn: () => {
        this.createShipment(true);
      }
    });
    this.initAgGrid();

  }

  initAgGrid() {
    this.gridOptions = <GridOptions>{
      pagination: true,
      rowHeight: 45,
      rowModelType: 'clientSide',
      enableColResize: true,
      enableSorting: true,
      defaultColDef: {
        resizable: true, floatingFilter: true, filter: true
      },
      rowData: [],
      columnDefs: [
        {
          headerName: "Ref#",
          field: "reference"
        }, {
          headerName: "Shipper",
          field: "shipper"
        }, {
          headerName: "Created By",
          field: "creatorName"
        }, {
          headerName: "Created At",
          field: "createdAt",
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
                fn: (shipment) => this.editShipment(shipment),
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
    this.loadAllShipments();
  }

  onShipmentInput(shipment: Shipment) {
    this.modal.hide();
    if (!shipment) {
      return;
    }
    const action = typeof shipment.id == "number" ? "update" : "save";
    this.shipmentService[action](shipment).subscribe(
      res => {
        this.loadAllShipments();
        this.toastr.success("Operation successful");
      },
      err => this.toastr.error(err));
  }

  private loadAllShipments() {
    this.shipmentService.getAll()
      .subscribe((shipments: Shipment[]) => {
        const predicate = (it) => this.mode == InventoryMode.CROSSDOCK ? !!it.crossDock : !it.crossDock;
        this.gridApi.setRowData(shipments.filter(predicate));
      });
  }

  private createShipment(crossDock?: boolean) {
    this.editableShipment = new Shipment(crossDock);
    this.modal.show();
  }

  private editShipment(shipment) {
    this.editableShipment = {...shipment}
    this.modal.show();
  }

}
