import { ApplicationRef, inject, Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { first } from 'rxjs';
import { Bem } from '../model/bem';

@Injectable({
  providedIn: 'root'
})
export class BensService {

  private supabase!: SupabaseClient;
  private applicationRef = inject(ApplicationRef);
  constructor() {
    this.applicationRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    });
  }

  async getBensPorLocalidadeInventario(localidadeInventarioId: number): Promise<Bem[]> {
    const result = await this.supabase.from('vw_detalhes_bem_inventario')
      .select('*')
      .eq('inventario_id', localidadeInventarioId);
    console.log('result: ', result);
    return result.data as unknown as Bem[];
  }

  async getQuantidadeBensCadastrados(): Promise<number | null> {
    const result = await this.supabase.from('bens').select('id').eq('ano_inventario', '2024');
    return result.data?.length || null;
  }

}