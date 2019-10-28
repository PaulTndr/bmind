import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Article } from '../../../../classes/articles/article'
import { Subscription } from 'rxjs/Subscription';

import { AdminService } from '../../../admin.service';
import { GlobalService } from '../../../../global.service';

@Component({
  selector: 'app-editing-pannel',
  templateUrl: './editing-pannel.component.html',
  styleUrls: ['./editing-pannel.component.scss']
})
export class EditingPannelComponent implements OnInit {

  displayedColumnsArticle: String[] = ['img', 'resume', 'date', 'langue', 'views', 'actions'];
  listArticle: Article[] = [];
  dataSourceArticle = new MatTableDataSource<Article>();

  filterText: String = "";

  listIdFavorite : any;
  listIdFavoriteProject :any;
  mapFavorite: any = {};
  mapFavoriteProject: any = {};

  articleToEdit: Article;
  articleToDelete: Article;

  isEditionMode: Boolean = false;
  subscriptionPopupBool: Subscription;

  isDeletePopup: Boolean = false;

  needRefresh = true;

  constructor(private httpClient: HttpClient, private adminService: AdminService, private globalService : GlobalService) { }

  ngOnInit() {
    this.subscriptionPopupBool = this.adminService.isPopupEditActiveS.subscribe(
      (isPopupActive: Boolean) => {
        this.isEditionMode = isPopupActive;
      }
    );

    this.httpClient.get<any[]>(this.globalService.baseLink+'/favorites.json').subscribe(
      (response) => {
        if (response != null) {
          this.listIdFavorite = response
          this.fillListArticle();
        } else {
          this.listIdFavorite = []
          this.fillListArticle();
        }
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );

    this.httpClient.get<any[]>(this.globalService.baseLink+'/favoritesProject.json').subscribe(
      (response) => {
        if (response != null) {
          this.listIdFavoriteProject = response
          this.fillListArticle();
        } else {
          this.listIdFavoriteProject = []
          this.fillListArticle();
        }
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

  fillListArticle() {
    if(!this.listIdFavorite || !this.listIdFavoriteProject){
      return;
    }
    this.httpClient.get<any[]>(this.globalService.baseLink+'/articles.json').subscribe(
      (response) => {
        var lKeys = Object.keys(response)
        var listObject: Article[] = [];
        lKeys.forEach(function (kw) {
          var oneArticle = new Article()
          oneArticle.fromHashMap(response[kw])
          listObject.push(oneArticle)
        })
        this.listArticle = listObject.slice();
        this.dataSourceArticle = new MatTableDataSource<Article>(this.listArticle);
        for (var k = 0; k < this.listArticle.length; k++) {
          if (this.listIdFavorite.indexOf((+this.listArticle[k].id)) > -1) {
            this.mapFavorite["" + this.listArticle[k].id] = true
          } else {
            this.mapFavorite["" + this.listArticle[k].id] = false
          }

          if(this.listIdFavoriteProject.indexOf((+this.listArticle[k].id)) > -1){
            this.mapFavoriteProject["" + this.listArticle[k].id] = true
          } else {
            this.mapFavoriteProject["" + this.listArticle[k].id] = false
          }
        }
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

  refreshDisplayedArticles() {
    var displayedArticlesList = [];
    for (var k = 0; k < this.listArticle.length; k++) {
      if (this.listArticle[k].title.toLowerCase().startsWith(this.filterText.toLowerCase())) {
        displayedArticlesList.push(this.listArticle[k])
      }
    }
    this.dataSourceArticle = new MatTableDataSource<Article>(displayedArticlesList);
  }

  addToFavorite(article: Article) {
    this.needRefresh=false;
    var idArticle = article.id
    var idArticleTraduit = article.idArticleTraduit
    if (idArticleTraduit===0){
      alert("Impossible, l'article n'est pas lié à une version traduite")
      return;
    }
  
    if (this.listIdFavorite.length < 6) {
      this.mapFavorite["" + idArticle] = true
      this.mapFavorite["" + idArticleTraduit] = true
      this.listIdFavorite.push(+idArticle)
      this.listIdFavorite.push(+idArticleTraduit)
      //AJOUT BASE
      this.httpClient.put(this.globalService.baseLink+'/favorites.json', this.listIdFavorite).subscribe(
        () => {
          console.log('Enregistrement des favoris réussi !');
        },
        (error) => {
          console.log('Erreur lors de l\'enregistrment des favoris! : ' + error);
        }
      );
    } else {
      alert("Impossible, déjà 3 articles en favoris")
      return;
    }
  }

  addToFavoriteProject(article: Article) {
    this.needRefresh=false;
    var idArticle = article.id
    var idArticleTraduit = article.idArticleTraduit
    if (idArticleTraduit===0){
      alert("Impossible, l'article n'est pas lié à une version traduite")
      return;
    }
  
    if (this.listIdFavoriteProject.length < 4) {
      this.mapFavoriteProject["" + idArticle] = true
      this.mapFavoriteProject["" + idArticleTraduit] = true
      this.listIdFavoriteProject.push(+idArticle) 
      this.listIdFavoriteProject.push(+idArticleTraduit)
      //AJOUT BASE
      this.httpClient.put(this.globalService.baseLink+'/favoritesProject.json', this.listIdFavoriteProject).subscribe(
        () => {
          console.log('Enregistrement des favoris réussi !');
        },
        (error) => {
          console.log('Erreur lors de l\'enregistrment des favoris! : ' + error);
        }
      );
    } else {
      alert("Impossible, déjà 2 articles en favoris projet")
      return;
    }
  }

  removeFavorite(article: Article) {
    this.needRefresh=false;
    var idArticle = article.id
    var idArticleTraduit = article.idArticleTraduit
    this.mapFavorite["" + idArticle] = false
    this.mapFavorite["" + idArticleTraduit] = false
    var newFavorites = []
    for (var k = 0; k < this.listIdFavorite.length; k++) {
      if (this.listIdFavorite[k] != idArticle && this.listIdFavorite[k] != idArticleTraduit) {
        newFavorites.push(this.listIdFavorite[k])
      }
    }
    this.listIdFavorite = newFavorites
    //EDIT BASE
    this.httpClient.put(this.globalService.baseLink+'/favorites.json', this.listIdFavorite).subscribe(
      () => {
        console.log('Enregistrement des favoris réussi !');
      },
      (error) => {
        console.log('Erreur lors de l\'enregistrment des favoris! : ' + error);
      }
    );
    }

  removeFavoriteProject(article: Article) {
    this.needRefresh=false;
    var idArticle = article.id
    var idArticleTraduit = article.idArticleTraduit
    this.mapFavoriteProject["" + idArticle] = false
    this.mapFavoriteProject["" + idArticleTraduit] = false
    var newFavoritesProject = []
    for (var k = 0; k < this.listIdFavoriteProject.length; k++) {
      if (this.listIdFavoriteProject[k] != idArticle && this.listIdFavoriteProject[k] != idArticleTraduit) {
        newFavoritesProject.push(this.listIdFavoriteProject[k])
      }
    }
    this.listIdFavoriteProject = newFavoritesProject
    //EDIT BASE
    this.httpClient.put(this.globalService.baseLink+'/favoritesProject.json', this.listIdFavoriteProject).subscribe(
      () => {
        console.log('Enregistrement des favoris réussi !');
      },
      (error) => {
        console.log('Erreur lors de l\'enregistrment des favoris! : ' + error);
      }
    );
  }

  editArticle(article: Article) {
    this.articleToEdit = article;
    setInterval(()=>{this.refreshMapFavorite();this.needRefresh=true;}, 1000);
    this.adminService.switchEditingMode()
  }

  closeEditArticle() {
    this.articleToEdit = new Article();
    this.adminService.switchEditingMode()
  }

  openDeletePopup(article) {
    this.articleToDelete = article;
    this.isDeletePopup = true;
  }

  closePopup() {
    this.articleToDelete = new Article();
    this.isDeletePopup = false;
  }

  validateDelete() {
    var newListArticle = []
    for (var k = 0; k < this.listArticle.length; k++) {
      if (!(this.listArticle[k].id == this.articleToDelete.id)) {
        //On doit délier la traduction si il y en a une
        if (this.listArticle[k].idArticleTraduit == this.articleToDelete.id){
          this.listArticle[k].idArticleTraduit=0;
        }

        //On doit délier l'article de tous ceux qui le référençait
        var listIdArticlesLies=[];
        for (var i=0; i<this.listArticle[k].listIdArticlesLies.length;i++){
          if(this.listArticle[k].listIdArticlesLies[i]!=this.articleToDelete.id){
            listIdArticlesLies.push(this.listArticle[k].listIdArticlesLies[i])
          }
        }
        this.listArticle[k].listIdArticlesLies = listIdArticlesLies
        newListArticle.push(this.listArticle[k])
      }
    }
    this.listArticle = newListArticle.slice()
    this.refreshDisplayedArticles()
    this.closePopup()
    this.httpClient.put(this.globalService.baseLink+'/articles.json', newListArticle).subscribe(
      () => {
        console.log('Suppresion de l\'article terminée !');
      },
      (error) => {
        console.log('Erreur lors de la suppression de l\'article! : ' + error);
      }
    );
  }

  refreshMapFavorite(){
    if(!this.needRefresh){
      return;
    }
    this.httpClient.get<any[]>(this.globalService.baseLink+'/favorites.json').subscribe(
      (response) => {
        if (response != null) {
          this.listIdFavorite = response
          var keysFavorite = Object.keys(this.mapFavorite)
          for( var i =0; i<keysFavorite.length; i++){
            this.mapFavorite[keysFavorite[i]]=false;
          }

          for (var k=0;k<this.listIdFavorite.length; k++){
            this.mapFavorite["" + this.listIdFavorite[k]] = true
          }
          
        }
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
    this.httpClient.get<any[]>(this.globalService.baseLink+'/favoritesProject.json').subscribe(
      (response) => {
        if (response != null) {
          this.listIdFavoriteProject = response
          var keysFavoriteProject = Object.keys(this.mapFavoriteProject)
          for( var i =0; i<keysFavoriteProject.length; i++){
            this.mapFavoriteProject[keysFavoriteProject[i]]=false;
          }

          for (var k=0;k<this.listIdFavoriteProject.length; k++){
            this.mapFavoriteProject["" + this.listIdFavoriteProject[k]] = true
          }
          
        }
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

}