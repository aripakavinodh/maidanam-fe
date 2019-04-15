import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PlayerHistoryService} from '../z-services/player-history.service';
import {HistoryModel} from '../z-models/history.model';
import {MatchesService} from '../z-services/matches.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserModel} from '../z-models/user.model';
import {GroupModel} from '../z-models/group.model';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ScoresTableInterface} from '../z-models/scores-table.interface';
import {LoginService} from '../z-services/login.service';
import {HistoryTableInterface} from '../z-models/history-table.interface';


@Component({
  selector: 'app-player-history',
  templateUrl: './player-history.component.html',
  styleUrls: ['./player-history.component.css']
})
export class PlayerHistoryComponent implements OnInit, OnDestroy {


    currentUserSubscription: Subscription;
    currentUserGroupsSubscription: Subscription;
    historySubscription: Subscription;
    userGroupSubscription: Subscription;
    user: UserModel;
    selectedUserGroup: UserModel;
    historyList: HistoryModel[];
    usersList: UserModel[];
    loggedIn: boolean;
    groups: GroupModel[];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = ['no', 'match', 'prediction', 'coins', 'fasak', 'won', 'result'];
    history: HistoryTableInterface[] = [];
    dataSource: MatTableDataSource<HistoryTableInterface>;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private loginService: LoginService,
                private historyService: PlayerHistoryService) { }

    ngOnInit() {
        console.log('Inside Player History');
        this.currentUserSubscription = this.loginService.currentUser
            .subscribe(
                (res) => {
                    this.user = res;
                    this.loggedIn = (this.user != null);

                    if (!this.loggedIn) {
                        //this.router.navigate(['/home']);
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

        this.historySubscription = this.historyService.getPlayerHistory(this.user.userId, this.user.userName, this.user.groupId)
            .subscribe((resp) => {
                    console.log(resp);
                    if (resp.statusCode === 'N') {
                        alert('No History Available');
                    } else {
                        this.historyList = resp.result as HistoryModel[];
                        console.log(this.historyList);

                        if (this.historyList.length > 0) {

                            this.historyList = this.historyList.filter( usr => usr.userId === this.user.userId);
                            this.historyList.forEach((hist, index) => {
                                console.log('Inside history dataSource..');
                                const element: HistoryTableInterface = {
                                    matchId: hist.matchId,
                                    match: hist.team1 + ' vs ' + hist.team2,
                                    prediction: hist.pwinnerTeamName + '(' + hist.presultType.charAt(0) + ')',
                                    coinsAtPlay: hist.coinsAtPlay,
                                    fasak: hist.challengedUser,
                                    won: hist.wins,
                                    loss: hist.losses,
                                    bonus: hist.bonus,
                                    fasakPoints: hist.fasaks,
                                    result: hist.awinnerTeamName + '(' + hist.aresultType.charAt(0) + ')',
                                    userId: hist.userId

                                };
                                this.history.push(element);
                                this.history = [...this.history];
                            });
                            this.dataSource = new MatTableDataSource(this.history);
                            setTimeout(() => {
                                this.dataSource.sort = this.sort;
                                this.dataSource.paginator = this.paginator;
                            });
                        }
                    }
                },
                (error) => console.log(error)
            );

    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSelectGroup(groupid: number) {
        console.log(groupid);

        this.userGroupSubscription = this.loginService.getUsersByGroupId(this.user.userName, groupid)
            .subscribe((resp) => {
                    console.log(resp);
                    if (resp.statusCode === 'N') {
                        alert('No User Data Available');
                    } else {
                        this.usersList = resp.result as UserModel[];
                        console.log(this.usersList);
                        this.selectedUserGroup = this.usersList.filter( usr => usr.userName === this.user.userName)[0];
                        console.log(this.selectedUserGroup);

                        this.loginService.setUser(this.selectedUserGroup);

                    }
                },
                (error) => console.log(error)
            );

        this.router.navigateByUrl('/home', {skipLocationChange: true}).then(() =>
            this.router.navigate(['/history']));
    }

    ngOnDestroy(): void {
        this.currentUserSubscription.unsubscribe();
        this.currentUserGroupsSubscription.unsubscribe();
        this.historySubscription.unsubscribe();
        // this.userGroupSubscription.unsubscribe();
    }

}
