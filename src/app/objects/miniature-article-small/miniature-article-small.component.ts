import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Article } from '../../classes/articles/article'
@Component({
  selector: 'app-miniature-article-small',
  templateUrl: './miniature-article-small.component.html',
  styleUrls: ['./miniature-article-small.component.scss', './miniature-article-small.component.responsive.scss']
})
export class MiniatureArticleSmallComponent implements OnInit, OnChanges {

  @Input() article: Article;
  @Input() size: String;

  sizingWrap: SafeStyle;
  sizingText: SafeStyle;
  styleForSizingTitle: SafeStyle;
  styleForBk: SafeStyle;
  //articleInput : Article;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    if(window.innerWidth<825){
      this.sizingWrap = this.sanitizer.bypassSecurityTrustStyle(
        "width:80vw;" +
        "height:43vw;")
      this.sizingText = this.sanitizer.bypassSecurityTrustStyle("height:21vw;")
      this.styleForSizingTitle = this.sanitizer.bypassSecurityTrustStyle("width:80vw;")
    }
    else if (this.size === 'small') {
      this.sizingWrap = this.sanitizer.bypassSecurityTrustStyle(
        "width:20vw;" +
        "height:10vw;")
      this.sizingText = this.sanitizer.bypassSecurityTrustStyle("height:8vw;")
      this.styleForSizingTitle = this.sanitizer.bypassSecurityTrustStyle("width:20vw;")
    } else if (this.size === 'medium') {
      this.sizingWrap = this.sanitizer.bypassSecurityTrustStyle(
        "width:25vw;" +
        "height:12.5vw;")
      this.sizingText = this.sanitizer.bypassSecurityTrustStyle("height:10vw;")
      this.styleForSizingTitle = this.sanitizer.bypassSecurityTrustStyle("width:25vw;")
    } else if (this.size === 'large') {
      this.sizingWrap = this.sanitizer.bypassSecurityTrustStyle(
        "width:35vw;" +
        "height:17.5vw;")
      this.sizingText = this.sanitizer.bypassSecurityTrustStyle("height:17vw;")
      this.styleForSizingTitle = this.sanitizer.bypassSecurityTrustStyle("width:35vw;")
    }
    this.styleForBk = this.sanitizer.bypassSecurityTrustStyle("background-image: url(" + this.article.srcImg + ");");
  }

  ngOnChanges(changes: SimpleChanges) {
    this.styleForBk = this.sanitizer.bypassSecurityTrustStyle("background-image: url(" + this.article.srcImg + ");");
  }

}