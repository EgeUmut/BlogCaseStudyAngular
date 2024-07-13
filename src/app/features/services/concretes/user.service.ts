import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "../../../../environments/environment.development"
import { UserBaseService } from "../abstracts/user-base.service"
import { map, Observable } from "rxjs"
import { PageRequest } from "../../../core/models/page-request"
import { GetByIdUserResponse } from "../../models/responses/user/get-by-id-user-response"
import { UserListItemDto } from "../../models/responses/user/user-list-item-dto"
import { DeletedBlogResponse } from "../../models/responses/blog/deleted-blog-response"
import { UpdatedBlogResponse } from "../../models/responses/blog/updated-blog-response"
import { UpdateUserRequest } from "../../models/requests/user/update-user-request"

@Injectable({
    providedIn: 'root'
  })
  export class UserService extends UserBaseService {
  
    private readonly apiUrl:string = `${environment.API_URL}/users`
    
    constructor(private httpClient:HttpClient) {super() }

    override getListWithBlogs(pageRequest: PageRequest): Observable<UserListItemDto>  {
        const newRequest: {[key: string]: string | number} = {
          pageIndex: pageRequest.pageIndex,
          pageSize: pageRequest.pageSize
        };
    
        return this.httpClient.get<UserListItemDto>(this.apiUrl, {
          params: newRequest
        }).pipe(
          map((response)=>{
            const newResponse:UserListItemDto={
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

    override getById(id: string): Observable<GetByIdUserResponse> {
        return this.httpClient.get<GetByIdUserResponse>(`${this.apiUrl}/`+id);
    }
    override delete(id: string) {
        return this.httpClient.delete<DeletedBlogResponse>(`${this.apiUrl}/`+id)
    }
    override update(request: UpdateUserRequest) {
        return this.httpClient.put<UpdatedBlogResponse>(this.apiUrl,request);
    }
  
  }