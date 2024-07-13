import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../features/services/concretes/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ValidationHelper } from '../../core/helpers/validationtoastrmessagehelper';
import { UserForRegisterRequest } from '../../features/models/requests/auth/user-for-register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  RegisterForm!:FormGroup;

  constructor(private formBuilder:FormBuilder,private authService:AuthService,private router:Router,private toastrService:ToastrService,private change:ChangeDetectorRef,private validationHelper:ValidationHelper) {
  }

  ngOnInit(): void {
    this.createLoginForm();
    window.scrollTo(0,0);
  }

  createLoginForm(){
    this.RegisterForm=this.formBuilder.group({
      email:["",[Validators.required, Validators.email]],
      userName:["",Validators.required],
      password:["",Validators.required],
      confirmPassword:["",Validators.required]
    })
  }

  register(){
    if(this.RegisterForm.valid){
      let registerModel:UserForRegisterRequest = Object.assign({},this.RegisterForm.value);
      console.log(registerModel.userName);
      
      this.authService.register(registerModel).subscribe({
        //next => observable'dan gelen veri yakaladığımız fonksiyon
        next:(response)=>{
        },
        error:(error)=>{
          this.toastrService.error("Failed to Register: " +error.message);
          this.RegisterForm.reset();
          this.change.markForCheck();
        },
        complete:()=>{
          this.toastrService.success("Succesfully Registered!");
          this.RegisterForm.reset();
          this.change.markForCheck();

          setTimeout(()=>{
            this.router.navigate(['/login'])
          },2000)
        }
      })
    }}

    onFormSubmit(){
      this.validationHelper.checkValidation(this.RegisterForm);

      if (this.RegisterForm.invalid) {
        this.toastrService.error("Invalid inputs!");
        return;
      }

      if(this.checkIfPasswordsExistAndMatch()){
        this.toastrService.error("Passwords Do not Match!");
        return;
      }
    
      this.register();
    }

    checkIfPasswordsExistAndMatch(): boolean {
      const newPassword = this.RegisterForm.get('password')?.value;
      const newPasswordRepeat = this.RegisterForm.get('confirmPassword')?.value;
      let bool:boolean = false;
    
      // Eğer yeni şifre alanları boş ise, kontrol geçilecek (şifre güncellenmeyecek)
      if (!newPassword && !newPasswordRepeat) {
        bool = false;
      }
      if(newPassword != newPasswordRepeat){
        bool = true;
      }
      // Yeni şifre alanları doluysa, şifrelerin eşleşip eşleşmediğini kontrol ediyoruz
  
    
      return bool;
    }
}
