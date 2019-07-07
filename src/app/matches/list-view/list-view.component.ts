import { Component, OnInit } from '@angular/core';
import {MatchModel} from '../../z-models/match.model';
import {MatchesService} from '../../z-services/matches.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserModel} from "../../z-models/user.model";
import {LoginService} from "../../z-services/login.service";

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {

  allMatches: MatchModel[];
  currentUserSubscription: Subscription;
  matchSubscription: Subscription;
  user: UserModel;
  loggedIn: boolean;
  matchClass: string;

  constructor(private matchesService: MatchesService,
              private loginService: LoginService,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.currentUserSubscription = this.loginService.currentUser
      .subscribe(
          (res) => {
              this.user = res;
              this.loggedIn = (this.user != null);

              if (!this.loggedIn) {
                  this.router.navigate(['/home']);
              }

              // console.log('Current User -->' + JSON.stringify(this.user));
          },
          (error) => console.log(error)
      );

    this.matchSubscription = this.matchesService.getMatches('aripakavinodh@gmail.com')
        .subscribe((response) => {
              if (response.statusCode === 'N') {
              } else {
                this.allMatches = response.result as MatchModel[];
                if (this.user.groupId == 2) {
                    this.allMatches = this.allMatches.filter(tournament => tournament.tournamentId === 6);
                } else {
                    this.allMatches = this.allMatches.filter(tournament => tournament.tournamentId === 4);
                }
              }
            },
            (error) => console.log(error)
        );
  }

  onMatchClick(matchId: number) {
    this.router.navigate([matchId + '/predictions'], {relativeTo: this.route});
  }

  getMatchClass(match: MatchModel) {
      if (match.matchStatus === 'RESULT' || match.matchStatus === 'ARCHIVED' ) {
          return 'open-close-list-past';
      } else if (match.matchStatus === 'PROGRESS' ) {
          return 'open-close-list-current';
      } else if (match.matchStatus === 'SCHEDULED' ) {
          return 'open-close-list-future';
      }
  }

}
