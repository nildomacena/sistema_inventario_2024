import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private supabaseService: SupabaseService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    const isLoggedIn = this.supabaseService.isLoggedIn;
    console.log('LoginGuard', isLoggedIn);
    if (isLoggedIn) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  };
}