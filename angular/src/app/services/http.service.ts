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
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

  token: string = "";
  private disciplinasCache: any[] | null = null;
  private disciplinasCacheTimestamp: number = 0;

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

  getListaDisciplinas(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const agora = Date.now();
      const cacheValido = this.disciplinasCache && (agora - this.disciplinasCacheTimestamp) < this.CACHE_TTL_MS;

      if (cacheValido) {
        resolve(this.disciplinasCache!);
        return;
      }

      this.http.get<any[]>(`${this.apiUrl}/disciplina/lista-disciplinas`).subscribe(
        (response: any[]) => {
          this.disciplinasCache = response;
          this.disciplinasCacheTimestamp = agora;
          resolve(response);
        },
        (error: HttpErrorResponse) => {
          reject('Erro ao carregar disciplinas.');
        }
      );
    });
  }

  limparCacheDisciplinas(): void {
    this.disciplinasCache = null;
    this.disciplinasCacheTimestamp = 0;
  }

  verDisciplina(id: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get<any>(`${this.apiUrl}/disciplina/mostra-disciplina?id=${id}`).subscribe(
        (response: any) => {
          resolve(response);
        },
        (error: HttpErrorResponse) => {
          reject('Erro ao carregar disciplina.');
        }
      );
    });
  }

  editarTitulo(titulo: string, id: number): Promise<string> {
    const token = localStorage.getItem("token");

    return new Promise<string>((resolve, reject) => {
      this.http.post(`${this.apiUrl}/disciplina/novo-titulo`, {id, titulo, token}).subscribe(
        (response) => {
          resolve('200');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 200) {
            resolve('200');
          } else if (error.status === 400) {
            resolve('400');
          } else if (error.status === 401) {
            resolve('401');
          } else {
            reject('Erro inesperado');
          }
        }
      );
    });
  }

  editarDescricao(descricao: string, id: number): Promise<string> {
    const token = localStorage.getItem("token");

    return new Promise<string>((resolve, reject) => {
      this.http.post(`${this.apiUrl}/disciplina/nova-descricao`, {id, descricao, token}).subscribe(
        (response) => {
          resolve('200');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 200) {
            resolve('200');
          } else if (error.status === 400) {
            resolve('400');
          } else if (error.status === 401) {
            resolve('401');
          } else {
            reject('Erro inesperado');
          }
        }
      );
    });
  }

  editarCursos(cursos: string, id: number): Promise<string> {
    const token = localStorage.getItem("token");

    return new Promise<string>((resolve, reject) => {
      this.http.post(`${this.apiUrl}/disciplina/novos-cursos`, {id, cursos, token}).subscribe(
        (response) => {
          resolve('200');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 200) {
            resolve('200');
          } else if (error.status === 400) {
            resolve('400');
          } else if (error.status === 401) {
            resolve('401');
          } else {
            reject('Erro inesperado');
          }
        }
      );
    });
  }

  excluirAula(id: number): Promise<string> {
    const token = localStorage.getItem("token");

    return new Promise<string>((resolve, reject) => {
      this.http.delete(`${this.apiUrl}/aula/excluir-aula/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe(
        (response) => {
          resolve('200');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 200) {
            resolve('200');
          } else if (error.status === 400) {
            resolve('400');
          } else if (error.status === 401) {
            resolve('401');
          } else {
            reject('Erro inesperado');
          }
        }
      );
    });
   }
    getAulaById(id: number): Promise<any> {
      const token = localStorage.getItem("token");

      return new Promise((resolve, reject) => {
        this.http.get(`${this.apiUrl}/aula/mostra-aula/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).subscribe(
          (response) => resolve(response),
          (error) => reject(error)
        );
      });
    }

    public editarTituloAula(id: number, titulo: string): Promise<string> {
      const token = localStorage.getItem("token");

      return new Promise<string>((resolve, reject) => {
        this.http.put(`${this.apiUrl}/aula/novo-titulo/${id}`, {titulo}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).subscribe(
          (response) => resolve('200'),
          (error: HttpErrorResponse) => {
            if (error.status === 200) {
              resolve('200');
            } else if (error.status === 400) {
              resolve('400');
            } else if (error.status === 401) {
              resolve('401');
            } else {
              reject('Erro inesperado');
            }
          }
        );
      });
    }

    public editarDescricaoAula(id: number, descricao: string): Promise<string> {
      const token = localStorage.getItem("token");

      return new Promise<string>((resolve, reject) => {
        this.http.put(`${this.apiUrl}/aula/nova-descricao/${id}`, {descricao}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).subscribe(
          (response) => resolve('200'),
          (error: HttpErrorResponse) => {
            if (error.status === 200) {
              resolve('200');
            } else if (error.status === 400) {
              resolve('400');
            } else if (error.status === 401) {
              resolve('401');
            } else {
              reject('Erro inesperado');
            }
          }
        );
      });
    }

    public criarAula(id: number, titulo: string, descricao: string): Promise<any> {
      const token = localStorage.getItem("token");
      const payload = {titulo, descricao};

      return new Promise((resolve, reject) => {
        this.http.post(`${this.apiUrl}/aula/nova-aula/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).subscribe(
          (response) => resolve(response),
          (error) => reject(error)
        );
      })
    }

    public enviarArquivoAula(id: number, arquivo: File, titulo: string, descricao: string): Promise<string> {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('arquivo', arquivo);
      formData.append('titulo', titulo);
      formData.append('descricao', descricao);

      return new Promise<string>((resolve, reject) => {
        this.http.post(`${this.apiUrl}/aula/novo-arquivo/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).subscribe(
          (response) => resolve('200'),
          (error: HttpErrorResponse) => {
            if (error.status === 200) {
              resolve('200');
            } else if (error.status === 400) {
              resolve('400');
            } else if (error.status === 401) {
              resolve('401');
            } else {
              reject('Erro inesperado');
            }
          }
        );
      });
    }

    public adicionarLinkAula(id: number, video: string, titulo: string, descricao: string): Promise<string> {
      const token = localStorage.getItem("token");
      const payload = { video, titulo, descricao };

      return new Promise<string>((resolve, reject) => {
        this.http.post(`${this.apiUrl}/aula/novo-video/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).subscribe(
          (response) => resolve('200'),
          (error: HttpErrorResponse) => {
            if (error.status === 200) {
              resolve('200');
            } else if (error.status === 400) {
              resolve('400');
            } else if (error.status === 401) {
              resolve('401');
            } else {
              reject('Erro inesperado');
            }
          }
        );
      });
    }

    public adicionarLinkExternoAula(id: number, url: string, titulo: string, descricao: string): Promise<string> {
      const token = localStorage.getItem("token");
      const payload = { url, titulo, descricao };

      return new Promise<string>((resolve, reject) => {
        this.http.post(`${this.apiUrl}/aula/novo-link/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).subscribe(
          (response) => resolve('200'),
          (error: HttpErrorResponse) => {
            if (error.status === 200) {
              resolve('200');
            } else if (error.status === 400) {
              resolve('400');
            } else if (error.status === 401) {
              resolve('401');
            } else {
              reject('Erro inesperado');
            }
          }
        );
      });
    }

    public editarLinkExternoAula(id: number, url: string, titulo: string, descricao: string): Promise<string> {
      const token = localStorage.getItem("token");
      const payload = { url, titulo, descricao };

      return new Promise<string>((resolve, reject) => {
        this.http.put(`${this.apiUrl}/aula/editar-link-externo/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).subscribe(
          (response) => resolve('200'),
          (error: HttpErrorResponse) => {
            if (error.status === 200) {
              resolve('200');
            } else if (error.status === 400) {
              resolve('400');
            } else if (error.status === 401) {
              resolve('401');
            } else {
              reject('Erro inesperado');
            }
          }
        );
      });
    }

    removerConteudo(id: number): Promise<string> {
      const token = localStorage.getItem("token");

      return new Promise<string>((resolve, reject) => {
        this.http.delete(`${this.apiUrl}/aula/excluir/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).subscribe(
          (response) => resolve('200'),
          (error: HttpErrorResponse) => {
            if (error.status === 200) {
              resolve('200');
            } else if (error.status === 400) {
              resolve('400');
            } else if (error.status === 401) {
              resolve('401');
            } else {
              reject('Erro inesperado');
            }
          }
        );
      });
    }
  } 