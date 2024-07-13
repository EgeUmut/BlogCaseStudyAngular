export interface UpdatedBlogResponse {
    id:number;
    title:string;
    context:string;
    file:File;
    userId:string;
    createdDate:Date;
    updatedDate:Date;
}