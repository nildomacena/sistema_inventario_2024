import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    MenubarModule,
  ],
  providers: [SupabaseService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  usuarioLogado?: User;

  supabaseService = inject(SupabaseService);
  router = inject(Router);
  
  constructor() {
    this.supabaseService.onAuthStateChange.subscribe((authState) => {
      this.usuarioLogado = authState?.user;
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
}
