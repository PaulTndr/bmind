import { Component, OnInit, OnChanges, Input,SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Article } from '../../classes/articles/article'
@Component({
  selector: 'app-miniature-article',
  templateUrl: './miniature-article.component.html',
  styleUrls: ['./miniature-article.component.scss']
})
export class MiniatureArticleComponent implements OnInit, OnChanges {

  @Input() article : Article;
  styleForBk : SafeStyle;

  constructor(private sanitizer : DomSanitizer) { }

  ngOnInit() {
    this.styleForBk = this.sanitizer.bypassSecurityTrustStyle("background-image: url("+this.article.srcImg+");");
  }

  ngOnChanges(changes: SimpleChanges){
    this.styleForBk = this.sanitizer.bypassSecurityTrustStyle("background-image: url("+this.article.srcImg+");");
  }
}