import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { Keyword } from '../../../../classes/articles/keyword'
import { Auteur } from '../../../../classes/articles/auteur'

import { HttpClient } from '@angular/common/http';
import { Offre } from 'src/app/classes/offre';
import { Secteur } from 'src/app/classes/articles/secteur';
import { Type } from 'src/app/classes/articles/type';

import { GlobalService } from '../../../../global.service';

@Component({
  selector: 'app-setting-pannel',
  templateUrl: './setting-pannel.component.html',
  styleUrls: ['./setting-pannel.component.scss']
})
export class SettingPannelComponent implements OnInit {

  entryToEdit: String;

  filterText: String;

  displayedColumnsKeyword: String[] = ['key', 'def','langue', 'actions'];
  listKeyword: Keyword[] = [];
  dataSourceKeyword = new MatTableDataSource<Keyword>();

  displayedColumnsAutor: String[] = ['prenom', 'nom', 'fonction', 'actions'];
  listAutor: Auteur[] = [];
  dataSourceAutor = new MatTableDataSource<Auteur>();

  displayedColumnsSecteurs: String[] = ['key', 'langue', 'actions'];
  listSecteurs: String[] = [];
  dataSourceSecteurs = new MatTableDataSource<String>();

  displayedColumnsTypes: String[] = ['key', 'langue', 'actions'];
  listTypes: String[] = [];
  dataSourceTypes = new MatTableDataSource<String>();

  displayedColumnsOffers: String[] = ['title', 'linkPDF', 'actions'];
  listOffers: Offre[] = [];
  dataSourceOffers = new MatTableDataSource<Offre>();

  isDeletePopup: boolean = false;
  isAddOrEditPopup: boolean = false;

  newKeyword: Keyword = new Keyword();
  lastIdKw: Number;
  newAutor: Auteur = new Auteur();
  lastIdAutor: Number;
  newOffre: Offre = new Offre();
  lastIdOffre: Number;
  mode: String;

  basePdfLink = "http://bmindinnovation.com/assets/pdfOffres/";
  constructor(private httpClient: HttpClient, private globalService : GlobalService) { }

  ngOnInit() {

    this.fillDataFromBase()

    this.entryToEdit = "keyword";

    this.refreshData()
  }

  fillDataFromBase() {
    this.httpClient.get<any[]>(this.globalService.baseLink+'/keywords.json').subscribe(
      (response) => {
        if (!response){
          this.listKeyword = [];
          this.lastIdKw = 0;
        } else {
          var lKeys = Object.keys(response)
          var listObject: Keyword[] = [];
          lKeys.forEach(function (kw) {
            var oneKw = new Keyword()
            oneKw.fromHashMap(response[kw])
            listObject.push(oneKw)
          })
          this.listKeyword = listObject.slice();
          this.lastIdKw = 0;
          for (var k = 0; k < this.listKeyword.length; k++) {
            this.lastIdKw = +Math.max(Number(this.lastIdKw), Number(this.listKeyword[k].id))
          }
          if(!this.lastIdKw){
            this.lastIdKw=0
          }
          this.refreshData()
        }
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );

    this.httpClient.get<any[]>(this.globalService.baseLink+'/autors.json').subscribe(
      (response) => {
        if (!response){
          this.listAutor = [];
          this.lastIdAutor = 0;
        } else {
          var lKeys = Object.keys(response)
          var listObject: Auteur[] = [];
          lKeys.forEach(function (kw) {
            var oneAutor = new Auteur()
            oneAutor.fromHashMap(response[kw])
            listObject.push(oneAutor)
          })
          this.listAutor = listObject.slice();
          this.lastIdAutor = 0;
          for (var k = 0; k < this.listAutor.length; k++) {
            this.lastIdAutor = +Math.max(Number(this.lastIdAutor), Number(this.listAutor[k].id))
          }
          if(!this.lastIdAutor){
            this.lastIdAutor=0
          }
        }
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );

    this.httpClient.get<any[]>(this.globalService.baseLink+'/secteurs.json').subscribe(
      (response) => {
        if (!response){
          this.listSecteurs = [];
        } else {
          this.listSecteurs = response.slice();
        }
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );

    this.httpClient.get<any[]>(this.globalService.baseLink+'/types.json').subscribe(
      (response) => {
        if(!response){
          this.listTypes = [];
        } else{
          this.listTypes = response.slice();
        }
        
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );

    var basePdfLink = this.basePdfLink
    this.httpClient.get<any[]>(this.globalService.baseLink+'/offers.json').subscribe(
      (response) => {
        if (!response){
          this.listOffers = [];
          this.lastIdOffre = 0;
        } else {
          var lKeys = Object.keys(response)
          var listObject: Offre[] = [];
          lKeys.forEach(function (kw) {
            var oneOffre = new Offre()
            oneOffre.fromHashMap(response[kw])
            oneOffre.linkPDF = oneOffre.linkPDF.replace(basePdfLink, '')
            listObject.push(oneOffre)
          })
          this.listOffers = listObject.slice();
          this.lastIdOffre = 0;
          for (var k = 0; k < this.listOffers.length; k++) {
            this.lastIdOffre = +Math.max(Number(this.lastIdOffre), Number(this.listOffers[k].id))
          }
          if(!this.lastIdOffre){
            this.lastIdOffre=0
          }
          this.refreshData()
        }
      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );

  }


  filter() {
    if (this.entryToEdit === 'keyword') {
      var listKwToDisplay: Keyword[] = [];
      for (var k = 0; k < this.listKeyword.length; k++) {
        if (this.listKeyword[k].key.toLowerCase().startsWith(this.filterText.toLowerCase())) {
          listKwToDisplay.push(this.listKeyword[k])
        }
      }

      this.dataSourceKeyword = new MatTableDataSource<Keyword>(listKwToDisplay);
    } else if (this.entryToEdit === 'autor') {
      var listAutorToDisplay: Auteur[] = [];
      for (var k = 0; k < this.listAutor.length; k++) {
        if (this.listAutor[k].prenom.toLowerCase().startsWith(this.filterText.toLowerCase())) {
          listAutorToDisplay.push(this.listAutor[k])
        }
      }

      this.dataSourceAutor = new MatTableDataSource<Auteur>(listAutorToDisplay);
    }

    else if (this.entryToEdit === 'offerCarr') {
      var listOfferToDisplay: Offre[] = [];
      for (var k = 0; k < this.listOffers.length; k++) {
        if (this.listOffers[k].title.toLowerCase().startsWith(this.filterText.toLowerCase())) {
          listOfferToDisplay.push(this.listOffers[k])
        }
      }

      this.dataSourceOffers = new MatTableDataSource<Offre>(listOfferToDisplay);
    }

  }

  openPopup() {
    if (this.mode === "Suppression") {
      this.isDeletePopup = true;
    } else {
      this.isAddOrEditPopup = true;
    }
  }

  closePopup() {
    this.isDeletePopup = false;
    this.isAddOrEditPopup = false;
    this.newKeyword = new Keyword();
    this.newAutor = new Auteur();
    this.newOffre = new Offre();
  }

  addItem() {
    this.mode = "Ajout"
    this.openPopup();
  }

  editItem(idItem: Number) {
    this.mode = "Édition"
    if (this.entryToEdit === 'keyword') {
      for (var k = 0; k < this.listKeyword.length; k++) {
        if (this.listKeyword[k].id === idItem) {
          this.newKeyword = this.listKeyword[k].copy()
        }
      }
    } else if (this.entryToEdit === 'autor') {
      for (var k = 0; k < this.listAutor.length; k++) {
        if (this.listAutor[k].id === idItem) {
          this.newAutor = this.listAutor[k].copy()
        }
      }
    } else if (this.entryToEdit === 'offerCarr') {
      for (var k = 0; k < this.listOffers.length; k++) {
        if (this.listOffers[k].id === idItem) {
          this.newOffre = this.listOffers[k].copy()
        }
      }
      this.newOffre.linkPDF = this.newOffre.linkPDF.replace('.pdf', '')
    }
    this.openPopup();
  }

  deleteItem(idItem: Number) {
    this.mode = "Suppression";
    if (this.entryToEdit === 'keyword') {
      for (var k = 0; k < this.listKeyword.length; k++) {
        if (this.listKeyword[k].id === idItem) {
          this.newKeyword = this.listKeyword[k].copy()
        }
      }
    } else if (this.entryToEdit === 'autor') {
      for (var k = 0; k < this.listAutor.length; k++) {
        if (this.listAutor[k].id === idItem) {
          this.newAutor = this.listAutor[k].copy()
        }
      }
    } else if (this.entryToEdit === 'offerCarr') {
      for (var k = 0; k < this.listOffers.length; k++) {
        if (this.listOffers[k].id === idItem) {
          this.newOffre = this.listOffers[k].copy()
        }
      }
    }
    this.openPopup();
  }

  validateAction() {
    if (this.entryToEdit === 'keyword') {
      if (this.mode === "Ajout") {
        this.newKeyword.id = (+this.lastIdKw) + 1;
        this.lastIdKw = (+this.lastIdKw) + 1;

        this.listKeyword.push(this.newKeyword)

        //AJOUT BASE
        this.httpClient.post(this.globalService.baseLink+'/keywords.json', this.newKeyword).subscribe(
          () => {
            console.log('Enregistrement du mot clé terminé !');
          },
          (error) => {
            console.log('Erreur lors de l\'enregistrment du mot clé! : ' + error);
          }
        );

      } else if (this.mode === "Édition") {
        for (var k = 0; k < this.listKeyword.length; k++) {
          if (this.listKeyword[k].id === this.newKeyword.id) {
            this.listKeyword[k].key = this.newKeyword.key;
            this.listKeyword[k].def = this.newKeyword.def;
          }
        }
        this.httpClient.put(this.globalService.baseLink+'/keywords.json', this.listKeyword).subscribe(
          () => {
            console.log('Edition du mot clé terminée !');
          },
          (error) => {
            console.log('Erreur lors de l\'edition du mot clé! : ' + error);
          }
        );
      } else if (this.mode === "Suppression") {
        var newListKw: Keyword[] = [];
        for (var k = 0; k < this.listKeyword.length; k++) {
          if (this.listKeyword[k].id !== this.newKeyword.id) {
            newListKw.push(this.listKeyword[k])
          }
        }
        this.listKeyword = newListKw.slice();
        this.httpClient.put(this.globalService.baseLink+'/keywords.json', this.listKeyword).subscribe(
          () => {
            console.log('Suppression du mot clé terminée !');
          },
          (error) => {
            console.log('Erreur lors de la suppression du mot clé! : ' + error);
          }
        );
      }
    } else if (this.entryToEdit === 'autor') {
      if (this.mode === "Ajout") {

        this.newAutor.id = (+this.lastIdAutor) + 1;
        this.lastIdAutor = (+this.lastIdAutor) + 1;

        this.listAutor.push(this.newAutor)

        //AJOUT BASE
        this.httpClient.post(this.globalService.baseLink+'/autors.json', this.newAutor).subscribe(
          () => {
            console.log('Enregistrement de l\'auteur terminé !');
          },
          (error) => {
            console.log('Erreur lors de l\'enregistrment de l\'auteur! : ' + error);
          }
        );


      } else if (this.mode === "Édition") {
        for (var k = 0; k < this.listAutor.length; k++) {
          if (this.listAutor[k].id === this.newAutor.id) {
            this.listAutor[k].prenom = this.newAutor.prenom;
            this.listAutor[k].nom = this.newAutor.nom;
            this.listAutor[k].fonction = this.newAutor.fonction;
          }
        }
        this.httpClient.put(this.globalService.baseLink+'/autors.json', this.listAutor).subscribe(
          () => {
            console.log('Edition de l\'auteur terminée !');
          },
          (error) => {
            console.log('Erreur lors de l\'edition de l\'auteur! : ' + error);
          }
        );
      } else if (this.mode === "Suppression") {
        var newListAutor: Auteur[] = [];
        for (var k = 0; k < this.listAutor.length; k++) {
          if (this.listAutor[k].id !== this.newAutor.id) {
            newListAutor.push(this.listAutor[k])
          }
        }
        this.listAutor = newListAutor.slice();
        this.httpClient.put(this.globalService.baseLink+'/autors.json', this.listAutor).subscribe(
          () => {
            console.log('Suppression de l\'auteur terminée !');
          },
          (error) => {
            console.log('Erreur lors de la suppression de l\'auteur! : ' + error);
          }
        );
      }
    } else if (this.entryToEdit === 'offerCarr') {
      if (this.mode === "Ajout") {
        this.newOffre.linkPDF = this.newOffre.linkPDF + ".pdf"
        this.newOffre.id = (+this.lastIdOffre) + 1;
        this.lastIdOffre = (+this.lastIdOffre) + 1;

        this.listOffers.push(this.newOffre)

        var nouvelleOffre = this.newOffre.copy();
        nouvelleOffre.linkPDF = this.basePdfLink + nouvelleOffre.linkPDF

        //AJOUT BASE
        this.httpClient.post(this.globalService.baseLink+'/offers.json', nouvelleOffre).subscribe(
          () => {
            console.log('Enregistrement de l\'offre terminé !');
            this.newOffre = new Offre()
          },
          (error) => {
            console.log('Erreur lors de l\'enregistrment de l\'offre! : ' + error);
          }
        );

      } else if (this.mode === "Édition") {
        for (var k = 0; k < this.listOffers.length; k++) {
          if (this.listOffers[k].id === this.newOffre.id) {
            this.listOffers[k].title = this.newOffre.title;
            this.listOffers[k].linkPDF = this.newOffre.linkPDF;
          }
        }

        //On reforme les liens
        var listOffreWithBaseLink: Offre[] = []
        for (var k = 0; k < this.listOffers.length; k++) {
          var offreToPush = new Offre()
          offreToPush.id = this.listOffers[k].id;
          offreToPush.title = this.listOffers[k].title;
          offreToPush.linkPDF = this.basePdfLink + this.listOffers[k].linkPDF;
          listOffreWithBaseLink.push(offreToPush)
        }

        this.httpClient.put(this.globalService.baseLink+'/offers.json', listOffreWithBaseLink).subscribe(
          () => {
            console.log('Edition de l\'offre terminée !');
          },
          (error) => {
            console.log('Erreur lors de l\'edition de l\'offre! : ' + error);
          }
        );
      } else if (this.mode === "Suppression") {
        var newListOffers: Offre[] = [];
        for (var k = 0; k < this.listOffers.length; k++) {
          if (this.listOffers[k].id !== this.newOffre.id) {
            newListOffers.push(this.listOffers[k])
          }
        }
        this.listOffers = newListOffers.slice();

        //On reforme les liens
        var listOffreWithBaseLink: Offre[] = []
        for (var k = 0; k < this.listOffers.length; k++) {
          var offreToPush = new Offre()
          offreToPush.id = this.listOffers[k].id;
          offreToPush.title = this.listOffers[k].title;
          offreToPush.linkPDF = this.basePdfLink + this.listOffers[k].linkPDF;
          listOffreWithBaseLink.push(offreToPush)
        }

        this.httpClient.put(this.globalService.baseLink+'/offers.json', listOffreWithBaseLink).subscribe(
          () => {
            console.log('Suppression de l\'offre terminée !');
          },
          (error) => {
            console.log('Erreur lors de la suppression de l\'offre! : ' + error);
          }
        );
      }
    }

    this.refreshData();
    this.closePopup();
    this.filter();
  }

  refreshData() {
    this.filterText = "";
    if (this.entryToEdit === 'keyword') {
      this.dataSourceKeyword = new MatTableDataSource<Keyword>(this.listKeyword);
    } else if (this.entryToEdit === 'autor') {
      this.dataSourceAutor = new MatTableDataSource<Auteur>(this.listAutor);
    } else if (this.entryToEdit === 'secteurAndType') {
      this.dataSourceSecteurs = new MatTableDataSource<String>(this.listSecteurs);
      this.dataSourceTypes = new MatTableDataSource<String>(this.listTypes);
    } else if (this.entryToEdit === 'offerCarr') {
      this.dataSourceOffers = new MatTableDataSource<Offre>(this.listOffers);
    }
  }

  deleteItemDirect(keyType: String, element: any) {
    if (keyType === 'sector') {
      var newListSecteurs = []
      for (var k = 0; k < this.listSecteurs.length; k++) {
        if (this.listSecteurs[k] != element) {
          newListSecteurs.push(this.listSecteurs[k])
        }
      }
      this.listSecteurs = newListSecteurs.slice();
      //Changement base
      this.httpClient.put(this.globalService.baseLink+'/secteurs.json', this.listSecteurs).subscribe(
        () => {
          console.log('Suppression du secteur terminée !');
        },
        (error) => {
          console.log('Erreur lors de la suppression du mot secteur! : ' + error);
        }
      );
    } else if (keyType === 'type') {
      var newListTypes = []
      for (var k = 0; k < this.listTypes.length; k++) {
        if (this.listTypes[k] != element) {
          newListTypes.push(this.listTypes[k])
        }
      }
      this.listTypes = newListTypes.slice();
      //Changement base
      this.httpClient.put(this.globalService.baseLink+'/types.json', this.listTypes).subscribe(
        () => {
          console.log('Suppression du type terminée !');
        },
        (error) => {
          console.log('Erreur lors de la suppression du mot type! : ' + error);
        }
      );
    }
    this.refreshData();
  }
}