import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { GlobalService } from './global.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss', './app.component.responsive.scss' ]
})
export class AppComponent implements OnInit {

  isPopupContactActive : Boolean = false;
  subscriptionPopupBool : Subscription;

  mailContact : String;
  message : String;
  isErrorMail : Boolean = false;

  hasBeenSent : Boolean = false;

  constructor(private globalService: GlobalService, private translate: TranslateService) {
    translate.setDefaultLang('fr');
  }

   ngOnInit() {
    this.globalService.init()
    this.subscriptionPopupBool = this.globalService.isPopupContactActiveS.subscribe(
      (isPopupActive: Boolean) => {
        this.isPopupContactActive = isPopupActive;
      }
    );
  }

  sendMessage(){
    this.isErrorMail = !this.validateEmail(this.mailContact)
    if(!this.isErrorMail){
      return;
    }
    
    this.globalService.sendMail(this.mailContact, this.message)
    this.hasBeenSent=true;
    setTimeout(() => {this.closePopup();this.hasBeenSent=false;},3000)
  }

  closePopup(){
    this.globalService.managePopup("");
    this.mailContact = new String();
    this.message = new String();
  }

  validateEmail(email : String) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
