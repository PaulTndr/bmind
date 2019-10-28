import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import $ from 'jquery';
import { GlobalService } from '../../global.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-legal',
    templateUrl: './legal.component.html',
    styleUrls: ['../styleLegal.component.scss']
})
export class LegalComponent implements OnInit {

    isFrSelected: Boolean;
    isEnSelected: Boolean;

    constructor(private globalService: GlobalService, private router: Router, private translate: TranslateService) { }

    ngOnInit() {
        $("html, body").animate({
            scrollTop: 0
        }, 0);

        this.isFrSelected = this.globalService.isFrSelected
        this.isEnSelected = this.globalService.isEnSelected
    }
}