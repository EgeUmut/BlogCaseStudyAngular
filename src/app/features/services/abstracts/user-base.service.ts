import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PageRequest } from "../../../core/models/page-request";
import { GetByIdUserResponse } from "../../models/responses/user/get-by-id-user-response";
import { UserListItemDto } from "../../models/responses/user/user-list-item-dto";
import { UpdateUserRequest } from "../../models/requests/user/update-user-request";

@Injectable()

export abstract class UserBaseService {

    abstract getListWithBlogs(pageRequest: PageRequest):
        Observable<UserListItemDto>;

    abstract getById(id: string):
        Observable<GetByIdUserResponse>;

    abstract delete(id: string):any;

    abstract update(request: UpdateUserRequest):any;




}