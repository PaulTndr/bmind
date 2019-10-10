import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Article } from '../../../../classes/articles/article'
import { Subscription } from 'rxjs/Subscription';

import { AdminService } from '../../../admin.service';

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

  listIdFavorite = [];
  mapFavorite: any = {};

  articleToEdit: Article;
  articleToDelete: Article;

  isEditionMode: Boolean = false;
  subscriptionPopupBool: Subscription;

  isDeletePopup: Boolean = false;

  constructor(private httpClient: HttpClient, private adminService: AdminService) { }

  ngOnInit() {
    this.subscriptionPopupBool = this.adminService.isPopupEditActiveS.subscribe(
      (isPopupActive: Boolean) => {
        this.isEditionMode = isPopupActive;
      }
    );

    this.httpClient.get<any[]>('https://bminddev.firebaseio.com/favorites.json').subscribe(
      (response) => {
        if (response != null) {
          this.listIdFavorite = response
          this.fillListArticle();
        }
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );
  }

  fillListArticle() {
    this.httpClient.get<any[]>('https://bminddev.firebaseio.com/articles.json').subscribe(
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

  addToFavorite(idArticle: Number) {
    this.mapFavorite["" + idArticle] = true
    if (this.listIdFavorite.length < 3) {
      this.listIdFavorite.push(+idArticle)
      //AJOUT BASE
      this.httpClient.put('https://bminddev.firebaseio.com/favorites.json', this.listIdFavorite).subscribe(
        () => {
          console.log('Enregistrement des favoris réussi !');
        },
        (error) => {
          console.log('Erreur lors de l\'enregistrment des favoris! : ' + error);
        }
      );
    }
  }

  removeFavorite(idArticle: Number) {
    this.mapFavorite["" + idArticle] = false
    var newFavorites = []
    for (var k = 0; k < this.listIdFavorite.length; k++) {
      if (this.listIdFavorite[k] != idArticle) {
        newFavorites.push(this.listIdFavorite[k])
      }
    }
    this.listIdFavorite = newFavorites
    //EDIT BASE
    this.httpClient.put('https://bminddev.firebaseio.com/favorites.json', this.listIdFavorite).subscribe(
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
        newListArticle.push(this.listArticle[k])
      }
    }
    this.listArticle = newListArticle.slice()
    this.refreshDisplayedArticles()
    this.closePopup()
    this.httpClient.put('https://bminddev.firebaseio.com/articles.json', newListArticle).subscribe(
      () => {
        console.log('Suppresion de l\'article terminée !');
      },
      (error) => {
        console.log('Erreur lors de la suppression de l\'article! : ' + error);
      }
    );
  }

}