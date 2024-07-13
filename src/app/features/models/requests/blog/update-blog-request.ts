export interface UpdateBlogRequest {
    id:number;
    title:string;
    context:string;
    file:File;
    userId:string;
}