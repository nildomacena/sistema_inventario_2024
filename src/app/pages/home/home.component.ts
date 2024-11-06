import { ApplicationRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalidadeService } from '../../services/localidade.service';
import { InventarioLocalidade } from '../../model/localidade';
import { CardModule } from 'primeng/card';
import { first } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardLocalidadesInfoComponent } from '../../components/card-localidades-info/card-localidades-info.component';
import { BensService } from '../../services/bens.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ButtonModule,
    CardLocalidadesInfoComponent,

  ],
  providers: [
    FormBuilder,
    LocalidadeService
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  localidades: InventarioLocalidade[] = [];
  localidadesFinalizadas: InventarioLocalidade[] = [];
  localidadesNaoIniciadas: InventarioLocalidade[] = [];
  localidadesEmAndamento: InventarioLocalidade[] = [];
  totalBensCadastrados: number | null = null;

  formLocalidade: FormGroup;
  fb = inject(FormBuilder);
  applicationRef = inject(ApplicationRef);
  localidadeService = inject(LocalidadeService);
  bensService = inject(BensService);
  zone = inject(NgZone);

  constructor() {
    this.formLocalidade = this.fb.group({
      nome: ['']
    });
    console.log('HomeComponent');
  }

  ngOnInit() {
    this.applicationRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => {
      this.buscarLocalidades();
    });
  }

  async criarLocalidade() {
    const { nome } = this.formLocalidade.value;
    try {
      await this.localidadeService.criarLocalidade(nome);
      this.formLocalidade.reset();
    } catch (error) {
      console.error(error);
    }
  }

  async buscarLocalidades() {
    try {
      this.localidades = await this.localidadeService.getLocalidades();
      this.totalBensCadastrados = await this.bensService.getQuantidadeBensCadastrados();
      this.zone.run(async () => {
        this.localidadesFinalizadas = this.localidades.filter(localidade => localidade.status_inventario === 'finalizada');
        this.localidadesNaoIniciadas = this.localidades.filter(localidade => localidade.status_inventario === 'nao_iniciada');
        this.localidadesEmAndamento = this.localidades.filter(localidade => localidade.status_inventario === 'em_andamento');
      });
    } catch (error) {
      console.error(error);
    }
  }
}
