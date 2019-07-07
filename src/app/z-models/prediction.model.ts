import {MatchModel} from './match.model';
import {TeamModel} from './team.model';
import {UserModel} from './user.model';

export class PredictionModel {
    public predictionId: number;
    public userId: number;
    public user: UserModel;
    public matchId: number;
    public match: MatchModel;
    public coinsAtPlay: number;
    public winnerId: number;
    public winner: TeamModel;
    public margin: string;
    public challengedUserId: number;
    public challengedUser: UserModel;
    public validFasak: boolean;
    public updatedCount: number;
    public lastUpdatedTs: Date;
    public challengedUserId1: number;
    public challengedUser1: UserModel;
    public validFasak1: boolean;


    constructor(predictionId: number, userId: number, user: UserModel, matchId: number,
                match: MatchModel, coinsAtPlay: number, winnerId: number, winner: TeamModel,
                margin: string, challengedUserId: number, challengedUser: UserModel, validFasak: boolean,
                updatedCount: number, lastUpdatedTs: Date, challengedUserId1: number, challengedUser1: UserModel,
                validFasak1: boolean) {
        this.predictionId = predictionId;
        this.userId = userId;
        this.user = user;
        this.matchId = matchId;
        this.match = match;
        this.coinsAtPlay = coinsAtPlay;
        this.winnerId = winnerId;
        this.winner = winner;
        this.margin = margin;
        this.challengedUserId = challengedUserId;
        this.challengedUser = challengedUser;
        this.validFasak = validFasak;
        this.updatedCount = updatedCount;
        this.lastUpdatedTs = lastUpdatedTs;
        this.challengedUserId1 = challengedUserId1;
        this.challengedUser1 = challengedUser1;
        this.validFasak1 = validFasak1;
    }
}
