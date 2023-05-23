import {CoralList, AnimalList} from "../../services/rest/types";
import { createAction, createAsyncAction, createCustomAction } from 'typesafe-actions';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {AnyAction} from "redux";
import {IConfig} from "../rest/iconfig";
import {Animal, AquariumClient, AquariumItem, Coral, UserClient} from "../rest/interface";
import config from "../rest/server-config";
//import {fetchValues} from "../rest/values";


export const fetchCoralActions = createAsyncAction(
    'FETCH_CORAL_REQUEST',
    'FETCH_CORAL_SUCCESS',
    'FETCH_CORAL_FAILURE')<void, Coral, Error>();

export const fetchAnimalActions = createAsyncAction(
    'FETCH_ANIMAL_REQUEST',
    'FETCH_ANIMAL_SUCCESS',
'FETCH_ANIMAL_FAILURE')<void, Animal, Error>();

export type CoralResult = ReturnType<typeof fetchCoralActions.success> | ReturnType<typeof fetchCoralActions.failure>
export type AnmialResult = ReturnType<typeof fetchAnimalActions.success> | ReturnType<typeof fetchAnimalActions.failure>
export const fetchCoralAction = (id: string):ThunkAction<Promise<CoralResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {

        dispatch(fetchCoralActions.request());
        const token = getState().user.authenticationInformation!.token || '';
        const accessheader = new IConfig();
        accessheader.setToken(token);
        const aquariumClient = new AquariumClient(accessheader, config.host);
        return aquariumClient.getCoral(getState().currentaquarium.name!, id)
            .then(
                coral =>dispatch(fetchCoralActions.success(coral))
            )
            .catch(
                err => dispatch(fetchCoralActions.failure(err))
            )
};


export const fetchAnimalAction = (id: string):ThunkAction<Promise<AnmialResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {

        dispatch(fetchAnimalActions.request());
        const token = getState().user.authenticationInformation!.token || '';
        const accessheader = new IConfig();
        accessheader.setToken(token);
        // accessheader.getAuthorization()
        const aquariumClient = new AquariumClient(accessheader, config.host);

        return aquariumClient.getAnimal(getState().currentaquarium.name!, id)
            .then(
                animal =>dispatch(fetchAnimalActions.success(animal))
            )
            .catch(
                err => dispatch(fetchAnimalActions.failure(err))
            )
    };


