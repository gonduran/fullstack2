import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { Catalog1Component } from './components/catalog1/catalog1.component';
import { Catalog2Component } from './components/catalog2/catalog2.component';
import { Catalog3Component } from './components/catalog3/catalog3.component';
import { Catalog4Component } from './components/catalog4/catalog4.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'catalog1', component: Catalog1Component },
    { path: 'catalog2', component: Catalog2Component },
    { path: 'catalog3', component: Catalog3Component },
    { path: 'catalog4', component: Catalog4Component }
];
