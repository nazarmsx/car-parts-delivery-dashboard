import {Component, ViewChild} from '@angular/core';
import {NgbModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api.service';
import {first} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Location} from "@angular/common";
import {Router, ActivatedRoute} from '@angular/router';
import {Admin} from '../../../../models'
import {Observable, Subject, merge, of} from 'rxjs';
import {HttpHandledErrorDescription} from '../../../../helpers'

const randomize = require('randomatic');

@Component({
  selector: 'edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})

export class EditUserComponent {
  userForm: FormGroup;
  public submitted: boolean = false;
  public loading: boolean = false;
  public user: Admin;
  public isPasswordVisible: boolean = false;

  constructor (private modalService: NgbModal, private formBuilder: FormBuilder, private apiService: ApiService, private toastr: ToastrService, private location: Location, private route: ActivatedRoute, private router: Router, private httpErrorDesc: HttpHandledErrorDescription) {

  }

  ngOnInit () {
    this.userForm = this.formBuilder.group({
        login: ['', Validators.required],
        password: ['', Validators.required],
        superAdmin: [false]
      }
    );
    const userId: string = this.route.snapshot.paramMap.get('id');
    if (userId) {

      this.apiService.getAdmin(userId)
        .pipe(first())
        .subscribe(
          (data: Admin) => {
            this.user = data;
            this.userForm.controls.login.setValue(data.login);
            if(data.claims && data.claims.superAdmin){
              this.userForm.controls.superAdmin.setValue(true);
            }
            this.userForm.controls.password.setValidators([]);
            this.userForm.controls.password.updateValueAndValidity();
          },
          (error: any) => {
          });
    }
  }

  get f () { return this.userForm.controls; }

  onSubmit () {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;

    if (this.user && this.user._id) {
      this.saveUser();
    }
    else {
      this.addAdmin();
    }
  }

  cancel () {
    this.location.back();
  }

  private saveUser () {

    this.user.login = this.f.login.value;
    this.user.claims={superAdmin:this.userForm.controls.superAdmin.value};
    if(this.f.password.value){
      this.user.password=this.f.password.value;
    }

    this.apiService.saveAdmin(this.user)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.status === 'OK') {
            this.toastr.success('User was updated!', 'Success!');
            this.location.back();
          }
          this.loading = false;
        },
        (error: any) => {
          this.toastr.error(JSON.stringify(error, null, 4), 'Something went wrong!');

          this.loading = false;
        });
  }

  private addAdmin () {

    this.apiService.createAdmin({
      login: this.f.login.value,
      password: this.f.password.value,
      claims:{superAdmin:this.userForm.controls.superAdmin.value}
    })
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.status === 'OK') {
            this.toastr.success('Admin was created', 'Success!');
            this.location.back();
          }
          this.loading = false;
        },
        (error: any) => {
          this.toastr.error(this.httpErrorDesc.getErrorDescription(error), 'Something went wrong!');
          this.loading = false;
        });
  }

  showPassword () {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  generatePassword () {
    this.userForm.controls.password.setValue(randomize('Aa0', 16));
  }

}