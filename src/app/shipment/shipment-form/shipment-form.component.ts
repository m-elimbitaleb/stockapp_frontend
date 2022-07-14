/*
 * Copyright (c) 2021. stockapp.
 * Proprietary source code; any copy or modification is prohibited.
 *
 * @author Moulaye Abderrahmane <moolsbytheway@gmail.com>
 *
 */

import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MModalResult} from "../../shared/components/m-modal/m-modal.component";
import {Shipment} from "../../model/shipment";
import {ColumnApi, GridApi, GridOptions} from "ag-grid-community";
import {AG_GRID_LOCALE_FR} from "../../shared/ag-grid-i18n/locale.fr";
import {InventoryItem} from "../../model/inventory-item";
import {InventoryService} from "../../services/inventory.service";
import {DatePipe} from "@angular/common";
import {AuthenticationService} from "../../services/authentication.service";
import {ToastrService} from "ngx-toastr";
import {ShipmentService} from "../../services/shipment.service";
import {ActivatedRoute} from "@angular/router";
import {InventoryMode} from "../../shared/utils/utils";

@Component({
  selector: "m-shipment-form",
  styleUrls: ["shipment-form.component.scss", "../../shared/ag-grid-actions-buttons/ag-grid-actions-buttons.component.scss"],
  templateUrl: "shipment-form.component.html"
})
export class ShipmentFormComponent implements MModalResult, OnInit {

  @Output() onResult: EventEmitter<Shipment> = new EventEmitter<Shipment>();
  shipmentForm: FormGroup;
  passwordConfirmation: FormControl;
  gridOptions: GridOptions;
  frameworkComponents: any;
  rowData = [];
  localeText: any;
  gridApi: GridApi;
  private mode: InventoryMode;
  private columnApi: ColumnApi;

  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private activatedRoute: ActivatedRoute,
              private datepipe: DatePipe, private auth: AuthenticationService,
              private shipmentService: ShipmentService,
              private inventoryService: InventoryService) {
    this.mode = this.activatedRoute.snapshot.data.mode;
  }

  private _shipment: Shipment = new Shipment();

  get shipment() {
    return this._shipment;
  }

  @Input() set shipment(value) {
    this._shipment = value;
    this.buildEditForm();
    this.checkSelectedItems();
  }

  get isEditMode() {
    return typeof this.shipment.id == "number";
  }

  get form() {
    return this.shipmentForm.controls;
  }

  onGridReady($event) {
    this.gridApi = $event.api;
    this.columnApi = $event.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.loadAllInventoryItems();
  }

  initAgGrid() {
    this.gridOptions = <GridOptions>{
      pagination: false,
      rowHeight: 45,
      rowModelType: 'clientSide',
      enableColResize: true,
      enableSorting: true,
      rowSelection: "multiple",
      defaultColDef: {
        resizable: true, floatingFilter: true, filter: true
      },
      rowData: [],
      columnDefs: [
        {
          checkboxSelection: true,
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
          headerName: 'Storage Date',
          field: 'storageDate',
          valueFormatter: params => this.datepipe.transform(params.data.storageDate, 'yyyy-MM-dd H:mm')
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

  ngOnInit() {
    this.initAgGrid();
    this.buildForm();
  }

  buildEditForm() {
    this.uncheckAll()
    this.passwordConfirmation = new FormControl("");
    this.shipmentForm = this.formBuilder.group({
      id: [this.shipment.id],
      reference: [this.shipment.reference, Validators.required],
      shipper: [this.shipment.shipper, Validators.required],
    });
  }

  buildForm() {
    this.passwordConfirmation = new FormControl("", Validators.minLength(8));
    this.shipmentForm = this.formBuilder.group({
      id: [''],
      reference: ['', Validators.required],
      shipper: ['', Validators.required],
    });
  }

  onSubmit() {
    const selectedNodes = this.gridApi.getSelectedNodes();

    if (selectedNodes?.length == 0) {
      this.toastr.error("You must select items to be shipped");
      this.onResult.emit(null)
      return;
    }

    const selectedItems = selectedNodes.map(node => node.data.id);

    const shipment = this.shipmentForm.value as Shipment;
    shipment.items = selectedItems;
    shipment.crossDock = !!this.shipment.crossDock;

    this.onResult.emit(shipment);
  }

  onCancel() {
    this.onResult.emit(null);
  }

  private loadAllInventoryItems() {
    this.inventoryService.getAll()
      .subscribe((inventoryItems: InventoryItem[]) => {
        let predicate = (it) => !!it.storageDate && !it.crossDock;
        if (this.mode == InventoryMode.CROSSDOCK) predicate = (it) => !it.storageDate && !!it.crossDock;
        this.gridApi.setRowData(inventoryItems.filter(predicate));
        this.uncheckAll(true)
      });
  }

  private checkSelectedItems() {
    if (!this.gridApi) return;
    this.gridApi.forEachNode(node => {
      const items = this.shipment.items || []
      if (items.includes(node.data.id)) {
        node.setSelected(true)
      }
    });
  }

  private uncheckAll(checkItems?: boolean) {
    this.shipmentService.getItemsInShipments()
      .subscribe((itemsInShipments: number[]) => {
        if (!this.gridApi) return;
        this.gridApi.forEachNode(node => {
          node.setSelected(false)
          node.setRowSelectable(true)
          // if the item is already in shipments but not in the current shipment dont allow selection
          const shipmentItems = this.shipment.items || []
          const itemIsInCurrentShipment = shipmentItems.includes(node.data.id);
          const blacklist = itemsInShipments.filter(it => !shipmentItems.includes(it));
          if (!itemIsInCurrentShipment && blacklist.includes(node.data.id)) {
            node.setRowSelectable(false)
          } else if (itemIsInCurrentShipment) {
            node.setSelected(true)
          }

        });
      });
  }
}
