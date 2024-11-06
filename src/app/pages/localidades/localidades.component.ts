import { ApplicationRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { LocalidadeService } from '../../services/localidade.service';
import { first } from 'rxjs';
import { TableModule } from 'primeng/table';
import { InventarioLocalidade, LocalidadeListItem } from '../../model/localidade';
import { ButtonModule } from 'primeng/button';
import { BensService } from '../../services/bens.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-localidades',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
  ],
  templateUrl: './localidades.component.html',
  styleUrl: './localidades.component.scss'
})
export class LocalidadesComponent implements OnInit {
  localidades: InventarioLocalidade[] = [];
  carregando = true;
  zone = inject(NgZone);
  router = inject(Router);

  localidadeService = inject(LocalidadeService);
  bensService = inject(BensService);
  private applicationRef = inject(ApplicationRef);

  constructor() {
    this.applicationRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => {
      this.getLocalidades();
    });
  }

  ngOnInit(): void {

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
        this.localidades = await this.localidadeService.getLocalidades();
        this.carregando = false;
      });
    } catch (error) {
      console.error(error);
    }
    // this.localidadeService.getLocalidades().then((localidades) => {
    //     this.localidades = localidades;
    //     this.carregando = false;
    //     console.log(localidades);
    //   });
  }

  acessarLocalidade(localidade: InventarioLocalidade) {
    this.router.navigate([`/localidades/${localidade.inventario_localidade_id}`]);
  }

  async gerarPdf(localidade: InventarioLocalidade) {
    try {
      console.log(localidade);
      const bens = await this.bensService.getBensPorLocalidadeInventario(localidade.inventario_localidade_id);
      this.localidadeService.generatePdf(localidade, bens);
    } catch (error) {
      console.error(error);
    }
  }

}
