import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../global.service';
import { BlogService } from './blog.service';
import { Article } from '../classes/articles/article'
import { Secteur } from '../classes/articles/secteur';
import { Type } from '../classes/articles/type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss', './blog.component.responsive.scss']
})
export class BlogComponent implements OnInit {

  isFrSelected: Boolean;
  isEnSelected: Boolean;

  isArticleReading: Boolean = false;
  articleOnReader: Article = new Article();
  listArticlesLies: Article[] = []

  listArticles: Article[];
  listArticlesSubscription: Subscription;
  listArticleDisplay: Article[];
  listPagesArticles: any = []
  indicePage: Number = 0;

  fullListSecteurs: Secteur[] = [];
  fullListTypes: Type[] = [];

  listArticlesFr: Article[] = [];
  listArticlesEn: Article[] = [];

  isFilterOpen: Boolean = false;

  mapFilter: any = {}
  listTypes: Type[] = [];
  listSecteurs: Secteur[] = [];

  mapOneFilter: any = {
    "difficulte": false,
    "temps": false,
    "type": false,
    "secteur": false,
  }

  mapOpenFilter: any = {
    "difficulte": false,
    "temps": false,
    "type": false,
    "secteur": false,
  }

  filterLabel: any = {
    "difficulte": "Toutes les difficultés",
    "temps": "Tous les temps",
    "type": "Tous les types",
    "secteur": "Tous les secteurs",
  }

  filtrageTxt: String;

  rechercheTxt: String = "";

  styleForSizeingArticle: SafeStyle;

  isDirectlyOpen = false;
  articleToOpen: Article = new Article()

  isLinkCopied=false;

  constructor(private globalService: GlobalService, private blogService: BlogService, private sanitizer: DomSanitizer, private translate: TranslateService, private httpClient: HttpClient) { }


  ngOnInit() {
    $("html, body").animate({
      scrollTop: 0
    }, 0);
    if (window.location.href.includes("idArticle")) {
      //console.log("On accède directement à un article")
      var idArticleToOpen = window.location.href.split("?")[1].split("=")[1]
      this.openArticleDirectly(+idArticleToOpen)
    }

    document.body.addEventListener('click', (e) => {
      if ((e.target as HTMLTextAreaElement).id == "listArticle" || (e.target as HTMLTextAreaElement).className == "fond") {
        this.mapOpenFilter = {
          "difficulte": false,
          "temps": false,
          "type": false,
          "secteur": false,
        }
      }
    });

    this.isFrSelected = this.globalService.isFrSelected
    this.isEnSelected = this.globalService.isEnSelected
    if (this.isFrSelected) {
      this.switchLangue("fr")
    } else {
      this.switchLangue("en")
    }

    //Si on arrive directement ici
    this.blogService.fillListArticle();
    this.blogService.fillListDefinition();
    this.fillData();
    this.generateFilter();

    this.listArticlesSubscription = this.blogService.listArticlesSubject.subscribe(
      (listArticles: any[]) => {
        this.listArticles = listArticles;
        this.listArticlesFr = []
        this.listArticlesEn = []
        for (var k = 0; k < this.listArticles.length; k++) {
          if (this.listArticles[k].langue === "FR" && this.listArticles[k].idArticleTraduit != 0) {
            this.listArticlesFr.push(this.listArticles[k])
          } else if (this.listArticles[k].langue === "EN" && this.listArticles[k].idArticleTraduit != 0) {
            this.listArticlesEn.push(this.listArticles[k])
          }
        }
        if (this.isFrSelected) {
          this.listArticleDisplay = this.listArticlesFr.slice();
        } else {
          this.listArticleDisplay = this.listArticlesEn.slice();
        }

        this.generatePages();
      }
    );
    this.blogService.emitListArticlesSubject();

    setTimeout(() => { $(".divFond").css("height", $("#topPannel")[0].clientHeight + "px") }, 0)


  }

  openPopup(keyOrigin: String) {
    this.globalService.managePopup(keyOrigin);
  }

  invertFilter() {
    this.isFilterOpen = !this.isFilterOpen;
    if (this.isFilterOpen) {
      $("#imgFiltrageMenu").css("transform", "rotate(180deg)")
      //$("#fondBlock").css("height", "61vh")

    } else {
      $("#imgFiltrageMenu").css("transform", "rotate(0deg)")
      //$("#fondBlock").css("height", "54.3vh")
    }

    setTimeout(() => { $(".divFond").css("height", $("#topPannel")[0].clientHeight + "px") }, 0)
  }

  openOneFilter(keyFilter: String) {
    if (this.mapOpenFilter["" + keyFilter] == true) {
      this.mapOpenFilter = {
        "difficulte": false,
        "temps": false,
        "type": false,
        "secteur": false,
      }
    } else {
      this.mapOpenFilter = {
        "difficulte": false,
        "temps": false,
        "type": false,
        "secteur": false,
      }
      this.mapOpenFilter["" + keyFilter] = true;
    }
  }

  checkboxChecked(keyFilter: String) {
    //On met à jour la map des éléments filtrés
    setTimeout(() => {
      this.mapOneFilter["" + keyFilter] = false;
      for (var k = 0; k < Object.keys(this.mapFilter["" + keyFilter]).length; k++) {
        if (!this.mapFilter["" + keyFilter][Object.keys(this.mapFilter["" + keyFilter])[k]]) {
          this.mapOneFilter["" + keyFilter] = true;
        }
      }

      var isOneFilterActive = false;
      for (var k = 0; k < Object.keys(this.mapOneFilter).length; k++) {
        var key = Object.keys(this.mapOneFilter)[k]
        isOneFilterActive = isOneFilterActive || this.mapOneFilter[key];
      }
      if (isOneFilterActive) {
        if (this.isFrSelected) {
          this.filtrageTxt = "Filtré ("
        } else {
          this.filtrageTxt = "Filtered ("
        }

        for (var k = 0; k < Object.keys(this.mapOneFilter).length; k++) {
          var key = Object.keys(this.mapOneFilter)[k]
          if (this.mapOneFilter[key]) {
            if (this.isFrSelected) {
              this.filterLabel[key] = key + " (filtré)"
              this.filtrageTxt += key + ", ";
            } else {
              var correspondanceKey = {
                "difficulte": "difficulty",
                "temps": "time",
                "type": "type",
                "secteur": "sector"
              }
              this.filterLabel[key] = correspondanceKey[key] + " (filtered)"
              this.filtrageTxt += correspondanceKey[key] + ", ";
            }

          } else {
            if (this.isFrSelected) {
              var keyStringLabel = {
                "difficulte": "Toutes les difficultés",
                "temps": "Tous les temps",
                "type": "Tous les types",
                "secteur": "Tous les secteurs",
              }
            } else {
              var keyStringLabel = {
                "difficulte": "All the difficulties",
                "temps": "All the reading times",
                "type": "All the types",
                "secteur": "All the sectors",
              }
            }

            this.filterLabel[key] = keyStringLabel[key]
          }
        }
        this.filtrageTxt = this.filtrageTxt.substring(0, this.filtrageTxt.length - 2)
        this.filtrageTxt += ")"
        $("#inputFilterText").css("color", "#D17B53")
      } else {
        if (this.isFrSelected) {
          this.filtrageTxt = "Filtrer"
        } else {
          this.filtrageTxt = "Filter"
        }
        $("#inputFilterText").css("color", "#757575")
        if (this.isFrSelected) {
          this.filterLabel = {
            "difficulte": "Toutes les difficultés",
            "temps": "Tous les temps",
            "type": "Tous les types",
            "secteur": "Tous les secteurs",
          }
        } else {
          this.filterLabel = {
            "difficulte": "All the difficulties",
            "temps": "All the reading times",
            "type": "All the types",
            "secteur": "All the sectors",
          }
        }
      }

      this.filter()
    }, 100)

  }

  checkUncheckAll(keyFilter: String, isCheck: Boolean) {
    var ids = Object.keys(this.mapFilter["" + keyFilter])
    for (var k = 0; k < ids.length; k++) {
      this.mapFilter["" + keyFilter][ids[k]] = isCheck
    }
    this.checkboxChecked(keyFilter)
  }

  filter() {
    //On va test les différents filtres
    if (this.isFrSelected) {
      var listArticlesCorrectLang = this.listArticlesFr.slice()
    } else {
      var listArticlesCorrectLang = this.listArticlesEn.slice()
    }
    this.listArticleDisplay = [];
    for (var k = 0; k < listArticlesCorrectLang.length; k++) {
      var isInFilterRules = true;
      var article = listArticlesCorrectLang[k]
      //Test du filtre texte du champ recherche
      if (!article.title.toLowerCase().includes(this.rechercheTxt.toLowerCase())) {
        isInFilterRules = false;
      }

      if (!this.mapFilter.difficulte["" + article.difficulte]) {
        isInFilterRules = false;
      }

      if (!this.mapFilter.temps["" + article.time]) {
        isInFilterRules = false;
      }

      if (!this.mapFilter.type["" + article.type.key]) {
        isInFilterRules = false;
      }

      /*Si tous les secteurs sont cochés on filtre pas, si plusieurs secteurs sont cochés alors on renvoie les articles qui contiennent au moins 1 secteur*/
      if (this.mapOneFilter["secteur"]) {
        var isSectordReferenced = false;
        for (var i = 0; i < article.listSectors.length; i++) {
          var sector = article.listSectors[i].key
          if (this.mapFilter.secteur["" + sector]) {
            isSectordReferenced = true;
          }
        }

        if (!isSectordReferenced) {
          isInFilterRules = false;
        }
      }



      //Si toutes les règles sont OK on display
      if (isInFilterRules) {
        this.listArticleDisplay.push(listArticlesCorrectLang[k])
      }
    }

    //On génère les pages à partir de la liste d'articles
    this.generatePages()
  }

  generatePages() {
    this.listPagesArticles = []
    var newPage = []
    var i = 0
    var nbrArticlePerPage = 3
    for (var k = 0; k < this.listArticleDisplay.length; k++) {
      if (i == nbrArticlePerPage) {
        this.listPagesArticles.push(newPage)
        newPage = []
        newPage.push(this.listArticleDisplay[k])

      } else {
        newPage.push(this.listArticleDisplay[k])
      }
      i++
    }
    if (newPage.length != 0) {
      this.listPagesArticles.push(newPage)
    }
  }

  changePage(action: String, indicePage: Number) {
    if (action == "prec" && this.indicePage != 0) {
      this.indicePage = (+this.indicePage) - 1
    } else if (action == "next" && this.indicePage != this.listPagesArticles.length - 1) {
      this.indicePage = (+this.indicePage) + 1
    } else {
      if (action == "") {
        this.indicePage = indicePage;
      }
    }
  }

  switchLangue(langue: String) {
    if ((langue == "fr" && this.isFrSelected) || (langue == "en" && this.isEnSelected)) {
      return;
    }
    this.globalService.switchLangue(langue)
    this.isEnSelected = false;
    this.isFrSelected = false;
    if (langue == "fr") {
      this.isFrSelected = true;
      this.translate.use('fr');
    } else if (langue == "en") {
      this.isEnSelected = true;
      this.translate.use('en');
    }


    if (this.isFrSelected) {
      this.filtrageTxt = "Filtrer"
    } else {
      this.filtrageTxt = "Filter"
    }
    $("#inputFilterText").css("color", "#757575")

    this.generateFilter()

    this.mapOneFilter = {
      "difficulte": false,
      "temps": false,
      "type": false,
      "secteur": false,
    }

    this.mapOpenFilter = {
      "difficulte": false,
      "temps": false,
      "type": false,
      "secteur": false,
    }

    if (this.isFrSelected) {
      this.listArticleDisplay = this.listArticlesFr.slice();
      this.filterLabel = {
        "difficulte": "Toutes les difficultés",
        "temps": "Tous les temps",
        "type": "Tous les types",
        "secteur": "Tous les secteurs",
      }
    } else {
      this.listArticleDisplay = this.listArticlesEn.slice();
      this.filterLabel = {
        "difficulte": "All the difficulties",
        "temps": "All the reading times",
        "type": "All the types",
        "secteur": "All the sectors",
      }
    }

    if (this.isArticleReading) {
      //On ouvre directement l'article traduit
      var idTraduit = this.articleOnReader.idArticleTraduit
      this.backToNav();
      for (var k = 0; k < this.listArticles.length; k++) {
        if (this.listArticles[k].id == idTraduit) {
          this.articleToOpen = this.listArticles[k]
        }
      }
      this.openArticle(this.articleToOpen)
    }
    this.generatePages()
  }

  openArticle(article: Article) {
    //window.location.href = window.location.href+"?idArticle="+article.id
    //console.log("open article")
    //on va chercher les articles liés
    this.listArticlesLies = []
    for (var k = 0; k < this.listArticles.length; k++) {
      if (article.listIdArticlesLies.indexOf(this.listArticles[k].id) > -1) {
        this.listArticlesLies.push(this.listArticles[k])
      }
    }

    this.styleForSizeingArticle = this.sanitizer.bypassSecurityTrustStyle("width:100%; margin-top:0px;")
    //$("#fondBlock").css("height", "44vh")
    this.isArticleReading = true
    this.articleOnReader = article
    $("html, body").animate({
      scrollTop: 0
    }, 0);
    setTimeout(() => { $(".divFond").css("height", $("#topPannel")[0].clientHeight + "px") }, 0)
  }

  backToNav() {
    //console.log("close article")
    this.isDirectlyOpen = false;
    this.isFilterOpen = false;
    this.styleForSizeingArticle = this.sanitizer.bypassSecurityTrustStyle("margin-top:3vh;")
    //$("#fondBlock").css("height", "54.3vh")
    this.isArticleReading = false
    this.articleOnReader = new Article()
    this.listArticlesLies = []
    $("html, body").animate({
      scrollTop: 0
    }, 0);
    setTimeout(() => { $(".divFond").css("height", $("#topPannel")[0].clientHeight + "px") }, 0)
  }

  openArticleDirectly(idArticle: Number) {
    if (this.listArticles == null) {
      setTimeout(() => { this.openArticleDirectly(idArticle) }, 1000)
      return;
    }
    for (var k = 0; k < this.listArticles.length; k++) {
      if (this.listArticles[k].id == idArticle) {
        this.articleToOpen = this.listArticles[k]
      }
    }
    //On set la langue fonction de la langue de l'article
    this.switchLangue(this.articleToOpen.langue === "FR" ? "fr" : "en")
    this.isDirectlyOpen = true;
    this.openArticle(this.articleToOpen)


  }

  generateFilter() {
    if (this.isFrSelected) {
      this.mapFilter = {
        "difficulte": {
          "1": true,
          "2": true,
          "3": true,
          "4": true,
          "5": true,
        },
        "temps": {
          "5 min": true,
          "10 min": true,
          "30 min": true,
          "1 heure": true,
        },
      }
      this.mapFilter["secteur"] = {}
      this.listSecteurs = []
      for (var k = 0; k < this.fullListSecteurs.length; k++) {
        if (this.fullListSecteurs[k].langue === "FR") {
          this.mapFilter["secteur"]["" + this.fullListSecteurs[k].key] = true
          this.listSecteurs.push(this.fullListSecteurs[k])
        }
      }
      this.mapFilter["type"] = {}
      this.listTypes = []
      for (var k = 0; k < this.fullListTypes.length; k++) {
        if (this.fullListTypes[k].langue === "FR") {
          this.mapFilter["type"]["" + this.fullListTypes[k].key] = true
          this.listTypes.push(this.fullListTypes[k])
        }
      }
    } else {
      this.mapFilter = {
        "difficulte": {
          "1": true,
          "2": true,
          "3": true,
          "4": true,
          "5": true,
        },
        "temps": {
          "5 min": true,
          "10 min": true,
          "30 min": true,
          "1 heure": true,
        },
      }
      this.mapFilter["secteur"] = {}
      this.listSecteurs = []
      for (var k = 0; k < this.fullListSecteurs.length; k++) {
        if (this.fullListSecteurs[k].langue === "EN") {
          this.mapFilter["secteur"]["" + this.fullListSecteurs[k].key] = true
          this.listSecteurs.push(this.fullListSecteurs[k])
        }
      }
      this.mapFilter["type"] = {}
      this.listTypes = []
      for (var k = 0; k < this.fullListTypes.length; k++) {
        if (this.fullListTypes[k].langue === "EN") {
          this.mapFilter["type"]["" + this.fullListTypes[k].key] = true
          this.listTypes.push(this.fullListTypes[k])
        }
      }
    }

    console.log(this.mapFilter)
  }

  fillData() {

    this.httpClient.get<any[]>(this.globalService.baseLink + '/secteurs.json').subscribe(
      (response) => {
        if (!response){
          this.fullListSecteurs=[]
        } else {
          this.fullListSecteurs = response.slice();
        }
        
        this.generateFilter()
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );

    this.httpClient.get<any[]>(this.globalService.baseLink + '/types.json').subscribe(
      (response) => {
        if (!response){
          this.fullListTypes=[]
        } else {
          this.fullListTypes = response.slice();
        }
        this.generateFilter()
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

  share(){
    var str = this.globalService.adresseLink+"/#/blog?idArticle="+this.articleOnReader.id;
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);

    this.isLinkCopied = true;
    setTimeout(()=>{this.isLinkCopied=false;}, 1000)
  }
}