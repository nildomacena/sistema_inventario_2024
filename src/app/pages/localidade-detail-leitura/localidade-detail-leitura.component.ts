import { ApplicationRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { Bem } from '../../model/bem';
import { InventarioLocalidade } from '../../model/localidade';
import { BensService } from '../../services/bens.service';
import { LocalidadeService } from '../../services/localidade.service';
import { ActivatedRoute } from '@angular/router';
import { formatarStatus } from '../../shared/utils';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-localidade-detail-leitura',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './localidade-detail-leitura.component.html',
  styleUrl: './localidade-detail-leitura.component.scss'
})
export class LocalidadeDetailLeituraComponent implements OnInit {
  localidade: InventarioLocalidade | null = null;
  id: string | null = null;
  bens: Bem[] = [];
  selectedCardsPerRow: number = 4;
  cardsPerRowOptions = [
    { label: '2 por Linha', value: 6 },
    { label: '3 por Linha', value: 4 },
    { label: '4 por Linha', value: 3 },
    { label: '6 por Linha', value: 2 },
    { label: '12 por Linha', value: 1 },
  ];

  zone = inject(NgZone);
  applicationRef = inject(ApplicationRef);
  localidadeService = inject(LocalidadeService);
  bensService = inject(BensService);
  route = inject(ActivatedRoute);

  constructor() { }

  ngOnInit(): void {
    this.applicationRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.getLocalidade();
    });
  }

  async getLocalidade() {
    if (this.id) {
      this.zone.run(async () => {
        this.localidade = await this.localidadeService.getLocalidade(this.id!);
        this.bens = await this.bensService.getBensPorLocalidadeInventario(parseInt(this.id!));
        console.log(this.localidade);
      });
    }
  }

  formatarStatus(status: string) {
    formatarStatus(status);
  }

  voltar() {
    window.history.back();
  }

  imprimir() {
    window.print();
  }
}
