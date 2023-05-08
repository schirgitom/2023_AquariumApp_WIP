import axios from 'axios';
import {Appstorage} from "../utils/appstorage";
import {AuthenticationInformation, ItemResponseModelOfUserResponse, LoginRequest, UserClient} from "./interface";
import {IConfig} from "./iconfig";
import config from "./server-config";
//import {loggedIn} from "../actions/user";
//import {executeDelayed} from "../utils/asynchelper";
import {CancelToken} from "axios/index";

const storage = new Appstorage();
//storage.//store.create();
export const loadUserData = () => Promise.all([storage.get('user'),storage.get('authentication'),storage.get('aquarium')])
    .then(([user, authentication, aquarium]) => ({ user: user ? JSON.parse(user): null , authentication: authentication ? JSON.parse(authentication): null , aquarium: aquarium ? JSON.parse(aquarium): null}))

export const clearUserData = () => Promise.all([storage.remove('user'), storage.remove('authentication')])

export const getUserInfo = () => Promise.all([storage.get('user'),storage.get('authentication')])
    .then(([user, authentication]) => {
        if (user.value && authentication.value)
            return {user: JSON.parse(user.value), authentication:  JSON.parse(authentication.value)}
        else throw new Error('Not logged in!')
    })


export const isNotExpired = (token: AuthenticationInformation | null | undefined) => {
    if (!token || token.token == "")
    {
        return false;
    }
    const dec = token.expirationDate;
    if(dec != undefined) {
        const future = new Date(dec * 1000);
        const now = new Date();
        if (future > now) {
            return true;
        } else {
            console.log("Token is null or expired");
            return false;
        }
    }
    return false;
}

// login(cred: LoginRequest , cancelToken?: CancelToken | undefined): Promise<ItemResponseModelOfUserResponse> {))
