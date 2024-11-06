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
@Component({
  selector: 'app-localidade-detail',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
  ],
  templateUrl: './localidade-detail.component.html',
  styleUrl: './localidade-detail.component.scss'
})
export class LocalidadeDetailComponent implements OnInit {
  id: string | null = null;
  localidade: InventarioLocalidade | null = null;

  router = inject(Router);
  route = inject(ActivatedRoute);
  zone = inject(NgZone);
  applicationRef = inject(ApplicationRef);
  localidadeService = inject(LocalidadeService);
  bensService = inject(BensService);
  bens: Bem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.applicationRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.getLocalidade();
    });
  }

  formatarStatus(status: string) {
    formatarStatus(status);
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

  async voltar() {
    this.router.navigate(['/localidades']);
  }

  acessarBem(bem: Bem) {
    console.log(bem);
  }
}
