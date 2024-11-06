import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InventarioLocalidade } from '../../model/localidade';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-card-localidades-info',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './card-localidades-info.component.html',
  styleUrl: './card-localidades-info.component.scss'
})
export class CardLocalidadesInfoComponent {
  @Input() quantidade!: number;
  @Input() title?: string;
  @Input() color?: string;
  @Output() newItemEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log('CardLocalidadesInfoComponent');
  }

  onClick() {
    this.newItemEvent.emit();
  }

}
