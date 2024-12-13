import { ApplicationRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InventarioLocalidade } from '../../model/localidade';
import { LocalidadeService } from '../../services/localidade.service';
import { first } from 'rxjs';
import { formatarStatus } from '../../shared/utils';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Bem } from '../../model/bem';
import { BensService } from '../../services/bens.service';
import { TableModule } from 'primeng/table';
import { CardBemComponent } from '../../components/card-bem/card-bem.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { SupabaseService } from '../../services/supabase.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
  selector: 'app-localidade-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CardBemComponent,
    DropdownModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './localidade-detail.component.html',
  styleUrl: './localidade-detail.component.scss'
})
export class LocalidadeDetailComponent implements OnInit {
  id: string | null = null;
  localidade: InventarioLocalidade | null = null;
  modoVisualizacaoBens = 'cards';
  modoLeitura: boolean = false;

  router = inject(Router);
  route = inject(ActivatedRoute);
  zone = inject(NgZone);
  applicationRef = inject(ApplicationRef);
  localidadeService = inject(LocalidadeService);
  bensService = inject(BensService);
  supabaseService = inject(SupabaseService);
  confirmationService = inject(ConfirmationService);
  isAdmin: boolean = false;
  bens: Bem[] = [];
  // Propriedades para controle de exibição
  displayMode: 'table' | 'card' | 'leitura' = 'table';
  cardsPerRowOptions = [
    { label: '2 por Linha', value: 6 },
    { label: '3 por Linha', value: 4 },
    { label: '4 por Linha', value: 3 },
    { label: '6 por Linha', value: 2 },
    { label: '12 por Linha', value: 1 },
  ];
  selectedCardsPerRow: number = 4;

  constructor() { }

  async ngOnInit() {
    this.applicationRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.getLocalidade();
      setTimeout(() => {
        const userId = this.supabaseService.userLogged?.id;
        if (userId) {
          this.supabaseService.isAdmin(userId).then((isAdmin) => {
            this.zone.run(() => {
              this.isAdmin = isAdmin;
              console.log('isAdmin:', isAdmin);
            });
          });
        }
      }, 1000);
    });
  }

  formatarStatus(status: string) {
    formatarStatus(status);
  }

  toggleVisualizacaoBens() {
    this.modoVisualizacaoBens = this.modoVisualizacaoBens === 'table' ? 'card' : 'table';
  }

  toggleDisplayMode(mode: 'table' | 'card' | 'leitura'): void {
    this.zone.run(() => {
      this.displayMode = mode;
    });
  }

  onCardsPerRowChange(event: any): void {
    this.selectedCardsPerRow = event.value;
  }

  async getLocalidade() {
    if (this.id) {
      this.zone.run(async () => {
        this.localidade = await this.localidadeService.getLocalidade(this.id!);
        this.bens = await this.bensService.getBensPorLocalidadeInventario(parseInt(this.id!));
      });
    }
  }

  async voltar() {
    this.router.navigate(['/localidades']);
  }

  acessarBem(bem: Bem) {
    console.log(bem);
  }

  toggleLeitura() {
    this.router.navigate(['/localidade-print', this.id]);
    // this.modoLeitura = !this.modoLeitura;
  }

  imprimir() {
    console.log('Imprimir');
    this.router.navigate(['/localidade-print', this.id]);
    // window.print();
  }

  async reabrirLocalidade(localidade: InventarioLocalidade) {
    console.log('Reabrir localidade:', localidade);
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja reabrir esta localidade?',
      accept: async () => {
        try {
          await this.localidadeService.reopenLocalidade(localidade.inventario_localidade_id);
          this.getLocalidade();
        } catch (error) {
          console.error('Erro ao reabrir localidade:', error);
        }
      }
    });
  }
}
