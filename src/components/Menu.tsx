import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  heartOutline,
  home,
  homeOutline,
  personAddOutline,
  personAddSharp,
  homeSharp,
  listOutline,
  listSharp,
  logInSharp,
  logInOutline,
  logOutSharp,
  logOutOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
  addSharp, addOutline, alarmOutline, alarmSharp, alertOutline, alertSharp, cameraOutline
} from 'ionicons/icons';
import './Menu.css';
import React, { useState, useEffect } from "react";
import {useDispatch, useSelector, useStore} from "react-redux";
import {loggedOut} from "../services/actions/users";
import {AuthenticationInformation,  User} from "../services/rest/interface";
import {isNotExpired} from "../services/rest/security-helper";
import {RootState} from "../services/reducers";
//import {AppState} from "../index";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/home',
    iosIcon: homeOutline,
    mdIcon: homeSharp
  }
];

var secureAppPage: AppPage[] = [

];

function AddMenu(item : AppPage)
{
  if (secureAppPage.some(e => e.url === item.url) == false) {
    secureAppPage.push(item );
  }
}

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {
  const location = useLocation();

  const {user, authenticationInformation } = useSelector((state: RootState) => state.user);
  //const {aquariumuserresponse } = useSelector((state: RootState) => state.aquariums);

  //const { user, token } = useSelector<RootState, LoginInfo>(state => state. .user);
  //const { token } = useSelector<AppState, AuthenticationInformation>(state => state.security.authentication};
  // const {token} = useSelector<RootState, AuthenticationInformation | null>(state => state.security.loginInfo.authentication);
  const dispatch = useDispatch();
  const store = useStore();
  const token : String = "";
  var securityItem = null;

  console.log(user);
  console.log(authenticationInformation);

  if(isNotExpired(authenticationInformation))
  {
    securityItem = {
      title: 'Logout ' + user?.fullName,
      url: '/login',
      iosIcon: logOutOutline,
      mdIcon: logOutSharp,
      onClick: () => {dispatch(loggedOut())}
    }

    AddMenu(
        {
          title: 'Aquariums',
          url: '/aquariums',
          iosIcon: listSharp,
          mdIcon: listSharp
        }
    );


    AddMenu(
        {
          title: 'Corals & Animals',
          url: '/items',
          iosIcon: listOutline,
          mdIcon: listSharp
        }


    );

    AddMenu(
        {
          title: 'Values',
          url: '/values',
          iosIcon: listSharp,
          mdIcon: listSharp
        }




    );


    AddMenu(
        {
          title: 'Images',
          url: '/aquarium/addimage',
          iosIcon: cameraOutline,
          mdIcon: cameraOutline
        }




    );
    /*
       AddMenu(
           {
             title: 'Aquarium',
             url: '/aquarium/edit/' + aquariumuserresponse!.id,
             iosIcon: addSharp,
             mdIcon: addSharp
           }
       );
     */

  }
  else{
    securityItem =
        {
          title: 'Login',
          url: '/login',
          iosIcon: logInOutline,
          mdIcon: logInSharp,
          onClick: (e: any) => {}
        }

    secureAppPage = [];

  }

  return (
      <IonMenu contentId="main" type="overlay">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonListHeader>Welcome</IonListHeader>
          <IonNote>{isNotExpired(authenticationInformation) ? 'Hello ' + user?.fullName : 'Not Logged in'}</IonNote>
          <IonList>
            {appPages.map((appPage, index) => {
              return (
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem routerLink={appPage.url} routerDirection="none">
                      <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
              );
            })}
            {secureAppPage.map((appPage, index) => {
              return (
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                      <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
              );
            })}
            <IonMenuToggle key={'sec2'} auto-hide="false">
              <IonItem routerLink={securityItem.url} lines="none" onClick={securityItem.onClick} >
                <IonIcon slot="start" ios={securityItem.iosIcon} md={securityItem.mdIcon} />
                <IonLabel>{securityItem.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
  );
};


export default Menu;
