import { Component, OnInit, OnChanges, Input,SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Article } from '../../classes/articles/article'
@Component({
  selector: 'app-miniature-article-small',
  templateUrl: './miniature-article-small.component.html',
  styleUrls: ['./miniature-article-small.component.css']
})
export class MiniatureArticleSmallComponent implements OnInit, OnChanges {

  @Input() article : Article;
  @Input() size : String;

  sizingStr : String = new String();
  styleForSizingTitle : SafeStyle;
  styleForMiniature : SafeStyle;

  //articleInput : Article;

  constructor(private sanitizer : DomSanitizer) { }

  ngOnInit() {
    if (this.size==='small'){
      this.sizingStr = new String(
        "width:20vw;"+
        "height:10vw;"+
        "background-size: 20vw 10vw;")
      this.styleForSizingTitle = this.sanitizer.bypassSecurityTrustStyle("width:20vw;")
    } else if (this.size==='medium'){
      this.sizingStr = new String(
        "width:25vw;"+
        "height:12.5vw;"+
        "background-size: 100% 100%;")
      this.styleForSizingTitle = this.sanitizer.bypassSecurityTrustStyle("width:25vw;")
    } else if (this.size==='large'){
      this.sizingStr = new String(
        "width:30vw;"+
        "height:15vw;"+
        "background-size: 30vw 15vw;")
      this.styleForSizingTitle = this.sanitizer.bypassSecurityTrustStyle("width:30vw;")
    } 
    this.styleForMiniature = this.sanitizer.bypassSecurityTrustStyle("background-image: url("+this.article.srcImg+");"+this.sizingStr);
  }

  ngOnChanges(changes: SimpleChanges){
    this.styleForMiniature = this.sanitizer.bypassSecurityTrustStyle("background-image: url("+this.article.srcImg+")"+this.sizingStr);
  }

}