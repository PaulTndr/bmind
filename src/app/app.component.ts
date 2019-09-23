import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { GlobalService } from './global.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  isPopupContactActive : Boolean = false;
  subscriptionPopupBool : Subscription;

  mailContact : String;
  message : String;

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
    this.globalService.sendMail(this.mailContact, this.message)
    this.hasBeenSent=true;
    setTimeout(() => {this.closePopup();this.hasBeenSent=false;},3000)
  }

  closePopup(){
    this.globalService.managePopup("");
    this.mailContact = new String();
    this.message = new String();
  }
}
