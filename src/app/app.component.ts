import { Component, inject, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sistema_inventario_2024';
  usuarioLogado: boolean = false;

  supabaseService = inject(SupabaseService);
  zone = inject(NgZone);

  constructor() {
    this.supabaseService.onAuthStateChange.subscribe((session) => {
      this.zone.run(() => {
        this.usuarioLogado = session !== null;
      });
    });
  }

}
