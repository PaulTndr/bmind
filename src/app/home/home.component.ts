import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { InViewportMetadata } from 'ng-in-viewport';
import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../global.service';
import { BlogService } from '../blog/blog.service';

import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import { Article } from '../classes/articles/article'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isMenuOpen : Boolean = false;
  favoriteArticles : Article[] = []
  
  isFrSelected : Boolean;
  isEnSelected : Boolean;
  listFavoriteArticlesSubscription: Subscription;

  styleRondLargeL : SafeStyle;
  styleRondLargeR : SafeStyle;
  styleRondSmallR : SafeStyle;
  styleSegment0 : SafeStyle;
  styleSegment1 : SafeStyle;
  styleSegment2 : SafeStyle;
  styleSegment3 : SafeStyle;
  styleSegment4 : SafeStyle;
  styleSegment5 : SafeStyle;
  sizeSolidLineForTimeLine : SafeStyle;

  mapTimeline : any = {
    'projets':false,
    'savoirs':false,
    'offres':false,
    'charte':false,
    'parts':false,
    'carriere':false,
    'contact':false,
  };
  mapHover : any = {
    'projets':false,
    'savoirs':false,
    'offres':false,
    'charte':false,
    'parts':false,
    'carriere':false,
    'contact':false,
  };

  mapHoverPoint : any = {
    'projets':false,
    'savoirs':false,
    'offres':false,
    'charte':false,
    'parts':false,
    'carriere':false,
    'contact':false,
  };
  indexMaxDotActived : Number = 0;
  isPointHovered : Boolean = false;

  gambitGalleryIsInView = el => {
    const scroll = window.scrollY || window.pageYOffset
    const boundsTop = el.getBoundingClientRect().top + scroll
    
    const viewport = {
      top: scroll,
      bottom: scroll + window.innerHeight,
    }
    
      const bounds = {
      top: boundsTop,
      bottom: boundsTop + el.clientHeight,
    }
    
    return ( bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom ) 
      || ( bounds.top <= viewport.bottom && bounds.top >= viewport.top );
  }

  raf = 
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function( callback ) {
        window.setTimeout( callback, 1000 / 60 )
    }

  handler = () => this.raf( () => {
    const listId=['#projets','#savoirFaire','#offres','#thirdPannel','#partenaires','#carriere','#contact']
    for (var k=0;k<listId.length;k++){
      var tester = document.querySelector(listId[k])
      if(this.gambitGalleryIsInView( tester )){
        this.refreshTimeline(listId[k])
      }
    }
    setTimeout(() => {this.handler()},100);
  });

  constructor(private globalService : GlobalService, private blogService : BlogService, private sanitizer : DomSanitizer, private router: Router, private translate: TranslateService) { }

  ngOnInit() {
    this.isFrSelected=this.globalService.isFrSelected
    this.isEnSelected=this.globalService.isEnSelected
    //Si on arrive directement ici
    this.blogService.fillListArticle();
    this.listFavoriteArticlesSubscription = this.blogService.listFavoriteArticlesSubject.subscribe(
      (listFavoriteArticles: Article[]) => {
        this.favoriteArticles = listFavoriteArticles.slice();
        this.blogService.emitListFavoriteArticlesSubject();
        
      }
    );

    if(this.favoriteArticles.length==0){
      this.favoriteArticles = this.blogService.listFavoriteArticles
    }
    // Usage.
    this.handler()
  }

  onInViewportChange(inViewport: boolean) {
    if (inViewport){
      this.styleRondLargeL=this.sanitizer.bypassSecurityTrustStyle("margin-left:10vw;"); 
      this.styleRondLargeR=this.sanitizer.bypassSecurityTrustStyle("margin-right:10vw;");
      this.styleRondSmallR=this.sanitizer.bypassSecurityTrustStyle("margin-bottom:5vh; margin-top:0vh;");
      this.styleSegment0=this.sanitizer.bypassSecurityTrustStyle("left: 49.5vw;top: 25vh;");
      this.styleSegment1=this.sanitizer.bypassSecurityTrustStyle("right: 29vw;top: 35vh;");
      this.styleSegment2=this.sanitizer.bypassSecurityTrustStyle("bottom: 28vh; right:31vw;"); 
      this.styleSegment3=this.sanitizer.bypassSecurityTrustStyle("bottom: 29vh; left:31vw;");
      this.styleSegment4=this.sanitizer.bypassSecurityTrustStyle("top: 35vh;left: 29vw;");
      this.styleSegment5=this.sanitizer.bypassSecurityTrustStyle("right: 29vw;top: 35vh;");
    }
  }

  refreshTimeline(keyInViewport: String) {
    var index= ['#projets','#savoirFaire','#offres','#thirdPannel','#partenaires','#carriere','#contact'].indexOf(""+keyInViewport)
    this.mapTimeline = {
      'projets': keyInViewport==="#projets" ? true : false,
      'savoirs': keyInViewport==="#savoirFaire" ? true : false,
      'offres': keyInViewport==="#offres" ? true : false,
      'charte': keyInViewport==="#thirdPannel" ? true : false,
      'parts': keyInViewport==="#partenaires" ? true : false,
      'carriere': keyInViewport==="#carriere" ? true : false,
      'contact': keyInViewport==="#contact" ? true : false,
    };

    this.indexMaxDotActived = index;
    
    if (!this.isPointHovered){
      this.sizeSolidLineForTimeLine=this.sanitizer.bypassSecurityTrustStyle("height:"+(['#projets','#savoirFaire','#offres','#thirdPannel','#partenaires','#carriere','#contact'].indexOf(""+keyInViewport)*7)+"vh;");
    }
  }

  changeHoverPoints(keyStr : String, isHoverOn : Boolean){
    if (isHoverOn){
      this.isPointHovered=true;
      const listPoints = ['projets','savoirs','offres','charte','parts','carriere','contact'];
      var index = ['projets','savoirs','offres','charte','parts','carriere','contact'].indexOf(""+keyStr)
      this.mapHover = {
        'projets': index>=0 ? true : false,
        'savoirs': index>=1 ? true : false,
        'offres': index>=2 ? true : false,
        'charte': index>=3 ? true : false,
        'parts': index>=4 ? true : false,
        'carriere': index>=5 ? true : false,
        'contact': index>=6 ? true : false,
      }
      this.mapHoverPoint = {
        'projets': index==0 ? true : false,
        'savoirs': index==1 ? true : false,
        'offres': index==2 ? true : false,
        'charte': index==3 ? true : false,
        'parts': index==4 ? true : false,
        'carriere': index==5 ? true : false,
        'contact': index==6 ? true : false,
      }
      this.sizeSolidLineForTimeLine=this.sanitizer.bypassSecurityTrustStyle("height:"+(index*7)+"vh;");
      console.log(this.sizeSolidLineForTimeLine)
    } else {
      this.isPointHovered=false;
      this.mapHover = {
        'projets': false,
        'savoirs': false,
        'offres': false,
        'charte': false,
        'parts': false,
        'carriere': false,
        'contact': false,
      }
      this.mapHoverPoint = {
        'projets': false,
        'savoirs': false,
        'offres': false,
        'charte': false,
        'parts': false,
        'carriere': false,
        'contact': false,
      }
    }
  }
  openPopup(keyOrigin : String){
    this.globalService.managePopup(keyOrigin);
  } 

  openOrCloseMenu(){
    this.isMenuOpen = !this.isMenuOpen; 
  }

  switchLangue(langue : String){
    this.globalService.switchLangue(langue)
    this.isEnSelected=false;
    this.isFrSelected=false;
    if (langue=="fr"){
      this.isFrSelected=true;
      this.translate.use('fr');
    } else if(langue=="en"){
      this.isEnSelected=true;
      this.translate.use('en');
    }
  }

  openArticleInBlog(idArticle : Number){
    if ((""+window.location.href).includes(".com")){
      window.location.href = "https://bmind-v3.stackblitz.io/blog"+"?idArticle="+idArticle
    } else {
      window.location.href = "https://bmind-v3.stackblitz.io/blog"+"?idArticle="+idArticle
    }
  }

  resetMenu(){
    this.isMenuOpen=false;
  }
}