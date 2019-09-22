import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import $ from 'jquery';

import { GlobalService } from '../global.service';
import { BlogService } from './blog.service';
import {Article} from '../classes/articles/article'

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  isFrSelected : Boolean;
  isEnSelected : Boolean;

  isArticleReading : Boolean = false;
  articleOnReader : Article = new Article();
  listArticlesLies : Article[] = []

  listArticles : Article[];
  listArticlesSubscription: Subscription;
  listArticleDisplay : Article[];
  listPagesArticles : any = []
  indicePage : Number = 0;

  isFilterOpen : Boolean = false;

  mapFilter : any = {
    "difficulte":{
      "1":true,
      "2":true,
      "3":true,
      "4":true,
      "5":true,
    },
    "temps":{
      "2 min":true,
      "5 min":true,
      "10 min":true,
      "30 min":true,
      "1 heure":true,
    },
    "type":{
      "projet":true,
      "actu":true,
      "review":true,
    },
    "secteur":{
      "entreprise":true,
      "formation":true,
      "management":true,
    }
  }

  mapOneFilter :  any = {
    "difficulte":false,
    "temps":false,
    "type":false,
    "secteur":false,
  }

  mapOpenFilter : any = {
    "difficulte":false,
    "temps":false,
    "type":false,
    "secteur":false,
  }

  filterLabel : any = {
    "difficulte":"Toutes les difficultés",
    "temps":"Tous les temps",
    "type":"Tous les types",
    "secteur":"Tous les secteurs",
  }

  filtrageTxt : String;

  rechercheTxt : String = "";

  styleForSizeingArticle : SafeStyle;

  isDirectlyOpen = false;
  articleToOpen : Article = new Article()
  
  constructor(private globalService : GlobalService, private blogService : BlogService, private sanitizer : DomSanitizer) { }

  
  ngOnInit() {
    if (window.location.href.includes("idArticle")){
      console.log("On accède directement à un article")
      var idArticleToOpen = window.location.href.split("?")[1].split("=")[1]
      this.openArticleDirectly(+idArticleToOpen)
    }

    document.body.addEventListener('click', (e) => {
      if(/*<HTMLTextAreaElement>*/e.target.id=="listArticle" || /*<HTMLTextAreaElement>*/e.target.className=="fond"){
        this.mapOpenFilter = {
          "difficulte":false,
          "temps":false,
          "type":false,
          "secteur":false,
        }
      }
    });

    this.isFrSelected=this.globalService.isFrSelected
    this.isEnSelected=this.globalService.isEnSelected

    //Si on arrive directement ici
    this.blogService.fillListArticle();
    this.blogService.fillListDefinition();

    this.listArticlesSubscription = this.blogService.listArticlesSubject.subscribe(
      (listArticles: any[]) => {
        this.listArticles = listArticles;
        this.listArticleDisplay = this.listArticles.slice();
        this.generatePages();
      }
    );
    this.blogService.emitListArticlesSubject();
  }

  openPopup(keyOrigin : String){
    this.globalService.managePopup(keyOrigin);
  }

  invertFilter(){
    this.isFilterOpen = !this.isFilterOpen;
    if(this.isFilterOpen){
      $("#imgFiltrageMenu").css("transform", "rotate(180deg)")
      $("#fondBlock").css("height", "61vh")
      
    } else {
      $("#imgFiltrageMenu").css("transform", "rotate(0deg)")
      $("#fondBlock").css("height", "54.3vh")
    }
  }

  openOneFilter(keyFilter : String){
    if (this.mapOpenFilter[""+keyFilter]==true){
      this.mapOpenFilter  = {
        "difficulte":false,
        "temps":false,
        "type":false,
        "secteur":false,
      }
    } else{
      this.mapOpenFilter  = {
        "difficulte":false,
        "temps":false,
        "type":false,
        "secteur":false,
      }
      this.mapOpenFilter[""+keyFilter]=true;
    }
  }

  checkboxChecked(keyFilter : String){
    //On met à jour la map des éléments filtrés
    setTimeout( () => {
      this.mapOneFilter[""+keyFilter]=false;
      for (var k=0; k<Object.keys(this.mapFilter[""+keyFilter]).length;k++){
        if (!this.mapFilter[""+keyFilter][Object.keys(this.mapFilter[""+keyFilter])[k]]){
          this.mapOneFilter[""+keyFilter]=true;
        }
      }

      var isOneFilterActive=false;
      for (var k=0; k<Object.keys(this.mapOneFilter).length;k++){
        var key = Object.keys(this.mapOneFilter)[k]
        isOneFilterActive=isOneFilterActive||this.mapOneFilter[key];
      }
      if(isOneFilterActive){
        this.filtrageTxt = "Filtré ("
        for (var k=0; k<Object.keys(this.mapOneFilter).length;k++){
          var key = Object.keys(this.mapOneFilter)[k]
          if (this.mapOneFilter[key]){
            this.filterLabel[key]=key+" (filtré)"
            this.filtrageTxt+=key+", ";
          } else {
            var keyStringLabel = {
              "difficulte":"Toutes les difficultés",
              "temps":"Tous les temps",
              "type":"Tous les types",
              "secteur":"Tous les secteurs",
            }
            this.filterLabel[key]=keyStringLabel[key]
          }
        }
        this.filtrageTxt = this.filtrageTxt.substring(0,this.filtrageTxt.length-2)
        this.filtrageTxt+=")"
        $("#inputFilterText").css("color","#D17B53")
      } else{
        this.filtrageTxt="Filtrer"
        $("#inputFilterText").css("color","#757575")
        this.filterLabel = {
          "difficulte":"Toutes les difficultés",
          "temps":"Tous les temps",
          "type":"Tous les types",
          "secteur":"Tous les secteurs",
        }
      }

      this.filter()
    },100)
    
  }

  checkUncheckAll(keyFilter : String, isCheck : Boolean){
    var ids = Object.keys(this.mapFilter[""+keyFilter])
    for (var k=0; k<ids.length; k++){
      this.mapFilter[""+keyFilter][ids[k]]=isCheck
    }
    this.checkboxChecked(keyFilter)
  }

  filter(){
    //On va test les différents filtres
    this.listArticleDisplay = [];
    for (var k=0; k<this.listArticles.length;k++){
      var isInFilterRules = true;
      var article = this.listArticles[k]
      //Test du filtre texte du champ recherche
      if (!article.title.toLowerCase().startsWith(this.rechercheTxt.toLowerCase())){
        isInFilterRules = false;
      }

      if(!this.mapFilter.difficulte[""+article.difficulte]){
        console.log(article.difficulte)
        isInFilterRules = false;
      }

      if(!this.mapFilter.temps[""+article.time]){
        isInFilterRules = false;
      }

      if(!this.mapFilter.type[""+article.type.toLowerCase()]){
        isInFilterRules = false;
      }

      /*var isSectordReferenced = false;
      for (var k=0; k<article.listSectors.length;k++){
        var sector = article.listSectors[k]
        if(Object.keys(this.mapFilter.secteur).indexOf(""+sector)>1 && this.mapFilter.secteur[""+sector]){
          isSectordReferenced = true;
        }
      }

      if(!isSectordReferenced){
        isInFilterRules = false;
      }*/
      

      //Si toutes les règles sont OK on display
      if (isInFilterRules){
        this.listArticleDisplay.push(this.listArticles[k])
      }
    }

    //On génère les pages à partir de la liste d'articles
    this.generatePages()
  }

  generatePages(){
    this.listPagesArticles = []
    var newPage = []
    var i=0
    var nbrArticlePerPage=3
    for (var k=0; k<this.listArticleDisplay.length; k++){
      if (i==nbrArticlePerPage){
        this.listPagesArticles.push(newPage)
        newPage=[]
        newPage.push(this.listArticleDisplay[k])

      } else{
        newPage.push(this.listArticleDisplay[k])
      }
      i++
    }
    if (newPage.length!=0){
      this.listPagesArticles.push(newPage)
    }
  }

  changePage(action : String, indicePage : Number){
    if (action=="prec" && this.indicePage!=0){
      this.indicePage=(+this.indicePage)-1
    } else if (action=="next" && this.indicePage!=this.listPagesArticles.length-1){
      this.indicePage=(+this.indicePage)+1
    } else {
      if (action==""){
        this.indicePage=indicePage;
      }
    }
  }
  
  switchLangue(langue : String){
    this.globalService.switchLangue(langue)
    this.isEnSelected=false;
    this.isFrSelected=false;
    if (langue=="fr"){
      this.isFrSelected=true;
    } else if(langue=="en"){
      this.isEnSelected=true;
    }
  }

  openArticle(article : Article){
    //window.location.href = window.location.href+"?idArticle="+article.id
    console.log("open article")
    //on va chercher les articles liés
    this.listArticlesLies=[]
    for (var k=0; k<this.listArticles.length;k++){
      if(article.listIdArticlesLies.indexOf(this.listArticles[k].id)>-1){
        this.listArticlesLies.push(this.listArticles[k])
      }
    }

    this.styleForSizeingArticle = this.sanitizer.bypassSecurityTrustStyle("width:100%; margin-top:0px;")
    $("#fondBlock").css("height", "44vh")
    this.isArticleReading=true
    this.articleOnReader=article
    $("html, body").animate({
        scrollTop: 0
    }, 0);
  }

  backToNav(){
    console.log("close article")
    this.isDirectlyOpen=false;
    this.isFilterOpen=false;
    this.styleForSizeingArticle = this.sanitizer.bypassSecurityTrustStyle("width:60%; margin-top:3vh;")
    $("#fondBlock").css("height", "54.3vh")
    this.isArticleReading=false
    this.articleOnReader=new Article()
    this.listArticlesLies=[]
    $("html, body").animate({
        scrollTop: 0
    }, 0);
  }

  openArticleDirectly(idArticle : Number){
    if (this.listArticles==null){
      setTimeout(()=>{this.openArticleDirectly(idArticle)},1000)
      return;
    }
    for (var k=0; k<this.listArticles.length;k++){
      if(this.listArticles[k].id==idArticle){
        this.articleToOpen=this.listArticles[k]
      }
    }
    this.isDirectlyOpen=true;
    this.openArticle(this.articleToOpen)
    
  }
}