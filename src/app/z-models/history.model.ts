export class HistoryModel {

    public groupId: number;
    public userId: number;
    public matchId: number;
    public predictionId: number;
    public displayName: string;
    public tournamentId: number;
    public tourMatchId: number;
    public team1: string;
    public team2: string;
    public localDate: string;
    public coinsAtPlay: number;
    public defaultCoins: number;
    public wins: number;
    public losses: number;
    public fasaks: number;
    public loan: number;
    public awinnerTeamName: string;
    public amatchResult: string;
    public aresultType: string;
    public pwinnerTeamName: string;
    public presultType: string;
    public challengedUser: string;
    public challengedUser1: string;
    public bonus: number;


    constructor(groupId: number, userId: number, matchId: number, predictionId: number,
                displayName: string, tournamentId: number, tourMatchId: number, team1: string,
                team2: string, localDate: string, coinsAtPlay: number, defaultCoins: number,
                wins: number, losses: number, fasaks: number, loan: number, awinnerTeamName: string,
                amatchResult: string, aresultType: string, pwinnerTeamName: string, presultType: string,
                challengedUser: string, challengedUser1: string, bonus: number) {
        this.groupId = groupId;
        this.userId = userId;
        this.matchId = matchId;
        this.predictionId = predictionId;
        this.displayName = displayName;
        this.tournamentId = tournamentId;
        this.tourMatchId = tourMatchId;
        this.team1 = team1;
        this.team2 = team2;
        this.localDate = localDate;
        this.coinsAtPlay = coinsAtPlay;
        this.defaultCoins = defaultCoins;
        this.wins = wins;
        this.losses = losses;
        this.fasaks = fasaks;
        this.loan = loan;
        this.awinnerTeamName = awinnerTeamName;
        this.amatchResult = amatchResult;
        this.aresultType = aresultType;
        this.pwinnerTeamName = pwinnerTeamName;
        this.presultType = presultType;
        this.challengedUser = challengedUser;
        this.challengedUser1 = challengedUser1;
        this.bonus = bonus;
    }
}


