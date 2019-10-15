import { Component, OnInit, OnChanges, Input,SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { Article } from '../../classes/articles/article'
@Component({
  selector: 'app-miniature-article',
  templateUrl: './miniature-article.component.html',
  styleUrls: ['./miniature-article.component.scss']
})
export class MiniatureArticleComponent implements OnInit, OnChanges {

  @Input() article : Article;
  styleForBk : SafeStyle;

  constructor(private sanitizer : DomSanitizer, private translate: TranslateService) { }

  ngOnInit() {
    this.styleForBk = this.sanitizer.bypassSecurityTrustStyle("background-image: url("+this.article.srcImg+");");
    console.log(this.article.time)
    if (this.article.langue==='EN' && this.article.time==="1 heure"){
      this.article.time="1 hour"
    }
  }

  ngOnChanges(changes: SimpleChanges){
    this.styleForBk = this.sanitizer.bypassSecurityTrustStyle("background-image: url("+this.article.srcImg+");");
  }
}