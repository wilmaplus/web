import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginScreenComponent} from "./login/login_screen";
import {ServerSelectComponent} from "./login/server_select/server_select";
import {LoginWilmaComponent} from "./login/basic/basic_login";

const routes: Routes = [
  {path: 'login', component: LoginScreenComponent},
  {path: 'login/select_server', component: ServerSelectComponent},
  {path: 'login/wilma', component: LoginWilmaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
