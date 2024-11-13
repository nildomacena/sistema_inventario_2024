import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    },

    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'localidades',
        loadComponent: () => import('./pages/localidades/localidades.component').then(m => m.LocalidadesComponent),
    },
    {
        path: 'localidades/:id',
        loadComponent: () => import('./pages/localidade-detail/localidade-detail.component').then(m => m.LocalidadeDetailComponent),
    },
    {
        path: 'localidade-print/:id',
        loadComponent: () => import('./pages/localidade-detail-leitura/localidade-detail-leitura.component').then(m => m.LocalidadeDetailLeituraComponent),
    },
    {
        path: 'bens',
        loadComponent: () => import('./pages/bens/bens.component').then(m => m.BensComponent),
    },
];
