import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { InViewportModule } from '@thisissoon/angular-inviewport';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppComponent } from './app.component';
import { MiniatureArticleSmallComponent } from './objects/miniature-article-small/miniature-article-small.component';
import { MiniatureArticleComponent } from './objects/miniature-article/miniature-article.component';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { GlobalService } from './global.service';
import { ArticleComponent } from './blog/article/article.component';
import { SafeHtmlPipe } from './blog/article/article.component';
import { BlogService } from './blog/blog.service';
import { AdminGateComponent } from './admin/admin-gate/admin-gate.component';
import { AdminPannelComponent } from './admin/admin-pannel/admin-pannel.component';
import { StatisticsPannelComponent } from './admin/admin-pannel/statistics-pannel/statistics-pannel.component'; 
import { BlogAdminComponent } from './admin/admin-pannel/blog-admin/blog-admin.component';
import { AdminService } from './admin/admin.service';
import { WritingPannelComponent } from './admin/admin-pannel/blog-admin/writing-pannel/writing-pannel.component';
import { EditingPannelComponent } from './admin/admin-pannel/blog-admin/editing-pannel/editing-pannel.component';
import { SettingPannelComponent } from './admin/admin-pannel/blog-admin/setting-pannel/setting-pannel.component';

import {APP_BASE_HREF} from '@angular/common';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'admin', component: AdminGateComponent },
  { path: 'admin/pannel', canActivate: [AdminService], component: AdminPannelComponent},
  { path: 'admin/pannel/statistics', canActivate: [AdminService], component: StatisticsPannelComponent},
  { path: 'admin/pannel/blogModeration', canActivate: [AdminService], component: BlogAdminComponent},
  { path: 'admin/pannel/blogModeration/write', canActivate: [AdminService], component: WritingPannelComponent},
  { path: 'admin/pannel/blogModeration/edit', canActivate: [AdminService], component: EditingPannelComponent},
  { path: 'admin/pannel/blogModeration/settings', canActivate: [AdminService], component: SettingPannelComponent},
];

@NgModule({
  imports:      [ BrowserModule, FormsModule, RouterModule.forRoot(appRoutes), MatSelectModule,MatTableModule,MatInputModule,BrowserAnimationsModule, HttpClientModule, CKEditorModule, MatCheckboxModule, InViewportModule],
  declarations: [ AppComponent, MiniatureArticleSmallComponent,MiniatureArticleComponent, HomeComponent, BlogComponent, ArticleComponent, AdminGateComponent, AdminPannelComponent, StatisticsPannelComponent, BlogAdminComponent, WritingPannelComponent, EditingPannelComponent, SettingPannelComponent,SafeHtmlPipe ],
  bootstrap:    [ AppComponent ],
  providers: [GlobalService, BlogService, AdminService, {provide: APP_BASE_HREF, useValue: ''}]
})
export class AppModule { }
