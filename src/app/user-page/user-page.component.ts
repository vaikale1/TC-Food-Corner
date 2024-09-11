import { Component } from '@angular/core';
import { UserpageHeaderComponent } from '../userpage-header/userpage-header.component';
import { UserpageHomeComponent } from '../userpage-home/userpage-home.component';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [UserpageHeaderComponent,UserpageHomeComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {

}
