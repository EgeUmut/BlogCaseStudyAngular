import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { ValidationHelper } from '../../core/helpers/validationtoastrmessagehelper';
import { AuthService } from '../../features/services/concretes/auth.service';
import { BlogService } from '../../features/services/concretes/blog.service';
import { GetByIdBlogResponse } from '../../features/models/responses/blog/get-by-id-blog-response';
import { UpdateBlogRequest } from '../../features/models/requests/blog/update-blog-request';

@Component({
  selector: 'app-updateblog',
  standalone: true,
  imports: [CKEditorModule,ReactiveFormsModule,RouterModule,CommonModule],
  providers:[AuthService],
  templateUrl: './updateblog.component.html',
  styleUrl: './updateblog.component.css'
})
export class UpdateblogComponent implements OnInit{

  public Editor = ClassicEditor;
  UpdateBlogForm!:FormGroup;
  currentBlog!:GetByIdBlogResponse;
  isLoading:boolean = true;
  selectedFile: File | null = null;


  constructor(private formBuilder:FormBuilder, private blogService:BlogService, private toastr:ToastrService,private validationHelper:ValidationHelper,private change:ChangeDetectorRef,private authService:AuthService,private router:Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: { [x: string]: number; }) => {
      this.getBlogById(params["blogId"])
    })
  }

  getBlogById(id:number){
    this.blogService.getById(id).subscribe(
      (response: GetByIdBlogResponse) => {
        this.currentBlog = response;
        this.createForm();
        this.loadBlogtoForm();
      },
      (error: any) => {
        // Hata işleme mekanizmasını buraya ekleyebilirsiniz
        this.toastr.error( "Blog could not be found!");
        setTimeout(() => {
          this.router.navigate(['/blogs'])
        }, 2000)
      }
    );
  }

  createForm(){
    this.UpdateBlogForm=this.formBuilder.group({
      id:['',[Validators.required]],
      title:['',[Validators.required]],
      context:["",[Validators.required]],
      file: [''],
      userId:['',[Validators.required]]
    })
  }

  loadBlogtoForm(){
    this.UpdateBlogForm.patchValue({
      id: this.currentBlog.id,
      title: this.currentBlog.title,
      context: this.currentBlog.context,
      userId: this.currentBlog.userId
    });
    this.isLoading = false;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;  // Seçilen dosyayı değişkene atayın
    //console.log(this.selectedFile?.name);  // Dosya adını loglayarak kontrol edin
  }

  update() {
    if (this.UpdateBlogForm.valid) {
      let blogModel: UpdateBlogRequest = Object.assign({}, this.UpdateBlogForm.value);

      let formData = new FormData();
      formData.append('id', blogModel.id.toString());
      formData.append('title', blogModel.title);
      formData.append('context', blogModel.context);
      if (this.selectedFile) {  
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }
      formData.append('userId', blogModel.userId);

      this.blogService.update(formData).subscribe({
        //next => observable'dan gelen veri yakaladığımız fonksiyon
        next: (response) => {
          this.toastr.success(response.title + " Updated Successfully!");
        },
        error: (error) => {
          this.toastr.error("failed to update");
          this.change.markForCheck();
        },
        complete: () => {
          this.toastr.success("Updated Successfully!");
          this.UpdateBlogForm.reset();
          this.change.markForCheck();

          setTimeout(() => {
            this.router.navigate(['/blogs'])
          }, 2000)
        }
      })
    }
  }

  onFormSubmit() {
    this.validationHelper.checkValidation(this.UpdateBlogForm);
    

    if (this.UpdateBlogForm.invalid) {
      this.toastr.error("invalid fields");
      return;
    }

    if(this.isAdminOrAuthor()){
      this.toastr.error("You can not edit this blog");
      return;
    }

    this.update();
  }

  isAdminOrAuthor():boolean{
    if(this.currentBlog.userId == this.authService.getCurrentUserId() || this.authService.isAdmin()){
      return false;
    }
    return true;
  }

}
