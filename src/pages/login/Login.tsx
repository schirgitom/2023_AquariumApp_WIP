import React from 'react';
import * as Validator from '../../services/utils/validators';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonPage
} from '@ionic/react';
import {FormDescription, BuildForm} from '../../services/utils/form-builder';
import {RouteComponentProps} from 'react-router';
import {AquariumUserResponse, UserClient, UserResponse} from '../../services/rest/interface';
import {executeDelayed} from '../../services/utils/async-helpers';
import {LoginRequest} from '../../services/rest/interface';
import {
    AquariumResult,
    AquariumsResult, currentAqaurium,
    fetchAquariumAction,
    fetchAquariumActions,
    fetchAquariumsAction,
    loggedIn
} from '../../services/actions/users';
import { useDispatch } from 'react-redux';
import store, {AppDispatch} from "../../services/store";
import {IConfig} from "../../services/rest/iconfig";
import config from "../../services/rest/server-config";
import { Storage } from '@ionic/storage';
import {Appstorage} from "../../services/utils/appstorage";
import {CoralsResult, fetchCoralsAction} from "../../services/actions/items";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../services/reducers";

type formData = Readonly<LoginRequest>;

const formDescription: FormDescription<formData> = {
    name: 'login',
    fields: [
        {name: 'username', label: 'Email', type: 'email',
            position: 'floating', color: 'primary', validators: [Validator.required, Validator.email]},
        {name: 'password', label: 'Password', type: 'password',
            position: 'floating', color: 'primary',validators: [Validator.required]}
    ],
    submitLabel: 'Login'
}

const {Form ,loading, error} = BuildForm(formDescription);

export const Login: React.FunctionComponent<RouteComponentProps<any>> = (props) => {

    const dispatch = useDispatch();


    const submit = (loginData: LoginRequest) => {
        dispatch(loading(true));

        const accessheader = new IConfig();

        const userClient = new UserClient(accessheader, config.host);
        const thunkDispatch = dispatch as ThunkDispatch<RootState, null, AquariumsResult>;
        const aquariumThunkDispatch = dispatch as ThunkDispatch<RootState, null, AquariumResult>;

        userClient.login(loginData)
            .then((loginInfo) => {
                if(loginInfo.hasError == false) {
                    if (loginInfo.data instanceof UserResponse) {
                        const authresponse = loggedIn(loginInfo.data);

                        dispatch(authresponse);
                        const jwtstore = new Appstorage();
                        console.log(authresponse);
                        Promise.all([jwtstore.set('user', JSON.stringify((loginInfo.data?.user && typeof loginInfo.data?.user === 'object') ? loginInfo.data?.user : {})),
                            jwtstore.set('authentication', JSON.stringify((loginInfo.data?.authenticationInformation && typeof loginInfo.data?.authenticationInformation === 'object') ? loginInfo.data?.authenticationInformation : {}))]
                        )
                            .then
                            (
                                x => {


                                    thunkDispatch(fetchAquariumsAction()).then(
                                        x =>
                                        {
                                            if(Array.isArray(x.payload))
                                            {
                                                aquariumThunkDispatch(fetchAquariumAction(x.payload[0].aquarium?.id!)).then(aquarium =>
                                                    {
                                                        jwtstore.set('aquarium', JSON.stringify((aquarium.payload && typeof aquarium.payload === 'object') ? aquarium.payload : {}))

                                                    }
                                                );
                                                store.dispatch(currentAqaurium(x.payload[0].aquarium!));
                                            }


                                        }
                                    );

                                    executeDelayed(200, () => props.history.replace('/home'))
                                }
                            )
                    }
                    else
                    {
                        dispatch(error('Error while logging in: ' + loginInfo.errorMessages));
                    }
                }
                else
                {
                    dispatch(error('Error while logging in: ' + loginInfo.errorMessages));
                }
            })
            .catch((err: Error) => {
                dispatch(error('Error while logging in: ' + err.message));
            })
            .finally(() => dispatch(loading(false)))
    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <Form handleSubmit={submit}/>
            </IonContent>
        </IonPage>
    );
}

export default Login
