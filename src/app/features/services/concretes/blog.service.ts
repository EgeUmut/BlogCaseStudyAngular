import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../../../environments/environment";
import { DynamicQuery } from "../../../core/models/dynamic-query";
import { PageRequest } from "../../../core/models/page-request";
import { CreateBlogRequest } from "../../models/requests/blog/create-blog-request";
import { UpdateBlogRequest } from "../../models/requests/blog/update-blog-request";
import { BlogListItemDto } from "../../models/responses/blog/blog-list-item-dto";
import { CreatedBlogResponse } from "../../models/responses/blog/created-blog-response";
import { DeletedBlogResponse } from "../../models/responses/blog/deleted-blog-response";
import { GetByIdBlogResponse } from "../../models/responses/blog/get-by-id-blog-response";
import { UpdatedBlogResponse } from "../../models/responses/blog/updated-blog-response";
import { BlogBaseService } from "../abstracts/blog-base.service";



@Injectable({
    providedIn: 'root'
  })
  export class BlogService extends BlogBaseService {

  
    private readonly apiUrl:string = `${environment.API_URL}/blogs`
    
    constructor(private httpClient:HttpClient) {super() }

    override getListByUserId(pageRequest: PageRequest, userId: string): Observable<BlogListItemDto> {
      const newRequest: {[key: string]: string | number} = {
        userId: userId,
        pageIndex: pageRequest.pageIndex,
        pageSize: pageRequest.pageSize
      };
  
      return this.httpClient.get<BlogListItemDto>(`${this.apiUrl}/getlistbyuserid`, {
        params: newRequest
      }).pipe(
        map((response)=>{
          const newResponse:BlogListItemDto={
            index:pageRequest.pageIndex,
            size:pageRequest.pageSize,
            count:response.count,
            hasNext:response.hasNext,
            hasPrevious:response.hasPrevious,
            items:response.items,
            pages:response.pages
          };
          
          return newResponse;
        })
      )
    }
  
    override getList(pageRequest:PageRequest): Observable<BlogListItemDto> {
      const newRequest: {[key: string]: string | number} = {
        pageIndex: pageRequest.pageIndex,
        pageSize: pageRequest.pageSize
      };
  
      return this.httpClient.get<BlogListItemDto>(this.apiUrl, {
        params: newRequest
      }).pipe(
        map((response)=>{
          const newResponse:BlogListItemDto={
            index:pageRequest.pageIndex,
            size:pageRequest.pageSize,
            count:response.count,
            hasNext:response.hasNext,
            hasPrevious:response.hasPrevious,
            items:response.items,
            pages:response.pages
          };
          
          return newResponse;
        })
      )
    }
  
    override getById(id:number):Observable<GetByIdBlogResponse> {
      return this.httpClient.get<GetByIdBlogResponse>(`${this.apiUrl}/`+id);
    }
   
    override add(request: FormData): Observable<CreatedBlogResponse> {
      return this.httpClient.post<CreatedBlogResponse>(this.apiUrl,request);
    }
    override update(request: FormData): Observable<UpdatedBlogResponse> {
      return this.httpClient.put<UpdatedBlogResponse>(this.apiUrl,request);
    }
    override delete(id: number): Observable<DeletedBlogResponse> {
      return this.httpClient.delete<DeletedBlogResponse>(`${this.apiUrl}/`+id)
    }

    getListBlogByDynamic(pageRequest: PageRequest, dynamic: DynamicQuery): Observable<BlogListItemDto> {
        return this.httpClient.post<BlogListItemDto>(`${this.apiUrl}/dynamic/`, {
          filter: dynamic.filter,
          sort: dynamic.sort
        }, { params: new HttpParams().set("pageIndex", pageRequest.pageIndex).set("pageSize", pageRequest.pageSize) }).pipe(
          map((response) => {
            const newResponse: BlogListItemDto = {
              index: pageRequest.pageIndex,
              size: pageRequest.pageSize,
              count: response.count,
              hasNext: response.hasNext,
              hasPrevious: response.hasPrevious,
              items: response.items,
              pages: response.pages
            };
            return newResponse;
          })
        )
      }
  
  }