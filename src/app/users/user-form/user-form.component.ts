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
import {RoleEnum, User} from "../../model/user";

@Component({
  selector: "m-user-form",
  styleUrls: ["user-form.component.scss"],
  templateUrl: "user-form.component.html"

})
export class UserFormComponent implements MModalResult, OnInit {

  private _user: User = new User();
  roles = Object.values(RoleEnum);

  get user() {
    return this._user;
  }

  @Input() warehouses: string[]
  @Input() set user(value) {
    this._user = value;
    this.buildEditForm()
  }

  @Output() onResult: EventEmitter<User> = new EventEmitter<User>();
  public userForm: FormGroup;
  passwordConfirmation: FormControl;

  get passwordMatches() {
    return this.isEditMode || !!this.userForm.controls["password"].value &&
      this.userForm.controls["password"].value == this.passwordConfirmation.value
  }

  get isEditMode() {
    return typeof this.user.id == "number";
  }

  get form() {
    return this.userForm.controls;
  }

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm()
  }

   buildEditForm() {
    this.passwordConfirmation = new FormControl("");
    this.userForm = this.formBuilder.group({
      id: [this.user.id],
      username: [this.user.username, Validators.required],
      phone: [this.user.phone, Validators.required],
      email: [this.user.email, Validators.email],
      role: [this.user.role, Validators.required],
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      warehouseName: [this.user.warehouseName, Validators.required],
      password: [''],
    });
  }

  buildForm() {
    this.passwordConfirmation = new FormControl("", Validators.minLength(8));
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.email],
      phone: ['', Validators.required],
      role: [RoleEnum.USER, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      warehouseName: ["Default", Validators.required],
      password: ['', Validators.minLength(8)],
    });
  }


  onSubmit() {
    this.onResult.emit(this.userForm.value as User);
  }

  onCancel() {
    this.onResult.emit(null);
  }
}
