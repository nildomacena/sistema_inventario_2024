import { ApplicationRef, inject, Injectable } from '@angular/core';
import { SupabaseClient, AuthSession, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { first } from 'rxjs';
import { InventarioLocalidade, LocalidadeListItem } from '../model/localidade';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Bem } from '../model/bem';

@Injectable({
  providedIn: 'root'
})
export class LocalidadeService {
  private supabase!: SupabaseClient;
  private applicationRef = inject(ApplicationRef);
  constructor() {
    this.applicationRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    });
  }

  async getLocalidade(id: string): Promise<InventarioLocalidade> {
    const result = await this.supabase.from('view_inventario_localidade').select('*').eq('inventario_localidade_id', id).single();
    if (result.error || !result.data) {
      throw result.error;
    }
    return result.data as unknown as InventarioLocalidade;
  }

  async getLocalidades(): Promise<InventarioLocalidade[]> {
    if (!this.supabase) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
    const { data, error } = await this.supabase
      .from('view_inventario_localidade')
      .select('*');

    if (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }

    return data as unknown as InventarioLocalidade[];
  }

  async criarLocalidade(
    nome: string,
  ) {

    const result = await this.supabase.from('localidades').insert(
      { nome }
    ).select().single();

    console.log(result);
    if (result.error || !result.data) {
      throw result.error;
    }
    const data = result.data as any;
    if (result.error || !result?.data) {
      throw 'Erro ao criar localidade';
    }

    await this.supabase.from('inventario_localidade').insert([
      {
        localidade_id: data.id,
        ano: '2024',
        finalizada_em: null,
      }
    ]);

  }

  async generatePdf(localidade: InventarioLocalidade, bens: Bem[]) {
    const doc = new jsPDF();

    // Cabeçalho do PDF
    doc.setFontSize(16);
    doc.text('Relatório da Localidade', 10, 10);

    // Informações da localidade
    doc.setFontSize(12);
    doc.text(`Nome da Localidade: ${localidade.localidade_nome}`, 10, 20);
    doc.text(`Quantidade de Bens Cadastrados: ${localidade.numero_bens}`, 10, 30);
    doc.text(`Status: ${localidade.status_inventario}`, 10, 40);

    const tableData = bens.map(bem => [
      bem.patrimonio,
      bem.descricao,
      bem.estado,
      bem.indica_desfazimento ? 'Sim' : 'Não',
      bem.observacoes || '',
      bem.usuario_cadastrante
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Patrimônio', 'Descrição', 'Estado', 'Indica Desfazimento', 'Observações', 'Usuário Cadastrante']],
      body: tableData,
      styles: { fontSize: 10 },
    });

    // Salva o PDF
    doc.save(`relatorio_localidade_${localidade.localidade_nome}.pdf`);
  }
  loadImage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img.src);
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  }
}
