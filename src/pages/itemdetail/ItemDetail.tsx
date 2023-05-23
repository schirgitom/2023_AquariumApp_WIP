import {
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonAlert,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonRefresher,
    IonRefresherContent,
    IonToast,
    IonButton,
    RefresherEventDetail, IonLabel, IonCardSubtitle
} from '@ionic/react';
import {
    train,
    add,
    trash,
    create,
    beer,
    boat,
    information,
    water,
    sunnySharp,
    flash,
    car,
    power,
    shieldCheckmark, alarm, bed
} from 'ionicons/icons';
import React, {FunctionComponent, useEffect, useState} from 'react';
import { personCircle, search, star, ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
//import '../../services/actions/security';
import {RouteComponentProps} from "react-router";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../services/reducers";
import {CoralsResult, fetchCoralsAction, fetchCoralsActions} from "../../services/actions/items";
//import {fetchValues} from "../../services/rest/values";
import {IconConverter} from "../../services/utils/iconconverter";
import ItemsList from "../items/ItemsList";
import {fetchAnimalAction, fetchAnimalActions, fetchCoralAction, fetchCoralActions} from "../../services/actions/item";
import {AquariumItem, Coral} from "../../services/rest/interface";
import moment from "moment";

export default (mode: 'coral' | 'animal'): React.FC<RouteComponentProps<{ id: string }>> =>
    ({ history, match }) => {

    const { aquariumitem, coral, animal, isLoading, errorMessage } = useSelector((s:RootState) => s.item);
    const token = useSelector((s:RootState) => s.user.authenticationInformation!.token || '');
    const dispatch = useDispatch();
    const thunkCoralDispatch = dispatch as ThunkDispatch<RootState, null, CoralsResult>;
    const [itemName, setItemName] = useState("");
    const [itemID, setItemID] = useState("");

    useEffect(() => {

        if(itemID != match.params.id) {
            if (mode === 'coral') {
                thunkCoralDispatch(fetchCoralAction(match.params.id)).then(() => {
                    setItemName(coral?.name!);
                    setItemID(coral?.id!)
                });
            }
            if (mode === 'animal') {
                thunkCoralDispatch(fetchAnimalAction(match.params.id)).then(() => {
                    setItemName(animal!.name);
                    setItemID(animal!.id!)
                });
            }
        }
    });

    const NoCoralInfo = () => !isLoading && coral == null ?
        (<IonCard>
            <img src='assets/images/img.png'></img>
            <IonCardHeader>
                <IonCardTitle>No Coral found...</IonCardTitle>
            </IonCardHeader>


        </IonCard>) : (<></>)


    const CoralInfo = () => {
        return (
            <IonCard>


                <IonCardHeader>
                    <IonCardTitle>{itemName} </IonCardTitle>
                    <IonCardSubtitle>Species: {coral?.species}</IonCardSubtitle>
                </IonCardHeader>

                <IonCardContent>
                    <p>Type: {coral!.coralType}</p>
                    <p>Inserted: {moment(coral!.inserted).format('MMMM Do YYYY')}</p>
                    <p>Amount: {coral!.amount}</p>
                </IonCardContent>
            </IonCard>
        )
    }

    const AnimalInfo = () => {
        return (
            <IonCard>

                <IonCardHeader>
                    <IonCardTitle>{itemName} </IonCardTitle>
                    <IonCardSubtitle>Species: {animal!.species}</IonCardSubtitle>
                </IonCardHeader>

                <IonCardContent>
                    <p>Alive: {animal!.isAlive ? "Yes" : "Rip " + moment(animal!.deathDate).format('MMMM Do YYYY')}</p>
                    <p>Inserted: {moment(animal!.inserted).format('MMMM Do YYYY')}</p>
                    <p>Amount: {animal!.amount}</p>
                </IonCardContent>
            </IonCard>
        )
    }


    const AquariumPanel = () => {

        if(mode === "coral")
        {
            if(coral != null)
            {


                return <CoralInfo/>
            }
            else
            {
                return <NoCoralInfo/>
            }

        }
        else
        {

            if(animal != null)
            {
                return <AnimalInfo/>
            }
            else
            {
                return <NoCoralInfo/>
            }
        }

    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonButtons slot="primary">
                        <IonButton onClick={() => history.push('/'+mode+'/edit/'+itemID)}>
                            <IonIcon slot="icon-only" icon={create}/>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>{itemName}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {isLoading ? <IonItem><IonSpinner />Loading Values...</IonItem> : <AquariumPanel/>}


                <IonToast
                    isOpen={errorMessage ? errorMessage.length > 0 : false}
                    onDidDismiss={() => false}
                    message={errorMessage}
                    duration={5000}
                    color='danger'
                />
                
            </IonContent>
        </IonPage>
    );
};

