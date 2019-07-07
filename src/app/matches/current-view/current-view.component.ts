import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatchesService } from '../../z-services/matches.service';
import { MatchModel } from '../../z-models/match.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {LoginService} from '../../z-services/login.service';
import {UserModel} from '../../z-models/user.model';
import {GroupModel} from '../../z-models/group.model';

@Component({
  selector: 'app-current-view',
  templateUrl: './current-view.component.html',
  styleUrls: ['./current-view.component.css']
})
export class CurrentViewComponent implements OnInit, OnDestroy {

  constructor(private matchesService: MatchesService,
              private loginService: LoginService,
              private router: Router, private route: ActivatedRoute) { }

  currentMatches: MatchModel[];
  allMatches: MatchModel[];
  currentUserSubscription: Subscription;
  currentUserGroupsSubscription: Subscription;
  matchSubscription: Subscription;
  user: UserModel;
  groups: GroupModel[];
  loggedIn: boolean;

  ngOnInit() {
    this.currentUserSubscription = this.loginService.currentUser
        .subscribe(
            (res) => {
              this.user = res;
              this.loggedIn = (this.user != null);

                if (!this.loggedIn) {
                    this.router.navigate(['/home']);
                }
            },
            (error) => console.log(error)
        );

      this.currentUserGroupsSubscription = this.loginService.currentUserGroups
          .subscribe(
              (res) => {
                  this.groups = res;
              },
              (error) => console.log(error)
          );

    this.matchSubscription = this.matchesService.getMatches('aripakavinodh@gmail.com')
        .subscribe((response) => {
              if (response.statusCode === 'N') {
              } else {
                this.allMatches = response.result as MatchModel[];
                if (this.user.groupId == 2) {
                    this.allMatches = this.allMatches.filter( tournament => tournament.tournamentId === 6 );
                } else {
                    this.allMatches = this.allMatches.filter( tournament => tournament.tournamentId === 4 );
                }

                if (this.allMatches !== null) {
                  this.currentMatches = this.allMatches.filter(match => match.matchStatus === 'SCHEDULED'
                      || match.matchStatus === 'PROGRESS').slice(0, 2);
                }

              }
            },
            (error) => console.log(error)
        );

  }

  onMatchClick(matchId: number) {
    this.router.navigate([matchId + '/predictions'], {relativeTo: this.route});
    // this.router.navigate(['/predictions']);
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

  ngOnDestroy() {
      this.currentUserSubscription.unsubscribe();
      this.currentUserGroupsSubscription.unsubscribe();
      this.matchSubscription.unsubscribe();
  }
}
