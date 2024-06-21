import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';
import { ProductDetailAluminioComponent } from './components/product-detail-aluminio/product-detail-aluminio.component';
import { ProductDetailCroqueraComponent } from './components/product-detail-croquera/product-detail-croquera.component';
import { ProductDetailLibretaComponent } from './components/product-detail-libreta/product-detail-libreta.component';
import { ProductDetailPoleraComponent } from './components/product-detail-polera/product-detail-polera.component';
import { ProductDetailTablaComponent } from './components/product-detail-tabla/product-detail-tabla.component';
import { ProductDetailCuadernoComponent } from './components/product-detail-cuaderno/product-detail-cuaderno.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
//administracion
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminLogoutComponent } from './components/admin-logout/admin-logout.component';
import { AdminClientManagementComponent } from './components/admin-client-management/admin-client-management.component';
import { AdminOrderMonitoringComponent } from './components/admin-order-monitoring/admin-order-monitoring.component';
import { AdminProfileManagementComponent } from './components/admin-profile-management/admin-profile-management.component';
import { AdminUserManagementComponent } from './components/admin-user-management/admin-user-management.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'cart', component: CartComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'password-recovery', component: PasswordRecoveryComponent },
    { path: 'product-catalog', component: ProductCatalogComponent },
    { path: 'product-detail-aluminio', component: ProductDetailAluminioComponent },
    { path: 'product-detail-croquera', component: ProductDetailCroqueraComponent },
    { path: 'product-detail-libreta', component: ProductDetailLibretaComponent },
    { path: 'product-detail-polera', component: ProductDetailPoleraComponent },
    { path: 'product-detail-tabla', component: ProductDetailTablaComponent },
    { path: 'product-detail-cuaderno', component: ProductDetailCuadernoComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'register', component: RegisterComponent },
    //administracion
    { path: 'admin-login', component: AdminLoginComponent },
    { path: 'admin-logout', component: AdminLogoutComponent },
    { path: 'admin-client-management', component: AdminClientManagementComponent },
    { path: 'admin-order-monitoring', component: AdminOrderMonitoringComponent },
    { path: 'admin-profile-management', component: AdminProfileManagementComponent },
    { path: 'admin-user-management', component: AdminUserManagementComponent }
];
