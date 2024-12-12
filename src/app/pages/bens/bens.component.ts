import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, inject, NgZone } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { LocalidadeService } from '../../services/localidade.service';
import { InventarioLocalidade, LocalidadeListItem } from '../../model/localidade';
import { first } from 'rxjs';
import { Bem } from '../../model/bem';
import { BensService } from '../../services/bens.service';
import { TableModule } from 'primeng/table';
import { CardBemComponent } from '../../components/card-bem/card-bem.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-bens',
  standalone: true,
  imports: [
    CommonModule,
    PanelModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    CardBemComponent,
    ProgressSpinnerModule,
    ToastModule,
  ],
  providers: [MessageService,],
  templateUrl: './bens.component.html',
  styleUrl: './bens.component.scss'
})
export class BensComponent {

  fb = inject(FormBuilder);
  localidadeService = inject(LocalidadeService);
  localidades: InventarioLocalidade[] = [];
  bensService = inject(BensService);
  bens: Bem[] = [];
  applicationRef = inject(ApplicationRef);
  router = inject(Router);
  zone = inject(NgZone);
  loading = false;

  formFiltro = this.fb.group({
    patrimonio: null,
    descricao: null,
    localidade: null,
  });

  displayMode: 'table' | 'card' = 'table';
  cardsPerRowOptions = [
    { label: '2 por Linha', value: 6 },
    { label: '3 por Linha', value: 4 },
    { label: '4 por Linha', value: 3 },
    { label: '6 por Linha', value: 2 },
    { label: '12 por Linha', value: 1 },
  ];
  selectedCardsPerRow: number = 4;


  constructor(private messageService: MessageService) {
    this.applicationRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => {
      this.obterLocalidades();
    });
  }

  async obterLocalidades() {
    this.localidades = await this.localidadeService.getLocalidades();
  }

  limparCampo(campo: string) {
    this.formFiltro.get(campo)?.setValue(null);
  }

  limparFiltros() {
    this.formFiltro.reset();
  }

  async obterBens() {
    try {
      this.loading = true;
      const filtros = this.formFiltro.value;
      this.bens = await this.bensService.filtrarBens(filtros);
      if (this.bens.length === 0) {
        this.showNoResultsToast();
      }
    } catch (error) {
      console.error('Erro ao obter bens: ', error);
    } finally {
      this.loading = false;
    }
  }

  showNoResultsToast() {
    this.messageService.add({ severity: 'error', summary: 'Nenhum bem encontrado', detail: 'Nenhum bem corresponde aos filtros aplicados.' });
  }

  toggleDisplayMode(mode: 'table' | 'card'): void {
    this.zone.run(() => {
      this.displayMode = mode;
    });
  }


  acessarBem(bem: Bem) {
    console.log('Acessar bem: ', bem);
    this.router.navigate(['/localidades', bem.inventario_id]);
  }
}
