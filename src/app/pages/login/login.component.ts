import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationHelper } from '../../core/helpers/validationtoastrmessagehelper';
import { AuthService } from '../../features/services/concretes/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
import { UserForLoginRequest } from '../../features/models/requests/auth/user-for-login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule,ReactiveFormsModule,CommonModule,RouterModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm!:FormGroup;

  constructor(private formBuilder:FormBuilder,private authService:AuthService,private router:Router,private toastrService:ToastrService,private change:ChangeDetectorRef,private validationHelper:ValidationHelper) {}


  ngOnInit(): void {
    this.createLoginForm();
    window.scrollTo(0,0);
  }

  createLoginForm(){
    this.loginForm=this.formBuilder.group({
      email:["",[Validators.required, Validators.email]],
      password:["",Validators.required]
      //authenticatorCode:[null]
    })
  }

  login() {
    if (this.loginForm.valid) {
      let loginModel: UserForLoginRequest = Object.assign({}, this.loginForm.value);
      this.authService.login(loginModel).subscribe({
        next: (response) => {
          if (response.accessToken) {
            this.toastrService.success('Login successful');
            this.router.navigate(['/blogs']);
          }
        },
        error:(error)=>{
          this.toastrService.error("Failed to Login: " + error.error.Detail);
          this.loginForm.reset();
          this.change.markForCheck();
        }
      }
    );
    }
    else{
      this.validationHelper.checkValidation(this.loginForm);
    }
  }

}
