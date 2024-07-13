import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PageRequest } from "../../../core/models/page-request";
import { CreateCommentRequest } from "../../models/requests/comment/create-comment-request";
import { UpdateCommentRequest } from "../../models/requests/comment/update-comment-request";
import { CommentListItemDto } from "../../models/responses/comment/comment-list-item-dto";
import { CreatedCommentResponse } from "../../models/responses/comment/created-comment-response";
import { DeletedCommentResponse } from "../../models/responses/comment/deleted-comment-response";
import { UpdatedCommentResponse } from "../../models/responses/comment/updated-comment-response";
import { GetByIdCommentResponse } from "../../models/responses/comment/get-by-id-comment-response";
import { DynamicQuery } from "../../../core/models/dynamic-query";


@Injectable()

export abstract class CommentBaseService {

    abstract getList(pageRequest: PageRequest):
        Observable<CommentListItemDto>;

        abstract getListByBlogId(pageRequest: PageRequest,blogId:number):
        Observable<CommentListItemDto>;

    abstract getById(commentId: number):
        Observable<GetByIdCommentResponse>;

    abstract delete(id: number)
        : Observable<DeletedCommentResponse>;

    abstract add(request: CreateCommentRequest)
        : Observable<CreatedCommentResponse>;
    abstract update(request: UpdateCommentRequest)
        : Observable<UpdatedCommentResponse>;

    abstract getListCommentByDynamic(pageRequest: PageRequest, dynamic: DynamicQuery):
        Observable<CommentListItemDto>;


}