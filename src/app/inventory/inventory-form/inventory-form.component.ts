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
import {InventoryItem, MeasureUnit} from "../../model/inventory-item";

@Component({
  selector: "m-inventory-form",
  styleUrls: ["inventory-form.component.scss"],
  templateUrl: "inventory-form.component.html"

})
export class InventoryItemFormComponent implements MModalResult, OnInit {
  measureUnits = Object.values(MeasureUnit);

  private _inventory: InventoryItem = new InventoryItem();

  get inventory() {
    return this._inventory;
  }

  @Input() set inventory(value) {
    this._inventory = value;
    this.buildEditForm();
  }

  @Output() onResult: EventEmitter<InventoryItem> = new EventEmitter<InventoryItem>();
  inventoryForm: FormGroup;
  passwordConfirmation: FormControl;

  get isEditMode() {
    return typeof this.inventory.id == "number";
  }

  get form() {
    return this.inventoryForm.controls;
  }

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildEditForm() {
    this.passwordConfirmation = new FormControl("");
    this.inventoryForm = this.formBuilder.group({
      id: [this.inventory.id],
      name: [this.inventory.name, Validators.required],
      measureUnit: [this.inventory.measureUnit, Validators.required],
      purchasePrice: [this.inventory.purchasePrice, Validators.required],
      quantity: [this.inventory.quantity, Validators.required],
      manufacturer: [this.inventory.manufacturer],
      reference: [this.inventory.reference],
      universalProductCode: [this.inventory.universalProductCode],
      description: [this.inventory.description],
    });
  }

  buildForm() {
    this.passwordConfirmation = new FormControl("", Validators.minLength(8));
    this.inventoryForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      measureUnit: [MeasureUnit.BOX, Validators.required],
      purchasePrice: [0, Validators.required],
      quantity: [1, Validators.required],
      manufacturer: [''],
      reference: [''],
      universalProductCode: [''],
      description: [''],
    });
  }


  onSubmit() {
    this.onResult.emit(this.inventoryForm.value as InventoryItem);
  }

  onCancel() {
    this.onResult.emit(null);
  }
}
