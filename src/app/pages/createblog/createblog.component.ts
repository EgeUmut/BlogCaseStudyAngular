import { AfterViewInit, ChangeDetectorRef, Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BlogService } from '../../features/services/concretes/blog.service';
import { ToastrService } from 'ngx-toastr';
import { ValidationHelper } from '../../core/helpers/validationtoastrmessagehelper';
import { CreateBlogRequest } from '../../features/models/requests/blog/create-blog-request';
import { AuthService } from '../../features/services/concretes/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-createblog',
  standalone: true,
  imports: [CKEditorModule,ReactiveFormsModule,RouterModule,CommonModule],
  providers:[AuthService],
  templateUrl: './createblog.component.html',
  styleUrl: './createblog.component.css'
})
export class CreateblogComponent{
  public Editor = ClassicEditor;
  BlogForm!:FormGroup


  constructor(private formBuilder:FormBuilder, private blogService:BlogService, private toastr:ToastrService,private validationHelper:ValidationHelper,private change:ChangeDetectorRef,private authService:AuthService,private router:Router) {
    this.BlogForm=this.formBuilder.group({
      title:['',[Validators.required]],
      context:["",[Validators.required]],
      file:["",[Validators.required]],
    })
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.BlogForm?.get('file')?.setValue(file);
  }

  add(){
    if(this.BlogForm.valid){
      let BlogModel:CreateBlogRequest = Object.assign({},this.BlogForm.value);
      
      let formData = new FormData();
      formData.append('title', BlogModel.title);
      formData.append('context', BlogModel.context);
      formData.append('file', BlogModel.file);
      formData.append('userId', this.authService.getCurrentUserId());
 

      this.blogService.add(formData).subscribe({
        //next => observable'dan gelen veri yakaladığımız fonksiyon
        next:(response)=>{
        },
        error:(error)=>{
          this.toastr.error("Failed to add: " +error.message);
          this.change.markForCheck();
        },
        complete:()=>{
          this.toastr.success("Succesfully added!");
          this.BlogForm.reset();
          this.change.markForCheck();

          setTimeout(()=>{
            this.router.navigate(['/blogs'])
          },2000)
        }
      })
    }}

    onFormSubmit(){
      this.validationHelper.checkValidation(this.BlogForm);

      if (this.BlogForm.invalid) {
        this.toastr.error("Invalid inputs!");
        return;
      }
    
      this.add();
    }
}
