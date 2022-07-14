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
import {Warehouse} from "../../model/warehouse";

@Component({
  selector: "m-warehouse-form",
  styleUrls: ["warehouse-form.component.scss"],
  templateUrl: "warehouse-form.component.html"

})
export class WarehouseFormComponent implements MModalResult, OnInit {
  private _warehouse: Warehouse = new Warehouse();

  get warehouse() {
    return this._warehouse;
  }

  @Input() set warehouse(value) {
    this._warehouse = value;
    this.buildEditForm();
  }

  @Output() onResult: EventEmitter<Warehouse> = new EventEmitter<Warehouse>();
  warehouseForm: FormGroup;
  passwordConfirmation: FormControl;

  get isEditMode() {
    return typeof this.warehouse.id == "number";
  }

  get form() {
    return this.warehouseForm.controls;
  }

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildEditForm() {
    this.passwordConfirmation = new FormControl("");
    this.warehouseForm = this.formBuilder.group({
      id: [this.warehouse.id],
      name: [this.warehouse.name, Validators.required],
      location: [this.warehouse.location],
    });
  }

  buildForm() {
    this.passwordConfirmation = new FormControl("", Validators.minLength(8));
    this.warehouseForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      location: [''],
    });
  }


  onSubmit() {
    this.onResult.emit(this.warehouseForm.value as Warehouse);
  }

  onCancel() {
    this.onResult.emit(null);
  }
}
