import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { UserPageComponent } from './user-page/user-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

export const routes: Routes = [
  { path: 'user', component: UserPageComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: '', redirectTo: '/user', pathMatch: 'full' }, // Default redirect
  { path: '**', redirectTo: '/user' }
];
