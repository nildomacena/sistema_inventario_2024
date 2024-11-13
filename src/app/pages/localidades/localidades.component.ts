import { ApplicationRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { LocalidadeService } from '../../services/localidade.service';
import { first } from 'rxjs';
import { TableModule } from 'primeng/table';
import { InventarioLocalidade, LocalidadeListItem } from '../../model/localidade';
import { ButtonModule } from 'primeng/button';
import { BensService } from '../../services/bens.service';
import { Router } from '@angular/router';
import { CardBemComponent } from '../../components/card-bem/card-bem.component';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-localidades',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    PanelModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './localidades.component.html',
  styleUrl: './localidades.component.scss'
})
export class LocalidadesComponent implements OnInit {
  localidades: InventarioLocalidade[] = [];
  localidadesFiltradas: InventarioLocalidade[] = [];

  carregando = true;

  zone = inject(NgZone);
  router = inject(Router);

  formFiltro: FormGroup;

  localidadeService = inject(LocalidadeService);
  bensService = inject(BensService);
  applicationRef = inject(ApplicationRef);
  formBuilder = inject(FormBuilder);

  situacoes = [
    { label: 'Todas', value: null },
    { label: 'Não Iniciada', value: 'nao_iniciada' },
    { label: 'Em Andamento', value: 'em_andamento' },
    { label: 'Finalizada', value: 'finalizada' }
  ];

  constructor() {

    this.applicationRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => {
      this.getLocalidades();
    });

    this.formFiltro = this.formBuilder.group({
      situacao: [''],
      nome: [''],
    });

    //detectar mudanças no formulário de filtro e filtrar
    this.formFiltro.valueChanges.subscribe(() => {
      console.log('Filtrando...');
      this.filtrar();
    });

  }

  ngOnInit(): void {

  }

  limparCampo(filtro: string) {
    this.formFiltro.get(filtro)?.setValue('');
  }

  limparFiltros() {
    this.formFiltro.reset();
  }

  formatarStatus(status: string) {
    switch (status) {
      case 'finalizada':
        return 'Finalizado';
      case 'em_andamento':
        return 'Em andamento';
      case 'nao_iniciada':
        return 'Não iniciado';
      default:
        return status;
    }
  }

  async getLocalidades() {
    try {
      this.zone.run(async () => {
        this.localidadesFiltradas = this.localidades = await this.localidadeService.getLocalidades();
        //ordenar pelo nome
        this.localidades.sort((a, b) => {
          return a.localidade_nome.localeCompare(b.localidade_nome);
        });
        this.carregando = false;
      });
    } catch (error) {
      console.error(error);
    }
  }

  acessarLocalidade(localidade: InventarioLocalidade) {
    this.router.navigate([`/localidades/${localidade.inventario_localidade_id}`]);
  }

  async gerarPdf(localidade: InventarioLocalidade) {
    try {
      const bens = await this.bensService.getBensPorLocalidadeInventario(localidade.inventario_localidade_id);
      this.localidadeService.generatePdf(localidade, bens);
    } catch (error) {
      console.error(error);
    }
  }

  filtrar() {
    const situacao = this.formFiltro.get('situacao')?.value;
    const nome = this.formFiltro.get('nome')?.value;
    this.localidadesFiltradas = this.localidades.filter(localidade => {
      if (situacao?.value && situacao.value !== localidade.status_inventario) {
        return false;
      }
      if (nome && !localidade.localidade_nome.toLowerCase().includes(nome.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

}
