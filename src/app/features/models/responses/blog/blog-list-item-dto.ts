import { PageResponse } from "../../../../core/models/page-response";
import { GetListBlogResponse } from "./get-list-blog-response";

export interface BlogListItemDto extends PageResponse{
    items:GetListBlogResponse[];
}