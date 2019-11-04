import { Component, OnInit, Input } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../../admin.service';

import { TranslateService } from '@ngx-translate/core';

import { Article } from '../../../../classes/articles/article'
import { Auteur } from '../../../../classes/articles/auteur'
import { Type } from 'src/app/classes/articles/type';
import { Secteur } from 'src/app/classes/articles/secteur';
import { Router } from '@angular/router';

import { GlobalService } from '../../../../global.service';


@Component({
  selector: 'app-writing-pannel',
  templateUrl: './writing-pannel.component.html',
  styleUrls: ['./writing-pannel.component.scss']
})
export class WritingPannelComponent implements OnInit {

  @Input() isEdit: Boolean;
  @Input() articleToEdit: Article;

  newArticle: Article = new Article();
  editor = ClassicEditor;

  listTime = ["5 min", "10 min", "30 min", "1 heure"]
  listDifficulte = [1, 2, 3, 4, 5]

  newAutor: Auteur = new Auteur();
  newSector: Secteur = new Secteur();
  newType: Type = new Type();

  isAddSource: Boolean = false;
  isAddAuteur: Boolean = false;
  isAddSector: Boolean = false;
  isAddType: Boolean = false;

  fullListAutor: Auteur[];
  fullListArticle: Article[];
  displayedListArticleInNav : Article[][] = [];
  displayedListArticleLinked: Article[][] = [];
  displayedListArticleTraduit : Article[][] = [];
  lastIdAutor: Number;
  lastIdArticle: Number;
  mapCheckBox: any = {};

  articlesSelected: Article[] = [];
  articleTraduit: Article;
  isAddingArticleLinked: Boolean = false;
  isAddingArticleTraduit: Boolean = false;
  filterTextNav: String = new String();

  isPosted: Boolean = false;

  fullListSectors = []
  originalListSectors = [];
  displayedLangSectors = [];
  listTypes = [];
  originalListTypes = [];
  displayedLangTypes = [];

  mapSectorSelected : any = {};

  nouveauxSecteurs: Secteur[] = []


  constructor(private httpClient: HttpClient, private router: Router, private adminService: AdminService, private translate: TranslateService, private globalService : GlobalService) { }

  ngOnInit() {
    this.translate.use('fr');
    this.fillData(['autors', 'articles', 'sectors', 'types'])

    if (!this.isEdit) {
      this.newArticle.type = new Type();
      this.newArticle.langue = "FR"
      this.newArticle.time = this.listTime[0]
      this.newArticle.difficulte = this.listDifficulte[0]
      this.newArticle.listAuteurs = [];
      this.newArticle.listSectors = [];
      this.newArticle.listSectors = [];
    } else {
      this.newArticle = this.articleToEdit
      //On va set tous les labels fonction de la langue de l'article
      if (this.articleToEdit.langue==="FR"){
        this.translate.use('fr');
      } else{
        this.translate.use('en');
      }
      
    }
  }

  write() {
    this.newArticle.id = (+this.lastIdArticle) + 1
    this.lastIdArticle = (+this.lastIdArticle) + 1
    this.newArticle.vues = 0;

    //Ajout du nouveau type ??
    var isAlreadyIn=false;
    for (var k=0; k<this.originalListTypes.length; k++){
      if (this.originalListTypes[k].key===this.newArticle.type.key  && this.originalListTypes[k].langue===this.newArticle.type.langue) {
        isAlreadyIn=true;
      }
    }
    if(!isAlreadyIn){
      this.originalListTypes.push(this.newArticle.type)
      this.httpClient.put(this.globalService.baseLink+'/types.json', this.originalListTypes).subscribe(
        () => {
          console.log('Enregistrement du type terminé !');
        },
        (error) => {
          console.log('Erreur lors de l\'enregistrment du type! : ' + error);
        }
      );
    }
    
    //Edit de l'idTraduit de l'article traduit lié si il y'en a un et ajout
    if(this.newArticle.idArticleTraduit!==0){
      var listArticle = []
      this.httpClient.get<any[]>(this.globalService.baseLink+'/articles.json').subscribe(
        (response) => {
          if (!response){
            listArticle = [];
          } else {
            var lKeys = Object.keys(response)
            var listObject: Article[] = [];
            lKeys.forEach(function (kw) {
              var oneArticle = new Article()
              oneArticle.fromHashMap(response[kw])
              listObject.push(oneArticle)
            })
            listArticle = listObject.slice();
          }
          
          for (var k=0; k<listArticle.length; k++){
            if (listArticle[k].id===this.newArticle.idArticleTraduit){
              listArticle[k].idArticleTraduit=this.newArticle.id
            }
          }
          listArticle.push(this.newArticle)
          if(listArticle.length===0){
            alert("L'article n'a pas été posté, erreur interne")
            return;
          } else {
            this.httpClient.put(this.globalService.baseLink+'/articles.json', listArticle).subscribe(
              () => {
                console.log('Enregistrement des articles terminé !');
                this.isPosted = true
                this.newArticle = new Article();
                this.fillData(['autors'])
                setTimeout(() => { this.isPosted = false; this.router.navigate(['/admin/pannel/blogModeration']); }, 3000)
              },
              (error) => {
                console.log('Erreur lors de l\'enregistrment de l\'article! : ' + error);
              }
            );
          }
        });
    }

    //AJOUT BASE
    else{
      console.log("Pas d'article traduit")
      this.httpClient.post(this.globalService.baseLink+'/articles.json', this.newArticle).subscribe(
        () => {
          console.log('Enregistrement de l\'article terminé !');
          this.isPosted = true
          this.newArticle = new Article();
          this.fillData(['autors'])
          setTimeout(() => { this.isPosted = false; this.router.navigate(['/admin/pannel/blogModeration']); }, 3000)
        },
        (error) => {
          console.log('Erreur lors de l\'enregistrment de l\'article! : ' + error);
        }
      );
    }
    

    //Ajout des nouveaux secteurs
    var isOneChangeInSector=false;
    for (var k = 0; k < this.nouveauxSecteurs.length; k++) {
      var isAlreadyInSector=false;
      for (var i=0; i<this.originalListSectors.length; i++){
        if (this.originalListSectors[i].key===this.nouveauxSecteurs[k].key  && this.originalListSectors[i].langue===this.nouveauxSecteurs[k].langue) {
          isAlreadyInSector=true;
        }
      }
      if(!isAlreadyInSector){
        this.originalListSectors.push(this.nouveauxSecteurs[k])
        isOneChangeInSector=true;
      }
    }
    if (isOneChangeInSector){
      this.httpClient.put(this.globalService.baseLink+'/secteurs.json', this.originalListSectors).subscribe(
        () => {
          console.log('Enregistrement du secteur terminé !');
          this.nouveauxSecteurs = []
        },
        (error) => {
          console.log('Erreur lors de l\'enregistrment du secteur! : ' + error);
        }
      );
    }
  }

  edit() {

    //Modif BASE
    var newListArticle = []
    for (var k = 0; k < this.fullListArticle.length; k++) {
      if (!(this.fullListArticle[k].id == this.articleToEdit.id)) {
        newListArticle.push(this.fullListArticle[k])
      } else {
        newListArticle.push(this.newArticle)
      }
    }

    //Ajout du nouveau type ??
    var isAlreadyIn=false;
    for (var k=0; k<this.originalListTypes.length; k++){
      if (this.originalListTypes[k].key===this.newArticle.type.key  && this.originalListTypes[k].langue===this.newArticle.type.langue) {
        isAlreadyIn=true;
      }
    }
    if(!isAlreadyIn){
      this.originalListTypes.push(this.newArticle.type)
      this.httpClient.put(this.globalService.baseLink+'/types.json', this.originalListTypes).subscribe(
        () => {
          console.log('Enregistrement du type terminé !');
        },
        (error) => {
          console.log('Erreur lors de l\'enregistrment du type! : ' + error);
        }
      );
    }

    //Ajout des nouveaux secteurs
    var isOneChangeInSector=false;
    for (var k = 0; k < this.nouveauxSecteurs.length; k++) {
      var isAlreadyInSector=false;
      for (var i=0; i<this.originalListSectors.length; i++){
        if (this.originalListSectors[i].key===this.nouveauxSecteurs[k].key  && this.originalListSectors[i].langue===this.nouveauxSecteurs[k].langue) {
          isAlreadyInSector=true;
        }
      }
      if(!isAlreadyInSector){
        this.originalListSectors.push(this.nouveauxSecteurs[k])
        isOneChangeInSector=true;
      }
    }
    if (isOneChangeInSector){
      this.httpClient.put(this.globalService.baseLink+'/secteurs.json', this.originalListSectors).subscribe(
        () => {
          console.log('Enregistrement du secteur terminé !');
          this.nouveauxSecteurs = []
        },
        (error) => {
          console.log('Erreur lors de l\'enregistrment du secteur! : ' + error);
        }
      );
    }

    //Edit de l'idTraduit de l'article traduit lié si il y a un changement et ajout

    //On retire des favoris si certains sont concernés
    var listIdFavorite;
    var ancienArticleLie;
    var nouvelArticleLie;

    for (var k = 0; k < newListArticle.length; k++) {
      //Si il y avait un article traduit avant on l'enlève
      if (newListArticle[k].idArticleTraduit===this.newArticle.id){
        newListArticle[k].idArticleTraduit=0
        ancienArticleLie = newListArticle[k].id
      }

      //Si un article est lié
      if (newListArticle[k].id === this.newArticle.idArticleTraduit) {
        newListArticle[k].idArticleTraduit=this.newArticle.id
        nouvelArticleLie=newListArticle[k].id
      }
    }

    if (ancienArticleLie!=nouvelArticleLie){
      this.httpClient.get<any[]>(this.globalService.baseLink+'/favorites.json').subscribe(
      (response) => {
        if (response != null) {
          listIdFavorite = response
          if (listIdFavorite.indexOf(this.newArticle.id)===-1){
            //Pas de modif
            return;
          }
          var newLstIdFavorite=[]
          for(var k=0; k<listIdFavorite.length;k++){
            if(listIdFavorite[k]!==ancienArticleLie && (nouvelArticleLie || listIdFavorite[k]!==this.newArticle.id)){
              newLstIdFavorite.push(listIdFavorite[k])
            }
          }
          newLstIdFavorite.push(nouvelArticleLie)
          this.httpClient.put(this.globalService.baseLink+'/favorites.json', newLstIdFavorite).subscribe(
            () => {
              console.log('Enregistrement des favoris réussi !');
            },
            (error) => {
              console.log('Erreur lors de l\'enregistrment des favoris! : ' + error);
            }
          );
        }
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
    }

    //EDIT DE L'ARTICLE
    this.httpClient.put(this.globalService.baseLink+'/articles.json', newListArticle).subscribe(
      () => {
        console.log('Edition de l\'article terminée !');
        this.adminService.switchEditingMode()
      },
      (error) => {
        console.log('Erreur lors de l\'enregistrment de l\'article! : ' + error);
      }
    );
  }

  openAdd(keyList: String) {
    if (keyList === 'source') {
      this.isAddSource = true;
    } else if (keyList === 'auteur') {
      this.isAddAuteur = true;
    } else if (keyList === 'sector') {
      this.isAddSector = true;
    } else if (keyList === 'type') {
      this.isAddType = true;
    }
  }
  closeAdd(keyList: String) {
    if (keyList === 'source') {
      this.isAddSource = false;
    } else if (keyList === 'auteur') {
      this.isAddAuteur = false;
    } else if (keyList === 'sector') {
      this.isAddSector = false;
    } else if (keyList === 'type') {
      this.isAddType = false;
    }
  }

  addItemToLists(keyList: String) {
    if (keyList === 'type') {
      this.newType.langue=this.newArticle.langue
      this.displayedLangTypes.push(this.newType)
      this.newArticle.type = this.newType
      this.newType = new Type();
      this.isAddType = false;

    } else if (keyList === 'auteur') {
      //On doit ajouter à la liste plus haut, le mettre dans la map et le cocher
      this.newAutor.id = (+this.lastIdAutor) + 1
      this.lastIdAutor = (+this.lastIdAutor) + 1

      this.mapCheckBox["" + this.newAutor.id] = true
      this.fullListAutor.push(this.newAutor)

      this.newAutor = new Auteur()
    } else if (keyList === 'secteur') {
      this.mapSectorSelected["" + this.newSector.key] = true;
      this.newSector.langue=this.newArticle.langue
      this.fullListSectors.push(this.newSector);
      this.nouveauxSecteurs.push(this.newSector)
      this.newSector = new Secteur();
    }
  }

  removeItem(keyList: String, entry: any) {
    
    if (keyList === 'auteur') {
      var newListAuteurs = []
      for (var k = 0; k < this.newArticle.listAuteurs.length; k++) {
        if (this.newArticle.listAuteurs[k] != entry) {
          newListAuteurs.push(this.newArticle.listAuteurs[k])
        }
      }
      this.newArticle.listAuteurs = newListAuteurs.slice()

    } else if (keyList === 'secteur') {
      this.mapSectorSelected["" + entry.key] = false;
      var newListSectors = []
      for (var k = 0; k < this.newArticle.listSectors.length; k++) {
        if (this.newArticle.listSectors[k] != entry) {
          newListSectors.push(this.newArticle.listSectors[k])
        }
      }

      this.newArticle.listSectors = newListSectors.slice()
    }
  }

  validateCheckbox(keyList: String) {
    if (keyList === 'auteur') {
      for (var k = 0; k < this.fullListAutor.length; k++) {
        if (this.mapCheckBox["" + this.fullListAutor[k].id] == true) {
          var alreadyIn = false;
          for (var i = 0; i < this.newArticle.listAuteurs.length; i++) {
            if (this.newArticle.listAuteurs[i].id == this.fullListAutor[k].id) {
              alreadyIn = true;
            }
          }
          if (!alreadyIn) {
            this.newArticle.listAuteurs.push(this.fullListAutor[k])
          }
        }
      }
      this.isAddAuteur = false;
      for (var k = 0; k < this.fullListAutor.length; k++) {
        this.mapCheckBox["" + this.fullListAutor[k].id] = false
      }
    } else if (keyList === 'secteur') {
      var keysSector = Object.keys(this.mapSectorSelected)
      this.newArticle.listSectors = []
      for (var k = 0; k < keysSector.length; k++) {
        if (this.mapSectorSelected[keysSector[k]]) {
          var sectorSelected = new Secteur();
          sectorSelected.key=keysSector[k]
          sectorSelected.langue=this.newArticle.langue;
          this.newArticle.listSectors.push(sectorSelected)
        }
      }
      this.isAddSector = false;
    }
  }

  //Selon le type d'ouverture de la popup de navigateur article on ne display pas la même liste

  openPopupAddArticle() {
    this.displayedListArticleInNav = this.displayedListArticleLinked.slice();
    this.isAddingArticleLinked = true;
  }

  openPopupAddArticleTraduit(){
    this.displayedListArticleInNav = this.displayedListArticleTraduit.slice();
    this.isAddingArticleTraduit = true;
  }

  closeAddArticle() {
    this.isAddingArticleTraduit = false;
    this.isAddingArticleLinked = false;
    this.filterTextNav="";
    this.refreshDisplayedArticle();
  }

  selectArticle(article: Article) {

    if (this.isAddingArticleLinked){
      this.articlesSelected.push(article)
      this.newArticle.listIdArticlesLies.push(article.id)
    } else {
      this.articleTraduit=article;
      console.log("Selecting article "+article.id)
      this.newArticle.idArticleTraduit=article.id;
    }

    this.closeAddArticle();
    this.filterTextNav = new String();
    this.refreshDisplayedArticle()
    
  }

  deleteArticle(article: Article, keyString : String) {
    if (keyString==='linked'){
      var newListId = []
      var newListSelectedArticle = []
      for (var k = 0; k < this.newArticle.listIdArticlesLies.length; k++) {
        if (this.newArticle.listIdArticlesLies[k] != article.id) {
          newListId.push(this.newArticle.listIdArticlesLies[k])
        }
      }
      for (var k = 0; k < this.articlesSelected.length; k++) {
        if (this.articlesSelected[k].id != article.id) {
          newListSelectedArticle.push(this.articlesSelected[k])
        }
      }
      this.newArticle.listIdArticlesLies = newListId.slice()
      this.articlesSelected = newListSelectedArticle.slice()
    } else {
      this.newArticle.idArticleTraduit=0;
      this.articleTraduit = null;
    }

    this.refreshDisplayedArticle()
  }

  refreshDisplayedArticle() {
    this.displayedListArticleLinked = []
    this.displayedListArticleTraduit = []
    var indexLinked = 0
    var indexTraduit = 0
    var rowArticleLinked: Article[] = []
    var rowArticleTraduit: Article[] = []
    for (var k = 0; k < this.fullListArticle.length; k++) {

      //On fait le traitement pour les articles liés
      if (this.newArticle.langue === this.fullListArticle[k].langue && this.newArticle.listIdArticlesLies.indexOf(this.fullListArticle[k].id) == -1 && this.fullListArticle[k].title.toLowerCase().includes(this.filterTextNav.toLowerCase()) && (!this.isEdit || this.fullListArticle[k].id!=this.newArticle.id)) {
        if (indexLinked == 3) {
          this.displayedListArticleLinked.push(rowArticleLinked)
          rowArticleLinked = []
          rowArticleLinked.push(this.fullListArticle[k])
        } else {
          rowArticleLinked.push(this.fullListArticle[k])
        }
        indexLinked++;
      }

      //On fait le traitement pour les articles traduits
      //Si l'article est de la langue opposée et n'est pas encore lié (sauf edition auquel cas on délie fictivement l'article lié si il y en a un)
      if (this.newArticle.langue !== this.fullListArticle[k].langue && (this.fullListArticle[k].idArticleTraduit===0 || this.fullListArticle[k].idArticleTraduit===this.newArticle.idArticleTraduit) && this.fullListArticle[k].title.toLowerCase().includes(this.filterTextNav.toLowerCase())) {
        if (indexTraduit == 3) {
          this.displayedListArticleTraduit.push(rowArticleTraduit)
          rowArticleTraduit = []
          rowArticleTraduit.push(this.fullListArticle[k])
        } else {
          rowArticleTraduit.push(this.fullListArticle[k])
        }
        indexTraduit++;
      }


    }
    if (indexLinked != 0) {
      this.displayedListArticleLinked.push(rowArticleLinked)
    }
    if (indexTraduit != 0) {
      this.displayedListArticleTraduit.push(rowArticleTraduit)
    }

    if(this.isAddingArticleLinked){
      this.displayedListArticleInNav = this.displayedListArticleLinked.slice();
    } else {
      this.displayedListArticleInNav = this.displayedListArticleTraduit.slice();
    }
  }

  refreshLists(){
    //Refresh des types
    this.displayedLangTypes=[];
    for (var k=0; k<this.originalListTypes.length; k++){
      if (this.originalListTypes[k].langue===this.newArticle.langue){
        this.displayedLangTypes.push(this.originalListTypes[k])
      }
    }

    //Refresh des secteurs
    this.fullListSectors=[]
    for (var k=0; k<this.originalListSectors.length; k++){
      if (this.originalListSectors[k].langue===this.newArticle.langue){
        this.fullListSectors.push(this.originalListSectors[k])
      }
    }

    console.log(this.fullListSectors)
    
  }

  fillData(toBeRereshed: String[]) {
    if (toBeRereshed.indexOf('autors') > -1) {
      this.httpClient.get<any[]>(this.globalService.baseLink+'/autors.json').subscribe(
        (response) => {
          if (!response){
            this.fullListAutor=[]
          } else{
            var lKeys = Object.keys(response)
            var listObject: Auteur[] = [];
            lKeys.forEach(function (kw) {
              var oneAutor = new Auteur()
              oneAutor.fromHashMap(response[kw])
              listObject.push(oneAutor)
            })
            this.fullListAutor = listObject.slice();
          }
          this.lastIdAutor = 0;
          for (var k = 0; k < this.fullListAutor.length; k++) {
            this.lastIdAutor = +Math.max(Number(this.lastIdAutor), Number(this.fullListAutor[k].id))
            this.mapCheckBox["" + this.fullListAutor[k].id] = false
          }
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
    }

    if (toBeRereshed.indexOf('sectors') > -1) {
      this.httpClient.get<any[]>(this.globalService.baseLink+'/secteurs.json').subscribe(
        (response) => {
          if (!response){
            this.originalListSectors=[]
          } else{
            this.originalListSectors = response.slice();
          }
          this.refreshLists();
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
    }

    if (toBeRereshed.indexOf('types') > -1) {
      this.httpClient.get<any[]>(this.globalService.baseLink+'/types.json').subscribe(
        (response) => {
          if (!response){
            this.listTypes = [];
            this.originalListTypes = [];

          } else{
            this.listTypes = response.slice();
            this.originalListTypes = response.slice();
          }
          
          this.refreshLists();
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
    }

    if (toBeRereshed.indexOf('articles') > -1) {
      this.httpClient.get<any[]>(this.globalService.baseLink+'/articles.json').subscribe(
        (response) => {
          if(!response){
            this.fullListArticle = []
          }
          else{
            var lKeys = Object.keys(response)
            var listObject: Article[] = [];
            lKeys.forEach(function (kw) {
              var oneArticle = new Article()
              oneArticle.fromHashMap(response[kw])
              listObject.push(oneArticle)
            })
            this.fullListArticle = listObject.slice();
          }
          this.lastIdArticle = 0;
          for (var k = 0; k < this.fullListArticle.length; k++) {
            this.lastIdArticle = +Math.max(Number(this.lastIdArticle), Number(this.fullListArticle[k].id))
          }
          this.refreshDisplayedArticle();
          //Si on est en edit on va aller chercher les articles liés
          if (this.isEdit){
            this.articlesSelected = [];
            for (var k = 0; k < this.fullListArticle.length; k++) {
              if (this.newArticle.listIdArticlesLies.indexOf(this.fullListArticle[k].id) > -1) {
                this.articlesSelected.push(this.fullListArticle[k])
              }
              if(this.fullListArticle[k].id===this.newArticle.idArticleTraduit){
                this.articleTraduit=this.fullListArticle[k]
              }
            }
          }
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
    }
  }

  changeSelect(secteur: Secteur) {
    this.mapSectorSelected["" + secteur.key] = !this.mapSectorSelected["" + secteur.key];
  }

  switchLangueArticle(langue: String) {
    this.newArticle = new Article();
    this.newArticle.langue = langue;
    this.nouveauxSecteurs=[];
    this.mapSectorSelected={};
    this.refreshDisplayedArticle()
    this.refreshLists()
    if (langue === 'EN') {
      this.translate.use('en');
    } else {
      this.translate.use('fr');
    }
  }
}