import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { UserPageComponent } from './user-page/user-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { CartComponent } from './cart/cart.component';
import { FoodService } from './services/food/food.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { roleGuard } from './guards/role.guard';
import { authGuard } from './auth.guard';
import { PaymentComponent } from './payment/payment.component';

export const routes: Routes = [
  { path: 'user/home', component: UserPageComponent, canActivate: [authGuard, roleGuard], data: { role: 'CUSTOMER' } },
  { path: 'admin/home', component: AdminPageComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' } },
  { path: 'user/cart', component: CartComponent, canActivate: [authGuard, roleGuard], data: { role: 'CUSTOMER' } },
  { path: 'user/payment', component: PaymentComponent, canActivate: [authGuard, roleGuard], data: { role: 'CUSTOMER' } },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
  ];
