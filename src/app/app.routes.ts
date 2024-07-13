import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { BloglistComponent } from './pages/bloglist/bloglist.component';
import { BlogpostComponent } from './pages/blogpost/blogpost.component';
import { SitelayoutComponent } from './pages/shared/sitelayout/sitelayout.component';
import { siteRoutes } from './pages/shared/sitelayout/site.routes';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [

    {path:'',redirectTo:'blogs',pathMatch:'full'},
    //Site
    {path:'',component:SitelayoutComponent, children:siteRoutes},
    
    {path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent },

];
