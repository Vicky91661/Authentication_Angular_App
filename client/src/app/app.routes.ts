import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path:"",
        redirectTo:'login',
        pathMatch:'full'
       
    },
    {
        path:"login",
        component:LoginComponent
    },
    {
        path:"signup",
        component:SignupComponent
    },
    {
        path:'home',
        component:HomeComponent
    },
    {
        path:"**",
        component:PageNotFoundComponent
    }
];
