import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { ListKnightsComponent } from './list-knights.component';
import { ListKnightsRoutingModule } from './list-knights-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailsKnightComponent } from 'src/app/components/details-knight/details-knight.component';

@NgModule({
  declarations: [ListKnightsComponent, DetailsKnightComponent],
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule,
    ListKnightsRoutingModule, 
    ReactiveFormsModule
  ]
})
export class ListKnightsModule {}
