import {Injectable} from '@angular/core';
import {SocialUser} from 'angularx-social-login';
import {UserModel} from '../z-models/user.model';
import {GroupModel} from "../z-models/group.model";

@Injectable()
export class LoginService {

    public user: UserModel;
    private users: string[] = [
        'vinod.aripaka@gmail.com',
        'alurisankar@gmail.com'
    ];

    constructor() { }

    isRegisteredUser(username: string): boolean {
        if (this.users.includes(username)) {
            return true; //groups data
        } else {
            return false; //null groups
        }
    }

    setUserProfile(socialUser: SocialUser) {

        // groups = api call(socialUser.email)

        this.user = new UserModel(socialUser.email,
            socialUser.firstName,
            socialUser.lastName,
            socialUser.email,
            'USER');
    }

    getUserProfile() {
        return this.user;
    }

    registerUser(username: string, firstName: string, lastName: string, referralCode: string) {
        this.users.push(username);
    }

    getRegisteredUsers() {
        return this.users.slice();
    }

    // getGroupList(userName: string): GroupModel[] {
    //     return null;
    // }

    getUserList(groupId: number): GroupModel[] {
        return null;
    }



}