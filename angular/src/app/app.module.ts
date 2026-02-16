import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { FeedComponent } from './home/feed/feed.component';
import { CardComponent } from './home/card/card.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DisciplinaComponent } from './disciplina/disciplina.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CadastroDisciplinaComponent } from './cadastro-disciplina/cadastro-disciplina.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalResponseComponent } from './modais/modal-response/modal-response.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmailComponent } from './email/email.component';
import { EnviarEmailComponent } from './enviar-email/enviar-email.component';
import { NovaSenhaComponent } from './nova-senha/nova-senha.component';
import { EditorComponent } from './editor/editor.component';
import { EdicaoAulaComponent } from './edicao-aula/edicao-aula.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    FeedComponent,
    CardComponent,
    CadastroComponent,
    LoginComponent,
    DisciplinaComponent,
    PerfilComponent,
    CadastroDisciplinaComponent,
    ModalResponseComponent,
    EmailComponent,
    EnviarEmailComponent,
    NovaSenhaComponent,
    EditorComponent,
    EdicaoAulaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
