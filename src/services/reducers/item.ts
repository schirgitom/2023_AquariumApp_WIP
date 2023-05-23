import {AnyAction} from "redux";
import { createReducer} from "typesafe-actions";
import {Animal, AquariumItem, Coral} from "../rest/interface";
import {fetchAnimalActions, fetchCoralActions} from "../actions/item";

const initialState : AquariumItemState = {
    isLoading: false,
    coral : null,
    animal: null,
    aquariumitem: null,
    errorMessage: ''
}


export interface AquariumItemState {
    isLoading: boolean;
    coral: Coral| null;
    animal: Animal| null;
    aquariumitem: AquariumItem | null
    errorMessage: string;
}

export const item = createReducer<AquariumItemState, AnyAction>(initialState)
    .handleAction(fetchCoralActions.request,  (state, action) =>
        ({ ...state, isLoading: true, errorMessage: '' }))
    .handleAction(fetchCoralActions.success, (state, action) =>
        ({ ...state, isLoading: false, coral: action.payload, aquariumitem: action.payload as AquariumItem }))
    .handleAction(fetchCoralActions.failure, (state, action) =>
        ({ ...state, isLoading: false, errorMessage: action.payload.message }))
    .handleAction(fetchAnimalActions.request,  (state, action) =>
        ({ ...state, isLoading: true, errorMessage: '' }))
    .handleAction(fetchAnimalActions.success, (state, action) =>
        ({ ...state, isLoading: false, animal: action.payload, aquariumitem: action.payload as AquariumItem }))
    .handleAction(fetchAnimalActions.failure, (state, action) =>
        ({ ...state, isLoading: false, errorMessage: action.payload.message }))






