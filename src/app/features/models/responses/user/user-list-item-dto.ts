import { PageResponse } from "../../../../core/models/page-response";
import { GetListUserResponse } from "./get-list-user-response";

export interface UserListItemDto extends PageResponse{
    items:GetListUserResponse[];
}