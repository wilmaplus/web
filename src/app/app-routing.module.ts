import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginScreenComponent} from "./login/login_screen";
import {ServerSelectComponent} from "./login/server_select/server_select";

const routes: Routes = [
  {path: 'login', component: LoginScreenComponent},
  {path: 'login/select_server', component: ServerSelectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
