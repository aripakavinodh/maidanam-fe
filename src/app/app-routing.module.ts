import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PredictionsComponent} from './predictions/predictions.component';
import {HomeComponent} from './home/home.component';
import {ScoreboardComponent} from './scoreboard/scoreboard.component';
import {LoginComponent} from './login/login.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {RegisterComponent} from './register/register.component';
import {ManageGroupsComponent} from './manage-groups/manage-groups.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'predictions', component: PredictionsComponent },
  { path: 'scoreboard', component: ScoreboardComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'error', component: ErrorPageComponent},
  { path: 'groups', component: ManageGroupsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }