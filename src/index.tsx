import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import store from "./services/store";
import {combineReducers} from "@reduxjs/toolkit";
import rootReducer, {RootState} from "./services/reducers";
import {loadUserData} from "./services/rest/security-helper";
import {Storage} from "@ionic/storage";
import {Appstorage} from "./services/utils/appstorage";
import {AquariumResult, currentAqaurium, fetchAquariumAction, loggedIn} from "./services/actions/users";
import {ThunkDispatch} from "redux-thunk";
import {Aquarium} from "./services/rest/interface";


const AppReducer = combineReducers({
    rootReducer,

})


loadUserData().then(info =>  {
    const storage = new Appstorage();
    const aquariumThunkDispatch = store.dispatch as ThunkDispatch<RootState, null, AquariumResult>;

    if(info.user && info.authentication && info.aquarium)
    {
        store.dispatch(loggedIn({
            init(_data?: any): void {
            }, toJSON(data?: any): any {
            }, user: info.user, authenticationInformation: info.authentication}));

        const aq = info.aquarium as Aquarium;

        aquariumThunkDispatch(fetchAquariumAction(aq.id!)).then(x => console.log(x.payload));
    }
    else
    {
        return false;
    }

})

const render = () => {
    const App = require("./App").default;
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById("root")
    );
};



render();
/*
if (process.env.NODE_ENV === "development" && module.hot) {
    module.hot.accept("./App", render);
}
*/
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
