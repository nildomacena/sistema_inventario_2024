import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-logged-area',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    RouterOutlet,
  ],
  templateUrl: './logged-area.component.html',
  styleUrl: './logged-area.component.scss'
})
export class LoggedAreaComponent {

}
