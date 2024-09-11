import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [HeaderComponent,HomeComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {

}
