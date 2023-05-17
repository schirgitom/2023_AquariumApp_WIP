import { combineReducers } from "@reduxjs/toolkit";
import {user, currentaquarium} from "./users";
import {formBuilderReducer} from "../utils/form-builder";
import {items} from "./items";
//import {item} from "./item";


const rootReducer = combineReducers({
    user,
    items,
   // item,
    currentaquarium,
    formBuilder: formBuilderReducer
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;