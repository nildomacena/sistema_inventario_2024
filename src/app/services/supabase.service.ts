import { ApplicationRef, Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { BehaviorSubject, first } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase!: SupabaseClient
  _session: AuthSession | null = null
  isLoggedIn = false
  onAuthStateChange: BehaviorSubject<Session | null> = new BehaviorSubject<Session | null>(null);
  userLogged?: User;
  userData?: Usuario;

  constructor(
    private applicationRef: ApplicationRef,) {
    this.applicationRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
      this.supabase.auth.getSession().then((value) => {
        const data = value.data;
        this._session = value.data.session;
        this.isLoggedIn = data !== null
        this.onAuthStateChange.next(data?.session);
        this.userLogged = data?.session?.user;
      })

      this.supabase.auth.onAuthStateChange((event, session) => {
        this._session = session
        this.isLoggedIn = session !== null
        this.onAuthStateChange.next(session);
        this.userLogged = session?.user
        if (this.userLogged) {
          this.fetchUserData(this.userLogged.id);
        }
      });
    });
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signInWithEmailAndPassowrd(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  private fetchUserData(userId: string) {
    this.supabase
      .from('usuarios')
      .select('*')
      .eq('uid', userId)
      .single()
      .then(({ data, error }) => {
        if (data) {
          this.userData = data as unknown as Usuario;
          console.log('User data:', this.userData);
        } else {
          console.error('Error fetching user data:', error);
        }
      });
  }

  async isAdmin(userId: string): Promise<boolean> {
    return this.userData?.admin || false;
  }

}
