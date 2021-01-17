import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {Homepage} from "../../../main/pages/homepage/homepage";
import {Settings} from "../../../main/pages/settings/settings";

const routes: Routes = [
  {path: 'home', component: Homepage},
  {path: 'settings', component: Settings}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
