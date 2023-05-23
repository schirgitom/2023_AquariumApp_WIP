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
import {
    AnmialsResult,
    CoralsResult,
    fetchAnimalsAction,
    fetchCoralsAction,
    fetchCoralsActions
} from "../../services/actions/items";
import * as Validator from "../../services/utils/validators";
//import {fetchValues} from "../../services/rest/values";
import {IconConverter} from "../../services/utils/iconconverter";
import ItemsList from "../items/ItemsList";
import {fetchAnimalAction, fetchAnimalActions, fetchCoralAction, fetchCoralActions} from "../../services/actions/item";
import {Animal, AquariumClient, AquariumItem, Coral} from "../../services/rest/interface";
import moment from "moment";
import {BuildForm, FieldDescriptionType, FormDescription} from "../../services/utils/form-builder";
import {IConfig} from "../../services/rest/iconfig";
import config from "../../services/rest/server-config";
import {executeDelayed} from "../../services/utils/async-helpers";

export default (mode: 'add' | 'edit', type: 'coral' | 'animal'): React.FC<RouteComponentProps<{ id: string }>> => ({ history, match }) => {

    const { aquariumitem, coral, animal, isLoading, errorMessage } = useSelector((s:RootState) => s.item);
    //const {user } = useSelector((s:RootState) => s.user);
    const token = useSelector((s:RootState) => s.user.authenticationInformation!.token || '');
    const aquarium = useSelector((s:RootState) => s.currentaquarium);
    const dispatch = useDispatch();
    const thunkCoralDispatch = dispatch as ThunkDispatch<RootState, null, CoralsResult>;
    const thunkAnimalDispatch = dispatch as ThunkDispatch<RootState, null, AnmialsResult>;
    const [itemName, setItemName] = useState("");

    useEffect(() => { if (mode === 'edit') {

        if (type == 'coral') {
            thunkCoralDispatch(fetchCoralAction(match.params.id)).finally(() => {
                setItemName(coral!.name)
            });
        } else {
            thunkAnimalDispatch(fetchAnimalAction(match.params.id)).finally(() => {
                setItemName(animal!.name)
            });
        }
    }
    }, []);


    let basefields : Array<FieldDescriptionType<AquariumItem>> = [
        {
            name: 'name', label: 'Name', type: 'text', position: 'floating',
            color: 'primary', validators: [Validator.required, Validator.minLength(2)]
        },
        {
            name: 'species', label: 'Species', type: 'text', position: 'floating',
            color: 'primary', validators: [Validator.required]
        }
        ,
        {
            name: 'inserted', label: 'Inserted', type: 'date', position: 'floating',
            color: 'primary', validators: [Validator.required]
        },
        {
            name: 'amount', label: 'Amount', type: 'number', position: 'floating',
            color: 'primary', validators: [Validator.required]
        }


    ] ;

    let coralfields : Array<FieldDescriptionType<Coral>> = [
        {
            name: 'coralType', label: 'CoralType', type: 'select', position: 'floating',
            color: 'primary', validators: [Validator.required],
            options :
                [
                    {key: "SoftCoral", value : "Soft Coral"},
                    {key: "HardCoral", value : "Hard Coral"},
                ]
        }
    ] ;

    let animalfields : Array<FieldDescriptionType<Animal>> = [
        {
            name: 'isAlive', label: 'Alive', type: 'select', position: 'floating',
            color: 'primary',
            options :
                [
                    {key: true, value : "Alive"},
                    {key: false, value : "Died"},
                ]
        }
    ] ;


    let allcoralfield : Array<FieldDescriptionType<Coral>> =  coralfields.concat(basefields);
    let allanimalfield : Array<FieldDescriptionType<Animal>> =  animalfields.concat(basefields);

    let animalform = (mode: string): FormDescription<Animal> => ({
        name: `animalform_${mode}`,
        fields:  allanimalfield,
        submitLabel: mode === 'add' ? 'Save' : 'Update',
        debug: false
    })

    let coralform = (mode: string): FormDescription<Coral> => ({
        name: `coralform_${mode}`,
        fields:  allcoralfield,
        submitLabel: mode === 'add' ? 'Save' : 'Update',
        debug: false
    })

    const submitAnimal = (animali: Animal) => {

        const accessheader = new IConfig();
        accessheader.setToken(token);
        // accessheader.getAuthorization()
        const aquariumClient = new AquariumClient(accessheader, config.host);
        console.log(animali.isAlive);

        if(animali.isAlive == true)
        {
            console.log("is alive");
            animali.deathDate =  new Date(1970,1,1, 0,0,0).toISOString();
        }
        else
        {
            console.log("died");
            const now = new Date();
            animali.deathDate = now.toISOString();
            console.log(animali.deathDate);
        }

        animali.aquarium = aquarium.name!;

        console.log("Handle Submit: " + JSON.stringify(animali));

        (mode === 'add' ? aquariumClient.animalPOST(aquarium.name!, animali)  : aquariumClient.animalPUT(aquarium.name!, animal!.id!, animali))
            .then(source =>
                 {

                    if(source.hasError == true)
                    {
                        let errors : Error = new Error();
                        errors.message = source!.errorMessages?.[0]!
                        errors.name = source!.errorMessages?.[0]!;
                        dispatch(fetchAnimalActions.failure(errors))
                    }
                    else
                    {
                        setItemName(animali!.name)
                        dispatch(fetchAnimalActions.success(source!.data!));
                        thunkAnimalDispatch(fetchAnimalsAction());
                        executeDelayed(100, ()=>history.push('/animal/show/' +source!.data!.id));
                    }
                }
               ).then( s => console.log(s));
        //   .catch(err => dispatch(setError(err)));
    }


    const submitCoral = (corali: Coral) => {
        console.log("Handle Submit: " + JSON.stringify(corali));
        const accessheader = new IConfig();
        accessheader.setToken(token);
        // accessheader.getAuthorization()  
        const aquariumClient = new AquariumClient(accessheader, config.host);

        corali.aquarium= aquarium.name!;

        (mode === 'add' ? aquariumClient.coralPOST(aquarium.name!, corali)  : aquariumClient.coralPUT(aquarium.name!, coral!.id!, corali))
            .then(source =>
                {
                    console.log("Promise");
                    console.log(source)
                    if(source.hasError == true)
                    {
                        console.log("Errror");
                        let errors : Error = new Error();
                        errors.message = source!.errorMessages?.[0]!
                        errors.name = source!.errorMessages?.[0]!;
                        dispatch(fetchCoralActions.failure(errors))
                    }
                    else
                    {
                        console.log("dispatching");
                        setItemName(corali!.name)
                        dispatch(fetchCoralActions.success(source!.data!));
                        thunkCoralDispatch(fetchCoralsAction());
                        //dispatch(fetchCoralsActions.success())
                        executeDelayed(100, ()=>history.push('/coral/show/' +source!.data!.id));
                    }
                }
            );
        //   .catch(err => dispatch(setError(err)));
    }

    const AnimalFormInfo= () => {

        let { Form, loading, error } = BuildForm<Animal>(animalform(mode));
        if(!isLoading) {
            if(mode === 'edit' && animal) {
                return <Form handleSubmit={submitAnimal} initialState={animal}/>
            }
            else
            {
                return <Form handleSubmit={submitAnimal} />
            }
        }
        else
        {
            console.log("Empty");
            return <></>
        }
    };

    const CoralFormInfo= () => {

        let { Form, loading, error } = BuildForm<Animal>(coralform(mode));
        if(!isLoading) {
            if(mode === 'edit' && coral) {
                return <Form handleSubmit={submitCoral} initialState={coral}/>
            }
            else
            {
                return <Form handleSubmit={submitCoral} />
            }
        }
        else
        {
            console.log("Empty");
            return <></>
        }
    };





    return (
        <IonPage>
            <IonHeader>

                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonButtons slot="primary">

                    </IonButtons>
                    <IonTitle>{mode === 'add' ? 'New ' + type : 'Edit ' + itemName} </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {isLoading ? <IonItem><IonSpinner />Loading Items...</IonItem> :
                    type == 'coral'  ? <CoralFormInfo/> : <AnimalFormInfo/>
                }

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

