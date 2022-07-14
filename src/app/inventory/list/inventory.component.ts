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
import {ActivatedRoute} from "@angular/router";
import {InventoryMode} from "../../shared/utils/utils";
import {RoleEnum} from "../../model/user";
import {ShipmentService} from "../../services/shipment.service";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryListComponent implements OnInit {
  gridOptions: GridOptions;
  frameworkComponents: any;
  rowData = [];
  localeText: any;
  gridApi: GridApi;
  editableInventoryItem: InventoryItem = new InventoryItem();
  actionButtons: HeaderButton[];
  @ViewChild(MModalComponent)
  private modal;
  private columnApi: ColumnApi;
  private readonly inventoryMode: InventoryMode;

  constructor(private authenticationService: AuthenticationService,
              private toastr: ToastrService,
              private shipmentService: ShipmentService,
              private activatedRoute: ActivatedRoute,
              private datepipe: DatePipe, private modalService: NgbModal,
              private inventoryService: InventoryService) {
    this.inventoryMode = this.activatedRoute.snapshot.data['mode'];
    this.frameworkComponents = {
      buttonRenderer: AgGridActionsButtonsComponent,
    };

    const actionButtons = [];

    if (this.inventoryMode == InventoryMode.INVENTORY) {
      actionButtons.push(
        {
          text: "Add",
          icon: "fa fa-inventory-plus",
          fn: () => {
            this.createInventoryItem();
          }
        } as HeaderButton);
    }

    this.actionButtons = actionButtons;
  }

  get title() {
    switch (this.inventoryMode) {
      case InventoryMode.INVENTORY:
        return "Inventory";
      case InventoryMode.STORAGE:
        return "Storage";
      case InventoryMode.CROSSDOCK:
        return "Cross-Dock";
      default:
        return "";
    }
  }

  ngOnInit() {
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
          headerName: "Name",
          field: "name"
        },
        {
          headerName: "Manufacturer",
          field: "manufacturer"
        },
        {
          headerName: "UPC",
          field: "universalProductCode"
        },
        {
          headerName: "Price",
          field: "purchasePrice"
        },
        {
          headerName: "Created By",
          field: "creatorName",
          hide: this.inventoryMode == InventoryMode.STORAGE || this.inventoryMode == InventoryMode.CROSSDOCK
        },
        {
          headerName: 'Created At',
          field: 'createdAt',
          hide: this.inventoryMode == InventoryMode.STORAGE || this.inventoryMode == InventoryMode.CROSSDOCK,
          valueFormatter: params => this.datepipe.transform(params.data.createdAt, 'yyyy-MM-dd H:mm')
        },
        {
          headerName: "Cross-Dock",
          cellRenderer: (params) => {
            const isCrossDock = !!params.data.crossDock;
            if (isCrossDock) return `<i style="color: green" class="fa fa-check-circle"></i>`;
            return `<i style="color: red" class="fa fa-times-circle"></i>`
          },
          hide: this.inventoryMode != InventoryMode.INVENTORY
        },
        {
          headerName: 'Storage Date',
          field: 'storageDate',
          hide: this.inventoryMode != InventoryMode.STORAGE,
          valueFormatter: params => this.datepipe.transform(params.data.storageDate, 'yyyy-MM-dd H:mm')
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
              {
                icon: 'fa fa-cube',
                visible: (it) => !it.crossDock && this.inventoryMode == InventoryMode.INVENTORY,
                style: {color: 'green'},
                title: 'Pick to storage',
                hasRole: [RoleEnum.USER],
                fn: (inventory) => this.pickForStorage(inventory),
              },
              {
                icon: 'fa fa-cube',
                visible: _ => this.inventoryMode == InventoryMode.STORAGE,
                style: {color: 'red'},
                title: 'Remove from storage',
                hasRole: [RoleEnum.USER],
                fn: (inventory) => this.pickForStorage(inventory, true),
              },
              {
                icon: 'fa fa-exchange',
                visible: it => it.crossDock && this.inventoryMode == InventoryMode.INVENTORY,
                style: {color: 'red'},
                title: 'Remove from Cross-Dock',
                hasRole: [RoleEnum.USER],
                fn: (inventory) => this.pickForCrossDock(inventory, true),
              },
              {
                icon: 'fa fa-exchange',
                visible: it => !it.crossDock && this.inventoryMode == InventoryMode.INVENTORY,
                style: {color: 'green'},
                title: 'Pick for Cross-Dock',
                hasRole: [RoleEnum.USER],
                fn: (inventory) => this.pickForCrossDock(inventory),
              }
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

  onInventoryItemInput(inventory: InventoryItem) {
    this.modal.hide();
    if (!inventory) {
      return;
    }
    const action = typeof inventory.id == "number" ? "update" : "save";
    this.inventoryService[action](inventory).subscribe(
      res => {
        this.loadAllInventoryItems();
        this.toastr.success("Operation successful");
      },
      err => this.toastr.error(err));

  }

  private loadAllInventoryItems() {
    this.inventoryService.getAll()
      .subscribe((inventoryItems: InventoryItem[]) => {
        let predicate = (it) => it;
        if (this.inventoryMode == InventoryMode.CROSSDOCK) {
          predicate = (it) => !!it.crossDock;
        } else if (this.inventoryMode == InventoryMode.STORAGE) {
          predicate = (it) => !!it.storageDate;
        } else if (this.inventoryMode == InventoryMode.SHIPMENT) {
          predicate = (it) => !!it.storageDate && !it.crossDock;
        } else if (this.inventoryMode == InventoryMode.INVENTORY) {
          predicate = (it) => !it.storageDate;
        }
        this.gridApi.setRowData(inventoryItems.filter(predicate));
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

  private pickForStorage(inventory, remove?: boolean) {
    (new Promise(resolve => {
      if (!remove) {
        resolve(true);
      } else {
        this.shipmentService.getItemsInShipments()
          .subscribe((itemsInShipments: number[]) => {
            if (itemsInShipments.includes(inventory.id)) {
              this.toastr.error("Cannot remove from storage, item is already in a shipment");
              resolve(false)
            } else {
              resolve(true)
            }
          });
      }
    })).then(continueExecution => {
      if (!continueExecution) return;
      this.inventoryService.pickToStorage(inventory.id, remove).subscribe(
        res => {
          this.loadAllInventoryItems();
          this.toastr.success("Operation successful");
        },
        err => this.toastr.error(err));
    });
  }

  private pickForCrossDock(inventory, remove?: boolean) {
    (new Promise(resolve => {
      if (!remove) {
        resolve(true);
      } else {
        this.shipmentService.getItemsInShipments()
          .subscribe((itemsInShipments: number[]) => {
            if (itemsInShipments.includes(inventory.id)) {
              this.toastr.error("Cannot remove, item is already in a cross-dock shipment");
              resolve(false)
            } else {
              resolve(true)
            }
          });
      }
    })).then(continueExecution => {
      if (!continueExecution) return;
      this.inventoryService.pickForCrossDock(inventory.id, remove).subscribe(
        res => {
          this.loadAllInventoryItems();
          this.toastr.success("Operation successful");
        },
        err => this.toastr.error(err));
    });
  }


  private createShipment() {
    // todo
  }
}
