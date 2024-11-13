import { ApplicationRef, inject, Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { first } from 'rxjs';
import { Bem } from '../model/bem';
import { InventarioLocalidade } from '../model/localidade';

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
    return result.data as unknown as Bem[];
  }

  async getQuantidadeBensCadastrados(): Promise<number | null> {
    const result = await this.supabase.from('bens').select('id').eq('ano_inventario', '2024');
    return result.data?.length || null;
  }

  async filtrarBens(filtros: {
    localidade?: InventarioLocalidade | null,
    descricao?: string | null,
    patrimonio?: string | null,
  }): Promise<Bem[]> {
    let query = this.supabase
      .from('vw_detalhes_bem_inventario')
      .select('*');

    // Add inventario_id filter if localidade is provided
    if (filtros.localidade?.inventario_localidade_id) {
      query = query.eq('inventario_id', filtros.localidade.inventario_localidade_id);
    }

    // Add descricao filter if provided
    if (filtros.descricao) {
      query = query.ilike('descricao', `%${filtros.descricao}%`);
    }

    // Add patrimonio filter if provided
    if (filtros.patrimonio) {
      query = query.ilike('patrimonio', `%${filtros.patrimonio}%`);
    }

    const result = await query;
    return result.data as unknown as Bem[];
  }
}
