import {CoralList, AnimalList} from "../../services/rest/types";
import { createAction, createAsyncAction, createCustomAction } from 'typesafe-actions';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {AnyAction} from "redux";
import {IConfig} from "../rest/iconfig";
import {Animal, AquariumClient, AquariumItem, Coral, UserClient} from "../rest/interface";
import config from "../rest/server-config";

export const fetchCoralsActions = createAsyncAction(
    'FETCH_CORALS_REQUEST',
    'FETCH_CORALS_SUCCESS',
    'FETCH_CORALS_FAILURE')<void, Coral[], Error>();

export const fetchAnimalsActions = createAsyncAction(
    'FETCH_ANIMALS_REQUEST',
    'FETCH_ANIMALS_SUCCESS',
    'FETCH_ANIMALS_FAILURE')<void, Animal[], Error>();

export type CoralsResult = ReturnType<typeof fetchCoralsActions.success> | ReturnType<typeof fetchCoralsActions.failure>
export type AnmialsResult = ReturnType<typeof fetchAnimalsActions.success> | ReturnType<typeof fetchAnimalsActions.failure>
export const fetchCoralsAction = ():ThunkAction<Promise<CoralsResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {

        dispatch(fetchCoralsActions.request());
        const token = getState().user.authenticationInformation!.token || '';
        const accessheader = new IConfig();
        accessheader.setToken(token);
        // accessheader.getAuthorization()
        const aquariumClient = new AquariumClient(accessheader, config.host);

        return aquariumClient.getCorals("SchiScho")
            .then(
                corals =>dispatch(fetchCoralsActions.success(corals))
            )
            .catch(
                err => dispatch(fetchCoralsActions.failure(err))
            )
    };


export const fetchAnimalsAction = ():ThunkAction<Promise<AnmialsResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {

        dispatch(fetchAnimalsActions.request());
        const token = getState().user.authenticationInformation!.token || '';
        const accessheader = new IConfig();
        accessheader.setToken(token);
        const aquariumClient = new AquariumClient(accessheader, config.host);

        return aquariumClient.getAnimals("SchiScho")
            .then(
                animals =>dispatch(fetchAnimalsActions.success(animals))
            )
            .catch(
                err => dispatch(fetchAnimalsActions.failure(err))
            )
    };


