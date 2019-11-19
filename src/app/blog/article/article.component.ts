import { Component, ViewEncapsulation, OnInit, Input, Pipe, PipeTransform, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';

import { BlogService } from '../blog.service';
import { GlobalService } from '../../global.service';

import { HttpClient } from '@angular/common/http';

import { Article } from '../../classes/articles/article'
import { Keyword } from '../../classes/articles/keyword'

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss', './article.component.responsive.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit, OnChanges {

  @Input() article: Article;

  isOneWordHovered: Boolean = false;
  styleTooltip: SafeStyle;
  keywordHovered = "Aliquam"
  descHovered = "Mauris consequat eros elit, sit amet commodo dui ultricies id. Donec in dapibus ipsum. Phasellus imperdiet, arcu at feugiat consequat."
  corpsArticleFilled: String;
  mapDefinition: any = {};

  listKeywords: Keyword[] = [];
  listKeywordsSubscription: Subscription;

  isFrSelected: Boolean;
  isEnSelected: Boolean;

  isShowSource: Boolean = false;

  constructor(private blogService: BlogService, private globalService: GlobalService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private httpClient: HttpClient, private translate: TranslateService) { }

  ngOnInit() {
    //On incrémente le nombre de vues
    this.blogService.incrementVues(this.article.id)

    this.isFrSelected = this.globalService.isFrSelected;
    this.isEnSelected = this.globalService.isEnSelected;
    if (this.isFrSelected) {
      this.translate.use('fr');
    } else {
      this.translate.use('en');
    }

    document.body.addEventListener('mouseover', (e) => {
      this.printDescWord((e.target as HTMLTextAreaElement).id);
    });

    $("#corps")[0].addEventListener('click', (e) => {
      this.printDescWord((e.target as HTMLTextAreaElement).id)
    });

    this.listKeywordsSubscription = this.blogService.listKeywordsSubject.subscribe(
      (listKeywords: any[]) => {
        this.listKeywords = listKeywords;
        this.fillMapDefinition();
      }
    );
    this.blogService.emitListKeywordsSubject();
    this.fillMapDefinition();
    this.generateCorpsArticle()
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      this.blogService.incrementVues(this.article.id)

      this.isFrSelected = this.globalService.isFrSelected;
      this.isEnSelected = this.globalService.isEnSelected;
      if (this.isFrSelected) {
        this.translate.use('fr');
      } else {
        this.translate.use('en');
      }

      document.body.addEventListener('mouseover', (e) => {
        this.printDescWord((e.target as HTMLTextAreaElement).id);
      });

      $("#corps")[0].addEventListener('click', function (e) {
        this.printDescWord((e.target as HTMLTextAreaElement).id)
      });

      this.listKeywordsSubscription = this.blogService.listKeywordsSubject.subscribe(
        (listKeywords: any[]) => {
          this.listKeywords = listKeywords;
          this.fillMapDefinition();
        }
      );
      this.blogService.emitListKeywordsSubject();
      this.fillMapDefinition();
      this.generateCorpsArticle()
    }, 100)
  }

  openPopup(keyOrigin: String) {
    this.globalService.managePopup(keyOrigin);
  }

  printDescWord(wordId: String) {
    if (wordId != "" && wordId.startsWith("word")) {
      //déplacement du tooltip
      var wordKey = wordId.split("-")[1].replace(/\_/g, " ")
      var topValue = $("#" + wordId)[0].offsetTop + 26
      var leftValue = Math.max($("#" + wordId)[0].offsetLeft - 100, 0)
      this.styleTooltip = this.sanitizer.bypassSecurityTrustStyle("left:" + leftValue + "px; top:" + topValue + "px;")
      //maj mot et def
      this.keywordHovered = wordKey.substring(0, 1).toUpperCase() + wordKey.substring(1, wordKey.length)
      this.descHovered = this.mapDefinition["" + wordKey]
      this.isOneWordHovered = true
    } else {
      this.isOneWordHovered = false;
    }

  }

  fillMapDefinition() {
    if (Object.keys(this.mapDefinition).length > 0) {
      return;
    }
    if (this.listKeywords.length != 0) {
      for (var k = 0; k < this.listKeywords.length; k++) {
        if (this.globalService.isFrSelected && this.listKeywords[k].langue === "FR" || this.globalService.isEnSelected && this.listKeywords[k].langue === "EN") {
          var kw = this.listKeywords[k]
          this.mapDefinition["" + kw.key.toLowerCase()] = kw.def
        }
      }
    } else {
      setTimeout(() => { this.fillMapDefinition() }, 100)
    }
  }

  generateCorpsArticle() {
    var wordsToFind = []
    for (var k = 0; k < Object.keys(this.mapDefinition).length; k++) {
      var word = Object.keys(this.mapDefinition)[k]
      if (this.article.fullText.includes(word)) {
        wordsToFind.push(word)
      }
    }
    console.log("Les mots aillant été reconnus sont : " + wordsToFind) //On a bien les mots
    var regex2 = /([A-zÀ-ú]){2,}/gi;

    var stringCorps = "";
    var listWords = this.article.fullText.split(" ")

    for (var k = 0; k < listWords.length; k++) {

      //Pour chaque mot on va checker en ordre décroissant l'ensemble des i mots suivants
      //On cherche le nombre de mot max reconnu
      for (var limit = 7; limit > 0; limit--) {
        var ensWord = ""
        var limitTempo = limit
        for (var i = 0; i < Math.min(limitTempo, listWords.length - k); i++) {
          var oneWord = ""
          if (listWords[k + i].match(regex2) != null) {
            oneWord = listWords[k + i].match(regex2)[0]
          } else {
            limitTempo += 1
          }
          ensWord += oneWord + " ";
        }
        ensWord = ensWord.trim();
        if (wordsToFind.indexOf(ensWord.toLowerCase()) > -1) {
          console.log("'" + ensWord + "' has been recognized with " + limit + "words")
          k += (limit - 1) //On saute les mots reconnus
          limit = 0 //On quitte la boucle
        }
      }


      if (wordsToFind.indexOf(ensWord.toLowerCase()) > -1) {
        wordsToFind = wordsToFind.splice(0, wordsToFind.indexOf(ensWord.toLowerCase())).concat(wordsToFind.splice(wordsToFind.indexOf(ensWord.toLowerCase()) + 1, wordsToFind.length));
        var newWtf = []
        for (var i = 0; i < wordsToFind.length; i++) {
          if (wordsToFind[i] != ensWord.toLowerCase()) {
            newWtf.push(wordsToFind[i])
          }
        }
        wordsToFind = newWtf.slice()
        var stringReplacement = "<b class='descWord' id='word-" + ensWord.toLowerCase().replace(/ /g, '_') + "'>" + ensWord + "</b>"
        stringCorps += stringReplacement + " "
      } else {
        stringCorps += listWords[k] + " "
      }
    }
    this.corpsArticleFilled = stringCorps;
  }

  invertSource() {
    this.isShowSource = !this.isShowSource
  }
}