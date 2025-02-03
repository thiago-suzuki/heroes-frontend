import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListKnightsComponent } from './list-knights.component';

const routes: Routes = [
  {
    path: '',
    component: ListKnightsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ListKnightsRoutingModule {}
