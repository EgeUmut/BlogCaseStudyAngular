import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationHelper } from '../../core/helpers/validationtoastrmessagehelper';
import { UserForRegisterRequest } from '../../features/models/requests/auth/user-for-register-request';
import { AuthService } from '../../features/services/concretes/auth.service';
import { UserService } from '../../features/services/concretes/user.service';
import { UpdateUserRequest } from '../../features/models/requests/user/update-user-request';
import { GetByIdUserResponse } from '../../features/models/responses/user/get-by-id-user-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  providers: [AuthService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  UpdateForm!:FormGroup;
  isLoading:boolean = true;
  currentUser!:GetByIdUserResponse;

  constructor(private formBuilder:FormBuilder,private userService:UserService,private router:Router,private toastrService:ToastrService,private change:ChangeDetectorRef,private validationHelper:ValidationHelper,private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: { [x: string]: string; }) => {
      this.getUserById(params["userId"])
    })
    
    window.scrollTo(0,0);
  }

  getUserById(id:string){
    this.userService.getById(id).subscribe(
      (response: GetByIdUserResponse) => {
        this.currentUser = response;
        this.createLoginForm();
        this.loadCurrentUser();
        
      },
      (error: any) => {
        // Hata işleme mekanizmasını buraya ekleyebilirsiniz
        this.toastrService.error( "User could not be found!");
        setTimeout(() => {
          this.router.navigate(['/blogs'])
        }, 2000)
      }
    );
  }

  createLoginForm(){
    this.UpdateForm=this.formBuilder.group({
      id:[""],
      email:["",[Validators.required, Validators.email]],
      userName:["",Validators.required],
      password:["",Validators.required],
      newPassword:[""],
      newPasswordComfirm:[""],
    })
  }

  loadCurrentUser() {
    // currentInstructor verilerinizi burada yükleyin.
    this.UpdateForm.patchValue({
      id: this.currentUser.id,
      userName: this.currentUser.userName,
      email: this.currentUser.email
    });
    this.isLoading = false;
  }

  update(){
    if(this.UpdateForm.valid){
      let updateModel:UpdateUserRequest = Object.assign({},this.UpdateForm.value);
      
      this.userService.update(updateModel).subscribe({
        //next => observable'dan gelen veri yakaladığımız fonksiyon
        next:(response)=>{
        },
        error:(error)=>{
          this.toastrService.error("Failed to Update: " +error.message);
          this.UpdateForm.reset();
          this.change.markForCheck();
        },
        complete:()=>{
          this.toastrService.success("Succesfully Updated!");
          this.UpdateForm.reset();
          this.change.markForCheck();

          setTimeout(()=>{
            this.router.navigate(['/blogs'])
          },2000)
        }
      })
    }}

    onFormSubmit(){
      this.validationHelper.checkValidation(this.UpdateForm);

      if (this.UpdateForm.invalid) {
        this.toastrService.error("Invalid inputs!");
        return;
      }

      if(this.checkIfPasswordsExistAndMatch()){
        this.toastrService.error("Passwords Do not Match!");
        return;
      }
    
      this.update();
    }

    checkIfPasswordsExistAndMatch(): boolean {
      const newPassword = this.UpdateForm.get('newPassword')?.value;
      const newPasswordRepeat = this.UpdateForm.get('newPasswordComfirm')?.value;
      let bool:boolean = false;
    
      // Eğer yeni şifre alanları boş ise, kontrol geçilecek (şifre güncellenmeyecek)
      if (!newPassword && !newPasswordRepeat) {
        bool = false;
      }
      else if(newPassword != newPasswordRepeat){
        bool = true;
      }
      // Yeni şifre alanları doluysa, şifrelerin eşleşip eşleşmediğini kontrol ediyoruz
  
    
      return bool;
    }
}
