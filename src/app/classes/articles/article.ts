

import { Keyword } from './keyword';
import { Auteur } from './auteur';
import { Secteur } from './secteur';
import { Type } from './type';

interface ArticleData {
  id: Number
  title: String
  langue: String
  type: Type
  srcImg: String
  resume: String
  fullText: String
  sources: String
  listAuteurs: Auteur[]
  listSectors: Secteur[]
  listIdArticlesLies: Number[]
  idArticleTraduit : Number;
  time: String
  difficulte: Number
  vues: Number
  timestamp: Number
}

export class Article {
  id: Number;
  title: String = new String();
  langue: String = new String();
  type: Type = new Type();
  srcImg: String = new String();
  resume: String = new String();
  fullText: String = new String();
  sources: String = new String();
  listAuteurs: Auteur[] = [];
  listSectors: Secteur[] = [];
  listIdArticlesLies: Number[] = [];
  idArticleTraduit : Number =0;
  time: String = new String();
  difficulte: Number = new Number();
  vues: Number = 0;
  timestamp: Number = new Date().getTime();

  print() {
    console.log("id: " + this.id)
    console.log("title: " + this.title)
    console.log("langue: " + this.langue)
    console.log("type: " + this.type)
    console.log("srcImg: " + this.srcImg)
    console.log("resume: " + this.resume)
    console.log("fullText: " + this.fullText)
    console.log("time: " + this.time)
    console.log("timestamp: " + this.timestamp)
    console.log("difficulte: " + this.difficulte)
    console.log("vues: " + this.vues)
    console.log("idArticleTraduit: " + this.idArticleTraduit)
    console.log("listSources: ")
    console.log("sources" + this.sources)
    console.log("listAuteurs: ")
    console.log(this.listAuteurs)
    this.listAuteurs.forEach(function (autor) {
      console.log("- " + autor.prenom + " " + autor.nom)
    })
    console.log("listSectors: ")
    this.listSectors.forEach(function (sector) {
      console.log("- " + sector.key)
    })
    console.log("listIdArticlesLies: ")
    this.listIdArticlesLies.forEach(function (id) {
      console.log("- " + id)
    })
  }

  fromHashMap(data: ArticleData) {
    this.id = Number(data.id);
    this.title = String(data.title);
    this.langue = String(data.langue);
    this.type = data.type;
    this.srcImg = String(data.srcImg);
    this.resume = String(data.resume);
    this.fullText = String(data.fullText);
    this.difficulte = Number(data.difficulte);
    this.vues = Number(data.vues);
    this.idArticleTraduit = Number(data.idArticleTraduit);
    this.time = String(data.time);
    this.timestamp = Number(data.timestamp);
    this.sources = String(data.sources);
    this.listAuteurs = data.listAuteurs;
    this.listSectors = data.listSectors;
    this.listIdArticlesLies = data.listIdArticlesLies;
    if (!this.listAuteurs) {
      this.listAuteurs = []
    }
    if (!this.listSectors) {
      this.listSectors = []
    }
    if (!this.listIdArticlesLies) {
      this.listIdArticlesLies = []
    }

    /*this.listSources=[]
    for (var k=0; k<data.listSources.length; k++){
      var oneSource = new Source();
      oneSource.fromHashMap(data.listSources[k])
      this.listSources.push(oneSource)
    }

    this.listAuteurs=[]
    for (var k=0; k<data.listAuteurs.length; k++){
      var oneAuteur = new Auteur();
      oneAuteur.fromHashMap(data.listAuteurs[k])
      this.listAuteurs.push(oneAuteur)
    }

    this.listSectors=[]
    for (var k=0; k<data.listSectors.length; k++){
      var oneAut = new String();
      oneAuteur.fromHashMap(data.listSectors[k])
      this.listAuteurs.push(oneAuteur)
    }*/
  }
  /*setTitle(title : String){
    this.title = title;
  }

  setType(type : String){
    this.type = type;
  }

  setSrcImg(srcImg : String){
    this.srcImg = srcImg;
  }

  setFullText(fullText : String){
    this.fullText = fullText;
  }

  setListSources(listSources : Source[]){
    this.listSources = listSources;
  }

  setListKeyWords(listKeyWords : Keyword[]){
    this.listKeyWords = listKeyWords;
  }

  setListAuteurs(listAuteurs : Auteur[]){
    this.listAuteurs = listAuteurs;
  }

  setListSectors(listSectors : String[]){
    this.listSectors = listSectors;
  }

  setTime(time : String){
    this.time = time;
  }

  setDifficulte(difficulte : Number){
    this.difficulte = difficulte;
  }*/
}