import { Component, Input } from '@angular/core';
import { Bem } from '../../model/bem';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-bem',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './card-bem.component.html',
  styleUrl: './card-bem.component.scss'
})
export class CardBemComponent {
  @Input() bem!: Bem;

  
}
