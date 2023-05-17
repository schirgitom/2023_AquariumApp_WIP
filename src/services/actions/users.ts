import {
    Aquarium,
    AquariumClient,
    AquariumUserResponse,
    AuthenticationInformation,
    User,
    UserClient,
    UserResponse
} from "../rest/interface";
import { UserList} from "../rest/types";
import {createAction, createAsyncAction} from 'typesafe-actions';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {AnyAction} from "redux";
import config from "../rest/server-config";
import {IConfig} from "../rest/iconfig";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
//import {fetchUser, fetchUsers} from "../rest/security";

export const loggedIn = createAction('user/loggedIn')<UserResponse>();
export const loggedOut = createAction('user/loggedOut')<void>();

export const currentAqaurium = createAction('user/currentAquarium')<Aquarium>();

const accessheader = new IConfig();

export const fetchAquariumsActions = createAsyncAction(
    'FETCH_AQUARIUMS_REQUEST',
    'FETCH_AQUARIUMS_SUCCESS',
    'FETCH_AQUARIUMS_FAILURE')<void, AquariumUserResponse[], Error>();

export const fetchAquariumActions = createAsyncAction(
    'FETCH_AQUARIUM_REQUEST',
    'FETCH_AQUARIUM_SUCCESS',
    'FETCH_AQUARIUM_FAILURE')<void, AquariumUserResponse, Error>();


export type AquariumResult = ReturnType<typeof fetchAquariumActions.success> | ReturnType<typeof fetchAquariumActions.failure>;
export type AquariumsResult = ReturnType<typeof fetchAquariumsActions.success> | ReturnType<typeof fetchAquariumsActions.failure>;


export const fetchAquariumsAction = ():ThunkAction<Promise<AquariumsResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchAquariumsActions.request());

        const token = getState().user.authenticationInformation!.token || '';
        const accessheader = new IConfig();

        accessheader.setToken(token);
        // accessheader.getAuthorization()
        const aquariumClient = new AquariumClient(accessheader, config.host);

        return aquariumClient.forUser().then(value => dispatch(fetchAquariumsActions.success(value))).catch(error => dispatch(fetchAquariumsActions.failure(error)));

    };


export const fetchAquariumAction = (id: string):ThunkAction<Promise<AquariumResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchAquariumActions.request());

        const token = getState().user.authenticationInformation!.token || '';
        const accessheader = new IConfig();
        accessheader.setToken(token);
        // accessheader.getAuthorization()
        const aquariumClient = new AquariumClient(accessheader, config.host);

        return aquariumClient.get(id).then(value => dispatch(fetchAquariumActions.success(value))).catch(error => dispatch(fetchAquariumActions.failure(error)));

    };
