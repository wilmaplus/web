import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginScreenComponent} from "./login/login_screen";
import {ServerSelectComponent} from "./login/server_select/server_select";
import {LoginWilmaComponent} from "./login/basic/basic_login";
import {WilmaClient} from "./main/client";
import {Homepage} from "./main/pages/homepage/homepage";
import {MessageViewer} from "./messages/viewer/message-viewer";

const routes: Routes = [
  {path: 'login', component: LoginScreenComponent},
  {path: 'login/select_server', component: ServerSelectComponent},
  {path: 'login/wilma', component: LoginWilmaComponent},
  {path: 'messages/:id', component: MessageViewer},
  {path: '', component: WilmaClient, loadChildren: () => import(`./src/app/main/main.module`).then(m => m.MainModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
