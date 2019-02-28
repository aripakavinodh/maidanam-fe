import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {SocialLoginModule, AuthServiceConfig, LoginOpt, GoogleLoginProvider} from 'angularx-social-login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { DropdownDirective } from './shared/dropdown.directive';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RegisterComponent } from './register/register.component';
import { ManageGroupsComponent } from './manage-groups/manage-groups.component';
import {LoginService} from './services/login.service';
import { MatchesComponent } from './matches/matches.component';
import { CurrentViewComponent } from './matches/current-view/current-view.component';
import { ListViewComponent } from './matches/list-view/list-view.component';
import { PlayerHistoryComponent } from './player-history/player-history.component';

const googleLoginOptions: LoginOpt = {
  scope: 'profile email',
};

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('515718912201-5iisnrp83m8d31t1l80c898h3g5v22n4.apps.googleusercontent.com', googleLoginOptions)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PredictionsComponent,
    ScoreboardComponent,
    HomeComponent,
    DropdownDirective,
    ErrorPageComponent,
    RegisterComponent,
    ManageGroupsComponent,
    MatchesComponent,
    CurrentViewComponent,
    ListViewComponent,
    PlayerHistoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    SocialLoginModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
