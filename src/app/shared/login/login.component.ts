import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  adminExists: boolean = undefined;
  adminPasswordControl = new FormControl("", [Validators.required,
    Validators.minLength(8)]);

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.tokenValue) {
      this.router.navigate(['/']);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    this.authenticationService.checkAdminExists().subscribe(ack => {
      this.adminExists = !!ack["acknowledged"];
    })
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .subscribe(
        (data) => {
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.toastr.error(error);
          this.loading = false;
        }
      );
  }

  updateAdminPassword() {
    this.loading = true;
    this.authenticationService.updateAdminPassword(this.adminPasswordControl.value).subscribe(
      (data) => {
        this.loading = false;
        this.toastr.success("Admin password updated successfully");
        this.ngOnInit()
      },
      (error) => {
        this.toastr.error(error);
        this.loading = false;
      }
    );
  }
}
