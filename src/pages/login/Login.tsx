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
import {executeDelayed} from '../../services/utils/async-helpers';
import { useDispatch } from 'react-redux';
import store, {AppDispatch} from "../../services/store";
import {LoginRequest, UserClient} from "../../services/rest/interface";
import {IConfig} from "../../services/rest/iconfig";
import {loggedIn} from "../../services/actions/users";
import config from "../../services/rest/server-config"
import {Appstorage} from "../../services/utils/appstorage";
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

    const accessheader = new IConfig();
    const userClient = new UserClient(accessheader, config.host)

    const submit = (loginData: LoginRequest) => {
        dispatch(loading(true));
        userClient.login(loginData)
            .then((loginInfo) => {
                if(loginInfo.hasError == false) {
                    const authresponse = loggedIn(loginInfo);
                    dispatch(authresponse);

                    const jwtstore = new Appstorage();

                    Promise.all([
                    jwtstore.set('user', JSON.stringify((loginInfo.data?.user && typeof loginInfo.data?.user === 'object')
                        ? loginInfo.data?.user : {})),
                    jwtstore.set('authentication', JSON.stringify((loginInfo.data?.authenticationInformation &&
                        typeof loginInfo.data?.authenticationInformation === 'object')
                        ? loginInfo.data?.authenticationInformation : {}))
                    ]).then(
                        x =>
                        {
                            executeDelayed(200, () => props.history.replace('/home'))
                        }
                    )
                }
                else
                {
                    dispatch(error('Username or Password are incorrect'));
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