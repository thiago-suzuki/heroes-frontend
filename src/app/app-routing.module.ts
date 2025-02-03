import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'list-knights', pathMatch: 'full' },
  { path: 'list-knights', loadChildren: () => import('./pages/list-knights/list-knights.module').then( m => m.ListKnightsModule)},
  { path: '**', redirectTo: 'list-knights'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
