import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FooterComponent } from '../shared/footer/footer.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeletedBlogResponse } from '../../features/models/responses/blog/deleted-blog-response';
import { AuthService } from '../../features/services/concretes/auth.service';
import { BlogService } from '../../features/services/concretes/blog.service';
import { GetByIdBlogResponse } from '../../features/models/responses/blog/get-by-id-blog-response';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../features/services/concretes/comment.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationHelper } from '../../core/helpers/validationtoastrmessagehelper';
import { CreateBlogRequest } from '../../features/models/requests/blog/create-blog-request';
import { CreateCommentRequest } from '../../features/models/requests/comment/create-comment-request';
import { PageRequest } from '../../core/models/page-request';
import { DynamicQuery, Filter, Sort } from '../../core/models/dynamic-query';
import { CommentListItemDto } from '../../features/models/responses/comment/comment-list-item-dto';

@Component({
  selector: 'app-blogpost',
  standalone: true,
  imports: [RouterModule,CommonModule,ReactiveFormsModule],
  providers:[AuthService],
  templateUrl: './blogpost.component.html',
  styleUrl: './blogpost.component.css'
})
export class BlogpostComponent implements OnInit{

  PAGE_SIZE: number = 5;
  isLoading: boolean = true;
  showModal: boolean = false;
  currentBlog!:GetByIdBlogResponse;
  currentUserId:string = "nodata";
  isAdmin:boolean = false;
  CommentForm!:FormGroup;
  defaulSort:Sort[] = [new Sort('createdDate','desc')];
  commentList!:CommentListItemDto;
  currentCommentPageNumber: number = 0;

  constructor(private blogService:BlogService,private toastr:ToastrService,private activatedRoute: ActivatedRoute,private router:Router,private authService:AuthService,private sanitizer: DomSanitizer,private change:ChangeDetectorRef,private commentService:CommentService,private formBuilder:FormBuilder,private validationHelper:ValidationHelper) {
    this.CommentForm=this.formBuilder.group({
      context:["",[Validators.required]]
    })
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: { [x: string]: number; }) => {
      this.getBlogById(params["blogId"])
    })
    this.getUserId();
    
  }

  getBlogById(id:number){
    this.blogService.getById(id).subscribe(
      (response: GetByIdBlogResponse) => {
        this.currentBlog = response;
        this.getComments(0);
        this.isLoading = false;
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

  getUserId(){
    if(this.authService.loggedIn()){
      this.currentUserId = this.authService.getCurrentUserId();
      this.isAdmin = this.authService.isAdmin();
    }
  }

  isLoggedIn():boolean{
    if(this.authService.loggedIn()){
      return true;
    }
    return false;
  }


  getSanitizedHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  openModal(blogId:number) {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  deleteBlog(){
    this.blogService.delete(this.currentBlog.id).subscribe(
      (response: DeletedBlogResponse) => {
        this.showModal = false;
        this.toastr.success("Blog successfully Deleted!");
        this.router.navigate(['/blogs'])
      },
      (error: any) => {
        this.toastr.error('Error fetching Blog: ' + error.message);

        setTimeout(()=>{
          this.router.navigate(['/blogs'])
        },1)
      }
    );
  }

  add(){
    if(this.CommentForm.valid){
      let commentModel:CreateCommentRequest = Object.assign({},this.CommentForm.value);
      commentModel.blogId = this.currentBlog.id;
      commentModel.userId = this.currentUserId;
 

      this.commentService.add(commentModel).subscribe({
        //next => observable'dan gelen veri yakaladığımız fonksiyon
        next:(response)=>{
        },
        error:(error)=>{
          this.toastr.error("Failed to add: " +error.message);
          this.change.markForCheck();
        },
        complete:()=>{
          this.toastr.success("Succesfully added!");
          this.getComments(0);
          this.CommentForm.reset();
          this.change.markForCheck();
        }
      })
    }}

    onFormSubmit(){
      this.validationHelper.checkValidation(this.CommentForm);

      if (this.CommentForm.invalid) {
        console.log("aga");
        
        this.toastr.error("Invalid inputs!");
        return;
      }
    
      this.add();
    }

    //comments
    getComments(pageNumber:number){
      this.isLoading = true;
      const combinedFilter = new Filter('blogId', 'eq', this.currentBlog.id.toString(), 'and', undefined);
      const dynamicQuery = new DynamicQuery(this.defaulSort, combinedFilter);
      this.commentService.getListCommentByDynamic({pageIndex:pageNumber, pageSize:this.PAGE_SIZE}, dynamicQuery).subscribe((response) => {
        this.commentList = response;
        this.isLoading = false;
      });
    }

    pageNumbers(){
      let pageNumbers = new Array(this.commentList.pages);
      return pageNumbers;
    }
  
    changePage(pageNumber:number){
      this.currentCommentPageNumber = pageNumber;
      
      this.getComments(this.currentCommentPageNumber);
    }
  
    onViewMoreClicked(): void {
      const nextPageIndex = this.commentList.index + 1;
      this.updateCurrentPageNumber();
      this.getComments(nextPageIndex);
    }
  
    onPreviousPageClicked(): void {
      const previousPageIndex = this.commentList.index - 1;
      this.lowerCurrentPageNumber();
      this.getComments(previousPageIndex);
    }
  
    updateCurrentPageNumber(): void {
      this.currentCommentPageNumber = this.commentList.index + 1;
    }
  
    lowerCurrentPageNumber(): void {
      this.currentCommentPageNumber = this.commentList.index - 1;
    }
}
