import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BlogService } from './blog/blog.service';

@Injectable()
export class GlobalService {

  isPopupActive : Boolean = false;
  isPopupContactActiveS = new Subject<Boolean>();

  originPopup : String;

  isAuth = true; //Pour éviter de galérer

  isFrSelected=true;
  isEnSelected=false;

  baseLink : String;
  adresseLink : String;

  constructor(private blogService : BlogService) { }

  init(){
    //this.baseLink = window.location.href.includes("localhost") ? "https://bmindprodtest.firebaseio.com/" : "https://bminddev.firebaseio.com";
    this.baseLink = window.location.href.includes("localhost") ? "https://bminddev.firebaseio.com" : "https://bmindprodtest.firebaseio.com/";
    this.adresseLink = (window.location.href.split(".com")[0]+".com").split(".fr")[0]+".fr"
    this.blogService.fillListArticle();
  }

  //Gestion de la popup
  managePopup(keyOrigin : String){
    this.isPopupActive = !this.isPopupActive
    if (this.isPopupActive){
      this.originPopup = keyOrigin;
    } else {
      this.originPopup = new String();
    }

    this.emitBoolPopupSubject(this.isPopupActive);
  }

  emitBoolPopupSubject(isActive : Boolean){
    this.isPopupContactActiveS.next(isActive);
  }

  sendMail(mailContact : String, messageText : String){
    console.log('Origin: '+this.originPopup)
    console.log('Contact: '+mailContact)
    console.log('Message: '+messageText)
  }

  switchLangue(langue : String){
    this.isEnSelected=false;
    this.isFrSelected=false;
    if (langue=="fr"){
      this.isFrSelected=true;
    } else if(langue=="en"){
      this.isEnSelected=true;
    }
  }
}