import { Routes } from "@angular/router";
import { BloglistComponent } from "../../bloglist/bloglist.component";
import { BlogpostComponent } from "../../blogpost/blogpost.component";
import { CreateblogComponent } from "../../createblog/createblog.component";
import { UpdateblogComponent } from "../../updateblog/updateblog.component";
import { ProfileComponent } from "../../profile/profile.component";


export const siteRoutes: Routes = [
    {path: 'blogs', component: BloglistComponent },
    {path: 'blogpost/:blogId', component: BlogpostComponent },
    {path: 'createblog', component: CreateblogComponent },
    {path: 'updateblog/:blogId', component: UpdateblogComponent },
    {path: 'profile/:userId', component: ProfileComponent }
];