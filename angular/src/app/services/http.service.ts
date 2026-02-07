import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly apiUrl = environment.apiURL;

  token: string = "";

  constructor(private http: HttpClient,
              private auth: AuthService,
              private router: Router) { }

  login(usuario: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.http.post(`${this.apiUrl}/auth/login`, usuario).subscribe(
        (response: any) => {
          const token = response?.token;
          resolve(token);
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            reject('Senha incorreta.');
          } else if (error.status === 404) {
            reject('Usuário não existe.');
          }else if (error.status === 200) {
            this.auth.login();
            localStorage.setItem("token", error.error.text);
            this.router.navigate(['/home']);
            reject('');
          }else {
            reject('Ocorreu um erro inesperado.');
          }
        }
      );
    });
  }

  autorizar(){
    const token = localStorage.getItem("token");
    this.http.post(`${this.apiUrl}/auth/authorization/${token}`, {}).subscribe(
      (response) => {
        this.auth.login();
      },
      (error: HttpErrorResponse) => {
        if (error.status === 200) {
          this.auth.login();
        }
      }
    );
  }

  encerrarSessao(){
    const token = localStorage.getItem("token");
    this.http.post(`${this.apiUrl}/auth/session/${token}`, {}).subscribe(
      (response) => {
        this.auth.logout();
      },
      (error: HttpErrorResponse) => {
        if (error.status === 200) {
          this.auth.logout();
        }
      }
    );
  }

  cadastrar(usuario: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.http.post(`${this.apiUrl}/auth/cadastro`, usuario).subscribe(
        (response: any) => {
          reject('200');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            reject(error.error);
          } else if (error.status === 404) {
            reject('Usuário não existe.');
          }else if (error.status === 200) {
            reject('200');
          }else {
            reject('Ocorreu um erro inesperado.');
          }
        }
      );
    });
  }

  validar(link: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.http.post(`${this.apiUrl}/auth/email/${link}`, {}).subscribe(
        (response) => {
          resolve('200');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 200) {
            resolve('200');
          } else if (error.status === 400) {
            resolve('400');
          } else {
            reject('Erro inesperado');
          }
        }
      );
    });
  }

  reenviarEmail(link: string){
    return new Promise<string>((resolve, reject) => {
      this.http.post(`${this.apiUrl}/auth/novo-email/${link}`, {}).subscribe(
        (response) => {
          resolve('200');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 200) {
            resolve('200');
          } else if (error.status === 400) {
            resolve('400');
          }else if (error.status === 401) {
            resolve('401');
          } else {
            reject('Erro inesperado');
          }
        }
      );
    });
  }

  confirmarEmail(email: string){
    return new Promise<string>((resolve, reject) => {
      this.http.post(`${this.apiUrl}/auth/email-verification/${email}`, {}).subscribe(
        (response) => {
          resolve('200');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 200) {
            resolve('200');
          } else if (error.status === 400) {
            resolve('400');
          }else if (error.status === 404) {
            resolve('404');
          }else if (error.status === 409) {
            resolve('409');
          } else {
            reject('Erro inesperado');
          }
        }
      );
    });
  }

  recuperarSenha(email: string){
    return new Promise<string>((resolve, reject) => {
      this.http.post(`${this.apiUrl}/auth/account-recovery/${email}`, {}).subscribe(
        (response) => {
          resolve('200');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 200) {
            resolve('200');
          } else if (error.status === 404) {
            resolve('404');
          } else {
            reject('Erro inesperado');
          }
        }
      );
    });
  }

  redefinirSenha(senhaModel: any){
    return new Promise<string>((resolve, reject) => {
      this.http.post(`${this.apiUrl}/auth/new-password`, senhaModel).subscribe(
        (response) => {
          resolve('200');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 200) {
            resolve('200');
          }else if (error.status === 400) {
            resolve('400');
          } else if (error.status === 406) {
            resolve('406');
          } else {
            reject('Erro inesperado');
          }
        }
      );
    });
  }

  carregarDados(){
    const token = localStorage.getItem("token");

    return this.http.get(`${this.apiUrl}/usuario/perfil/${token}`);
  }

  salvarDados(dados: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/dados`, dados);
  }

  carregarMinhasDisciplinas(){
    const token = localStorage.getItem("token");
    return this.http.get<[]>(`${this.apiUrl}/disciplina/minhas-disciplinas/${token}`);
  }


  salvarDisciplina(disciplinaModel: any){
    
    return new Promise<string>((resolve, reject) => {
      this.http.post(`${this.apiUrl}/disciplina/nova-disciplina`, disciplinaModel).subscribe(
        (response) => {
          resolve('200');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 200) {
            resolve('200');
          }else if (error.status === 400) {
            resolve('400');
          } else if (error.status === 406) {
            resolve('406');
          } else {
            reject('Erro inesperado');
          }
        }
      );
    });
  }
  
}
