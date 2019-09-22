import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../global.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AdminService implements CanActivate {

  isPopupEditActive : Boolean = false;
  isPopupEditActiveS = new Subject<Boolean>();

  constructor(private globalService: GlobalService,
              private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.globalService.isAuth) {
      return true;
    } else {
      this.router.navigate(['/admin']);
    }
  }

  switchEditingMode(){
    this.isPopupEditActive = ! this.isPopupEditActive
    this.emitBoolPopupSubject()
  }

  emitBoolPopupSubject(){
    this.isPopupEditActiveS.next(this.isPopupEditActive);
  }
}