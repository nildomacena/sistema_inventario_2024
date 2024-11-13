import { Component, inject, NgZone, } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
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
  router = inject(Router);
  routerOutlet = inject(ActivatedRoute);
  constructor() {
    this.supabaseService.onAuthStateChange.subscribe((session) => {
      this.zone.run(() => {
        this.usuarioLogado = !!session;
        if (this.usuarioLogado) {
          if (this.router.url === '/login') {
            this.router.navigate(['/home']);
          }
        }
      });
    });
  }
}
