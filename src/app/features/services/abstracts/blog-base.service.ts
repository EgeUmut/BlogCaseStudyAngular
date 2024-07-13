import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PageRequest } from "../../../core/models/page-request";
import { CreateBlogRequest } from "../../models/requests/blog/create-blog-request";
import { UpdateBlogRequest } from "../../models/requests/blog/update-blog-request";
import { BlogListItemDto } from "../../models/responses/blog/blog-list-item-dto";
import { CreatedBlogResponse } from "../../models/responses/blog/created-blog-response";
import { DeletedBlogResponse } from "../../models/responses/blog/deleted-blog-response";
import { GetByIdBlogResponse } from "../../models/responses/blog/get-by-id-blog-response";
import { UpdatedBlogResponse } from "../../models/responses/blog/updated-blog-response";
import { DynamicQuery } from "../../../core/models/dynamic-query";


@Injectable()

export abstract class BlogBaseService {

    abstract getList(pageRequest: PageRequest):
        Observable<BlogListItemDto>;

    abstract getListByUserId(pageRequest: PageRequest,userId:string):
        Observable<BlogListItemDto>;

    abstract getById(id: number):
        Observable<GetByIdBlogResponse>;

    abstract delete(id: number)
        : Observable<DeletedBlogResponse>;

    abstract add(request: FormData)
        : Observable<CreatedBlogResponse>;
    abstract update(request: FormData)
        : Observable<UpdatedBlogResponse>;

    abstract getListBlogByDynamic(pageRequest: PageRequest, dynamic: DynamicQuery):
        Observable<BlogListItemDto>;


}