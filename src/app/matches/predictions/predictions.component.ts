import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MatchModel} from '../../z-models/match.model';
import {MatchesService} from '../../z-services/matches.service';
import {Subscription} from 'rxjs';
import {UserModel} from '../../z-models/user.model';
import {LoginService} from '../../z-services/login.service';
import {GroupModel} from '../../z-models/group.model';
import {PredictionsService} from '../../z-services/predictions.service';
import {PredictionModel} from '../../z-models/prediction.model';
import {NgForm} from '@angular/forms';
import {group} from '@angular/animations';
import {PredTableInterface} from '../../z-models/pred-table.interface';
import {OddsModel} from '../../z-models/odds.model';
import { Location } from '@angular/common';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.css']
})
export class PredictionsComponent implements OnInit, OnDestroy {

  slideValue = 0;
  selectedWinnerId: number;
  selectedMargin: string;

  matchId: number;
  predictions: PredictionModel[];
  currentUserPrediction: PredictionModel;
  userPredictionToSubmit: PredictionModel;
  getPredictionSubscription: Subscription;
  submitPredictionSubscription: Subscription;
  currentUserSubscription: Subscription;
  currentUserGroupsSubscription: Subscription;
  user: UserModel;
  groups: GroupModel[];
  loggedIn: boolean;
  showOthersPredictions = false;
  targetSubscription: Subscription;
  userGroupSubscription: Subscription;
  targetList: UserModel[];
  usersList: UserModel[];
  selectedUserGroup: UserModel;
  isTeam1WinnerPredicted = false;
  isTeam2WinnerPredicted = false;
  team1odds: OddsModel;
  team2odds: OddsModel;
  selectWinnerFlag = false;
  selectMarginFlag = false;
  selectFasakFlag = false;
  submitFail = false;
  submitPass = false;
  errorMessage: string;
  maxCoins: number;
  username: string;
  keyPressed = false;
  stepSize = 1000;
  // sizes: number[] = [100, 1000, 100000];

  @ViewChild('p') predictionForm: NgForm;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['player', 'coins', 'coinspercent', 'prediction', 'challenged', 'challenged1'];
  predictionList: PredTableInterface[] = [];
  dataSource: MatTableDataSource<PredTableInterface>;

  changeSlide(slideEvent: any) {
    this.slideValue = slideEvent.value;
    // console.log(slideEvent);
  }

  formatNumber(num: number) {
      return Math.round(num);
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

  selectWinner(winnerid: any) {
      this.selectedWinnerId = winnerid;
      this.selectWinnerFlag = false;
      // console.log(winnerid);

      let oddsInfo = this.currentUserPrediction.match.additionalInfo;
      oddsInfo = oddsInfo.replace(/"/g, '');
      oddsInfo = oddsInfo.replace(/{/g, '');
      oddsInfo = oddsInfo.replace(/}/g, '');
      oddsInfo = oddsInfo.replace(/,/g, ':');
      const oddsArr = oddsInfo.split(':');
      // console.log(oddsArr);

      if (oddsArr.length === 15 && oddsArr[1] === String(this.currentUserPrediction.match.team1Id)
          && oddsArr[8] === String(this.currentUserPrediction.match.team2Id) ) {
          this.team1odds = new OddsModel(this.currentUserPrediction.match.oddsTeam1,
                                        oddsArr[3], oddsArr[5], oddsArr[7]);
          this.team2odds = new OddsModel(this.currentUserPrediction.match.oddsTeam2,
              oddsArr[10], oddsArr[12], oddsArr[14]);
      }
      // console.log(this.team1odds);
      // console.log(this.team2odds);

  }

  goBack() {
      this.location.back();
  }

  selectMargin(margin: any) {
    this.selectedMargin = margin;
    this.selectMarginFlag = false;
    // console.log(margin);
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 1000) {
      return (value / 1000) + ' k';
    }

    return value;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private loginService: LoginService,
              private matchesService: MatchesService,
              private predictionService: PredictionsService,
              private location: Location,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    // console.log('Inside predictions');
    this.route.params
        .subscribe(
            (params: Params) => {
              this.matchId = +params['id'];
              // console.log('matchId --->' + this.matchId);

            }
        );

    this.currentUserSubscription = this.loginService.currentUser
        .subscribe(
            (res) => {
              this.user = res;
              this.loggedIn = (this.user != null);
              // console.log(this.user);
              this.username = this.user.userName;
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
             // this.loggedIn = (this.user != null);
            },
          (error) => console.log(error)
        );

    // this.matchSubscription = this.matchesService.getMatchById(this.matchId, this.user.userName)
    //     .subscribe((response) => {
    //           if (response.statusCode === 'N') {
    //           } else {
    //             this.selectedMatch = <MatchModel>response.result;
    //             console.log(this.selectedMatch);
    //             console.log(JSON.parse(this.selectedMatch.additionalInfo));
    //           }
    //         },
    //         (error) => console.log(error)
    //     );

      this.targetSubscription = this.loginService.getUsersByGroupId(this.user.userName, this.user.groupId)
          .subscribe((resp) => {
                  // console.log(resp);
                  if (resp.statusCode === 'N') {
                      alert('No User Data Available');
                  } else {
                      this.targetList = resp.result as UserModel[];
                      // console.log(this.targetList);
                      this.targetList = this.targetList.filter( usr => usr.userName !== this.user.userName);
                      // console.log(this.targetList);

                  }
              },
              (error) => console.log(error)
          );

      this.spinnerService.show();
      this.getPredictionSubscription = this.predictionService.getPredictions(this.matchId,
                                                                          this.user.groupId,
                                                                          this.user.userId,
                                                                          this.user.userName)
          .subscribe((response) => {
                  this.spinnerService.hide();
                  if (response.statusCode === 'N') {
                  } else {
                      this.predictions = <PredictionModel[]>response.result;
                      // console.log(this.predictions);

                      if (this.predictions.length > 0) {

                          this.currentUserPrediction = this.predictions.filter( pred => pred.userId === this.user.userId)[0];
                          // console.log(this.currentUserPrediction);

                          if (this.currentUserPrediction.match.matchStatus !== 'SCHEDULED') {
                              this.showOthersPredictions = true;
                          }
                          // console.log('showOthersPredictions-->' + this.showOthersPredictions);

                          this.maxCoins = Math.max(this.currentUserPrediction.user.totalCoins
                              - this.currentUserPrediction.user.totalCoinsAtPlay + this.currentUserPrediction.coinsAtPlay,
                              this.currentUserPrediction.coinsAtPlay);
                           // console.log('maxCoins -->' + this.maxCoins);

                          this.predictions.forEach(pred => {
                              // console.log('Inside dataSource..');

                              if (pred.predictionId !== null && typeof pred.predictionId !== 'undefined') {
                                  const element: PredTableInterface = {
                                      player: pred.user.displayName,
                                      prediction: pred.winner.teamName + '(' + pred.margin + ')',
                                      challenged: pred.challengedUser ? pred.challengedUser.displayName : 'N/A',
                                      challengedUserId: pred.challengedUser ? pred.challengedUser.userId : null,
                                      coins: pred.coinsAtPlay,
                                      validFasak: pred.validFasak,
                                      challenged1: pred.challengedUser1 ? pred.challengedUser1.displayName : 'N/A',
                                      challengedUserId1: pred.challengedUser1 ? pred.challengedUser1.userId : null,
                                      validFasak1: pred.validFasak1,
                                      playerId: pred.userId,
                                      predPercent: pred.user.totalCoins > 0 ?
                                          Math.round((pred.coinsAtPlay / pred.user.totalCoins) * 100) : 100
                                  };
                                  this.predictionList.push(element);
                                  this.predictionList = [...this.predictionList];

                                  // console.log(this.predictionList);
                              }
                          });
                          this.dataSource = new MatTableDataSource(this.predictionList);
                          setTimeout(() => {
                              this.dataSource.sort = this.sort;

                          });

                          if (this.currentUserPrediction.predictionId) {
                              if (this.currentUserPrediction.winner.teamName) {
                                  if (this.currentUserPrediction.match.team1.teamName === this.currentUserPrediction.winner.teamName) {
                                      this.isTeam1WinnerPredicted = true;
                                  }

                                  if (this.currentUserPrediction.match.team2.teamName === this.currentUserPrediction.winner.teamName) {
                                      this.isTeam2WinnerPredicted = true;
                                  }
                              }
                          }
                          // console.log(this.isTeam1WinnerPredicted);
                          // console.log(this.isTeam2WinnerPredicted);

                      }
                  }
              },
              (error) => console.log(error)
          );
  }

  // ngAfterViewInit(): void {
  //     this.dataSource.sort = this.sort;
  // }

  submitPrediction() {
      this.submitFail = false;
      this.submitPass = false;

   if (this.selectedWinnerId || this.currentUserPrediction.winnerId) {
       this.selectWinnerFlag = false;
       this.predictionForm.value.winner = this.selectedWinnerId;
   } else {
       this.selectWinnerFlag = true;
       return;
   }

   if (this.selectedMargin || this.currentUserPrediction.margin) {
       this.selectMarginFlag = false;
       this.predictionForm.value.marginOption = this.selectedMargin;
   } else {
       this.selectMarginFlag = true;
       return;
   }

   // console.log(this.predictionForm);

   this.userPredictionToSubmit = this.currentUserPrediction;

   this.userPredictionToSubmit.margin = this.predictionForm.value.marginOption != null ?
       this.predictionForm.value.marginOption : this.userPredictionToSubmit.margin;

   this.userPredictionToSubmit.challengedUserId = this.predictionForm.value.targetUser != null ?
       this.predictionForm.value.targetUser : this.userPredictionToSubmit.challengedUserId;

   if (this.userPredictionToSubmit.challengedUserId === undefined) {
       this.userPredictionToSubmit.challengedUserId = null;
   }

   this.userPredictionToSubmit.challengedUserId1 = this.predictionForm.value.targetUser1 != null ?
      this.predictionForm.value.targetUser1 : this.userPredictionToSubmit.challengedUserId1;

   if (this.userPredictionToSubmit.challengedUserId1 === undefined) {
      this.userPredictionToSubmit.challengedUserId1 = null;
   }

   if (this.userPredictionToSubmit.challengedUserId === this.userPredictionToSubmit.challengedUserId1) {
       if(this.userPredictionToSubmit.challengedUserId == null && this.userPredictionToSubmit.challengedUserId1 == null) {
           this.selectFasakFlag = false;
       } else {
           this.selectFasakFlag = true;
           return;
       }
   } else {
       this.selectFasakFlag = false;
   }

   this.userPredictionToSubmit.winnerId = this.predictionForm.value.winner != null ?
       this.predictionForm.value.winner : this.userPredictionToSubmit.winnerId;
   this.userPredictionToSubmit.coinsAtPlay = this.predictionForm.value.coinsInvested != null ?
       this.predictionForm.value.coinsInvested : this.userPredictionToSubmit.coinsAtPlay;

   if (this.userPredictionToSubmit.coinsAtPlay === 0) {
       this.userPredictionToSubmit.coinsAtPlay = 10;
   }
   this.userPredictionToSubmit.challengedUser = null;
   this.userPredictionToSubmit.winner = null;

   // console.log(this.userPredictionToSubmit);

   this.spinnerService.show();
   this.submitPredictionSubscription = this.predictionService.submitPredictions(this.user.userId,
       this.user.userName, this.userPredictionToSubmit)
       .subscribe((resps) => {
               this.spinnerService.hide();
               // console.log(resps);
               if (resps.statusCode === 'N') {
                   this.submitFail = true;
                   this.submitPass = false;
                   this.errorMessage = resps.validationErrors[0];
               } else {
                   this.submitFail = false;
                   this.submitPass = true;
               }
           },
           (error) => console.log(error)
       );
  }

  onSelectGroup(groupid: number) {
    // console.log(groupid);

    this.userGroupSubscription = this.loginService.getUsersByGroupId(this.user.userName, groupid)
      .subscribe((resp) => {
              // console.log(resp);
              if (resp.statusCode === 'N') {
                  alert('No User Data Available');
              } else {
                  this.usersList = resp.result as UserModel[];
                  // console.log(this.usersList);
                  this.selectedUserGroup = this.usersList.filter( usr => usr.userName === this.username)[0];
                  console.log(this.selectedUserGroup);

                  this.loginService.setUser(this.selectedUserGroup);

              }
          },
          (error) => console.log(error)
      );
    this.router.navigateByUrl('/home', {skipLocationChange: true}).then(() =>
        this.router.navigate(['matches/']));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

    onClickUser(selectedUserId) {
        // console.log(selectedUserId);
        if (selectedUserId) {
            this.router.navigate(['profile'],
                {queryParams: {profileUserId: selectedUserId}});
        }

    }

    onBuyLoan() {
        this.router.navigate(['/loan']);
    }

  async addCoins (e) {
      // e.preventDefault();
      this.keyPressed = true;
      while (this.keyPressed) {
        if ((this.currentUserPrediction.coinsAtPlay + this.stepSize) <= this.maxCoins) {
            this.currentUserPrediction.coinsAtPlay = this.currentUserPrediction.coinsAtPlay + this.stepSize ;
        }
        await new Promise (resolve => setTimeout (resolve, 30));
      }
  }

  mouseUp () {
      this.keyPressed = false;
  }

  async reduceCoins (e) {
    // e.preventDefault();
    this.keyPressed = true;
    while (this.keyPressed) {
      if ((this.currentUserPrediction.coinsAtPlay - this.stepSize) >= 0) {
          this.currentUserPrediction.coinsAtPlay = this.currentUserPrediction.coinsAtPlay - this.stepSize ;
      }
      await new Promise (resolve => setTimeout (resolve, 30));
    }
}

  ngOnDestroy(): void {
      this.currentUserSubscription.unsubscribe();
      this.currentUserGroupsSubscription.unsubscribe();
      // this.matchSubscription.unsubscribe();
      this.getPredictionSubscription.unsubscribe();
      // this.submitPredictionSubscription.unsubscribe();
  }

}
