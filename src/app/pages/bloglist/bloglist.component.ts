import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FooterComponent } from '../shared/footer/footer.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogListItemDto } from '../../features/models/responses/blog/blog-list-item-dto';
import { BlogService } from '../../features/services/concretes/blog.service';
import { ToastrService } from 'ngx-toastr';
import { PageRequest } from '../../core/models/page-request';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../features/services/concretes/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DeletedBlogResponse } from '../../features/models/responses/blog/deleted-blog-response';
import { Filter, DynamicQuery, Sort } from './../../core/models/dynamic-query';
import { UserService } from '../../features/services/concretes/user.service';
import { GetListUserResponse } from '../../features/models/responses/user/get-list-user-response';

@Component({
  selector: 'app-bloglist',
  standalone: true,
  imports: [RouterModule,CommonModule],
  providers:[AuthService],
  templateUrl: './bloglist.component.html',
  styleUrl: './bloglist.component.css'
})
export class BloglistComponent implements OnInit{

  PAGE_SIZE: number = 2;
  isLoading: boolean = false;
  showModal: boolean = false;
  selectedBlogId!:number;
  currentUserId:string = "nodata";
  isAdmin:boolean = false;
  blogList: BlogListItemDto = {
    index: 0,
    size: 0,
    count: 0,
    hasNext: false,
    hasPrevious: false,
    pages: 0,
    items: []
  };

  currentPageNumber: number = 0;
  userIdFilter!:string;
  startDateFilter!:string;
  endDateFilter!:string;
  defaulSort:Sort[] = [new Sort('createdDate','desc')];
  userWithBlogsList!:GetListUserResponse[];

  constructor(private blogService:BlogService,private toastr:ToastrService,private activatedRoute: ActivatedRoute,private router:Router,private authService:AuthService,private sanitizer: DomSanitizer,private change:ChangeDetectorRef,private userService:UserService) {
  }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.getList({ pageIndex: 0, pageSize: this.PAGE_SIZE });
    this.getUserId();
    this.getUsersWithBlogs();
  }

  getList(pageRequest: PageRequest) {
    this.isLoading = true;
    // this.blogService.getList(pageRequest).subscribe((response) => {
    //   this.blogList = response;
    //   this.isLoading = false;
    //   //this.updateCurrentPageNumber();
    // });

    const dynamicQuery = new DynamicQuery(this.defaulSort, undefined);
    this.blogService.getListBlogByDynamic({pageIndex:0, pageSize:this.PAGE_SIZE}, dynamicQuery).subscribe((response) => {
      this.blogList = response;
      this.isLoading = false;
    });
  }

  getUsersWithBlogs(){
    this.userService.getListWithBlogs({pageIndex:0, pageSize:50}).subscribe((response) => {
      this.userWithBlogsList = response.items;
      this.isLoading = false;
    });
  }

  getUserId(){
    if(this.authService.loggedIn()){
      this.currentUserId = this.authService.getCurrentUserId();
      this.isAdmin = this.authService.isAdmin();
    }
  }

  getSanitizedHtml(content: string): SafeHtml {
    let truncatedContent = content.substring(0, 300);
    truncatedContent += '...';
    return this.sanitizer.bypassSecurityTrustHtml(truncatedContent);
  }

  openModal(blogId:number) {
    this.selectedBlogId = blogId;
    this.showModal = true;
  }

  closeModal() {
    this.selectedBlogId = 0;
    this.showModal = false;
  }

  deleteBlog(){
    this.blogService.delete(this.selectedBlogId).subscribe(
      (response: DeletedBlogResponse) => {
        this.showModal = false;
        this.getList({ pageIndex: 0, pageSize: this.PAGE_SIZE });
        window.scrollTo(0,0);
        this.change.detectChanges();
        this.toastr.success("Blog successfully Deleted!");
      },
      (error: any) => {
        this.toastr.error('Error fetching Blog: ' + error.message);

        setTimeout(()=>{
          this.router.navigate(['/blogs'])
        },1)
      }
    );
  }

  filterBlogs(userId?: string, startDate?: string, endDate?: string, pageNumber?: number): void {
    const filters: Filter[] = [];
  
    if (userId) {
      this.userIdFilter = userId;
      filters.push(new Filter('userId', 'eq', userId));
    } else {
      this.userIdFilter = "";
    }
    if(pageNumber == null){
      this.currentPageNumber = 0;
    }
  
    if (startDate && endDate) {
      const formattedStartDate = this.formatDateString(startDate);
      const formattedEndDate = this.formatDateString(endDate);
      filters.push(new Filter('createdDate', 'gte', formattedStartDate));
      filters.push(new Filter('createdDate', 'lte', formattedEndDate));
      //filters.push(new Filter('', '', undefined, 'and', [dateFilter, dateEndFilter]));
  
      this.startDateFilter = startDate;
      this.endDateFilter = endDate;
    } else {
      this.startDateFilter = "";
      this.endDateFilter = "";
    }
  
    let combinedFilter: Filter | undefined;
    if (filters.length === 1) {
      combinedFilter = filters[0];
    } else if (filters.length > 1) {

      if(this.userIdFilter){

        combinedFilter = new Filter('userId', 'eq', this.userIdFilter, 'and', filters);
      }
      else{
        combinedFilter = new Filter('createdDate', 'gte', this.startDateFilter, 'and', filters);
      }
      //combinedFilter = new Filter('', '', undefined, 'and', filters);
    }
  
    const dynamicQuery = new DynamicQuery(this.defaulSort, combinedFilter);
    //console.log('Dynamic Query:', JSON.stringify(dynamicQuery, null, 2));
  
    this.blogService.getListBlogByDynamic({ pageIndex: this.currentPageNumber, pageSize: this.PAGE_SIZE }, dynamicQuery).subscribe((response) => {
      this.blogList = response;
    });
  }

  private formatDateString(date: string): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  pageNumbers(){
    let pageNumbers = new Array(this.blogList.pages);
    return pageNumbers;
  }

  changePage(pageNumber:number){
    this.currentPageNumber = pageNumber;
    window.scrollTo(0,0);
    this.filterBlogs(this.userIdFilter,this.startDateFilter,this.endDateFilter,this.currentPageNumber);
  }

  onViewMoreClicked(): void {
    const nextPageIndex = this.blogList.index + 1;
    this.updateCurrentPageNumber();
    window.scrollTo(0,0);
    this.filterBlogs(this.userIdFilter,this.startDateFilter,this.endDateFilter,nextPageIndex);
  }

  onPreviousPageClicked(): void {
    const previousPageIndex = this.blogList.index - 1;
    this.lowerCurrentPageNumber();
    window.scrollTo(0,0);
    this.filterBlogs(this.userIdFilter,this.startDateFilter,this.endDateFilter,previousPageIndex);
  }

  updateCurrentPageNumber(): void {
    this.currentPageNumber = this.blogList.index + 1;
  }

  lowerCurrentPageNumber(): void {
    this.currentPageNumber = this.blogList.index - 1;
  }

}
