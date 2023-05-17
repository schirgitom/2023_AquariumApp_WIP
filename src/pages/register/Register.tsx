import React, {useEffect} from 'react'
import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
    IonTitle,
    IonContent,
    IonPage,
    IonSpinner,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonItem,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonLabel, IonToast
} from '@ionic/react';
import { User} from '../../services/rest/interface';
import * as Validator from "../../services/utils/validators";
import {Dispatch} from 'redux';
import '../../services/actions/users';
import {RouteComponentProps} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import Login from "../login/Login";
import {executeDelayed} from "../../services/utils/async-helpers";
import {BuildForm, FormDescription} from "../../services/utils/form-builder";
import {UserClient} from "../../services/rest/interface";
import config from '../../services/rest/server-config';
import {RootState} from "../../services/reducers";
//import {fetchUserAction} from "../../services/actions/security";
import {IConfig} from "../../services/rest/iconfig";



const form= (mode: string): FormDescription<User> => ({
    name: 'registration',
    fields: [
        {
            name: 'email', label: 'Email', type: 'email', position: 'floating',
            color: 'primary', validators: [Validator.required, Validator.email, Validator.minLength(4)]
        },
        {
            name: 'firstname', label: 'Firstname', type: 'text', position: 'floating',
            color: 'primary', validators: [Validator.required, Validator.minLength(4)]
        },
        {
            name: 'lastname', label: 'Lastname', type: 'text', position: 'floating',
            color: 'primary', validators: [Validator.required, Validator.minLength(4)]
        },
        {
            name: 'password', label: 'Password', type: 'password',
            position: 'floating', validators: [Validator.required, Validator.minLength(8)]
        }
    ],
    submitLabel:  mode === 'add' ? 'Save' : 'Update',
});




//export const Register: React.FunctionComponent<RouteComponentProps<any>> = (props) => {
export default (mode: 'add' | 'edit'): React.FC<RouteComponentProps<{ id: string }>> => ({ history, match }) => {

    const dispatch = useDispatch();

    const {Form, loading , error} = BuildForm(form(mode));


  //  const token = useSelector((s:RootState) => s.user.authentication!.token || '');
/*
    const { user, isLoading, errorMessage } = useSelector((s:RootState) => s.user);



    useEffect(() => {
        if(mode == 'edit' && (!user || user.id != match.params.id))
        {
            dispatch(fetchUserAction(match.params.id));
        }
    })
*/

    const submit = (user: User) => {
        dispatch(loading(true));

        const accessheader = new IConfig();

        const userClient = new UserClient(accessheader, config.host);
        userClient.register(user)
            .then((result: {}) => {
                executeDelayed(100,() => history.replace('/login'))
            })
            .catch((err: Error) => {
                dispatch(error(err.message))
            })
            .finally(() => dispatch(loading(false)))
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/login"/>
                    </IonButtons>
                    <IonTitle>Create a new Account</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <Form handleSubmit={submit}/>
            </IonContent>
        </IonPage>
    )
}


