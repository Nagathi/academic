import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { DisciplinaComponent } from './disciplina/disciplina.component';
import { CadastroDisciplinaComponent } from './cadastro-disciplina/cadastro-disciplina.component';
import { PerfilComponent } from './perfil/perfil.component';
import { EmailComponent } from './email/email.component';
import { EnviarEmailComponent } from './enviar-email/enviar-email.component';
import { NovaSenhaComponent } from './nova-senha/nova-senha.component';
import { EditorComponent } from './editor/editor.component';
import { EdicaoAulaComponent } from './edicao-aula/edicao-aula.component';
import { AulaComponent } from './aula/aula.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'index', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'disciplina', component: DisciplinaComponent },
  { path: 'cadastro-disciplina', component: CadastroDisciplinaComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'email', component: EmailComponent },
  { path: 'account-recovery', component: EnviarEmailComponent },
  { path: 'email-verification', component: EnviarEmailComponent },
  { path: 'new-password', component: NovaSenhaComponent },
  { path: 'editor', component: EditorComponent },
  { path: 'edit-aula', component: EdicaoAulaComponent },
  { path: 'aula', component: AulaComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
