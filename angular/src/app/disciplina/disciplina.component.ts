import { Component } from '@angular/core';
import { HttpService } from '../services/http.service';
import { environment } from 'src/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-disciplina',
  templateUrl: './disciplina.component.html',
  styleUrls: ['./disciplina.component.css']
})
export class DisciplinaComponent {
  nomeDisciplina: string = '';
  nomeProfessor: string = '';
  anoMinistracao: number = 0;
  fotoProfessor: string = '/assets/placeholder-professor.jpg';
  cursos: string[] = [];
  descricao: string = '';
  conteudos: any[] = [];

  constructor(private http: HttpService, 
              private route: ActivatedRoute) {}

  ngOnInit() {
    let id: any = 0;
    this.route.queryParamMap.subscribe(params => {
      id = params.get('d');
    });

    this.http.verDisciplina(id).then(
      (response: any) => {
        this.nomeDisciplina = response.titulo;
        this.nomeProfessor = response.autor;
        this.anoMinistracao = response.ano;
        this.fotoProfessor = `${environment.apiURL}/usuarios/fotos/${response.foto}` || '/assets/svg/avatar.svg';
        this.cursos = response.cursos ? response.cursos.split(',') : [];
        this.descricao = response.descricao || '';
        this.conteudos = response.aulas || [];
      },
      (error) => {
        console.error('Erro ao obter detalhes da disciplina:', error);
      }
    );
  }

  getTipoIcon(tipo: string): string {
    const icons: any = {
      'video': 'fas fa-video',
      'slides': 'fas fa-presentation',
      'documento': 'fas fa-file-pdf'
    };
    return icons[tipo] || 'fas fa-file';
  }

  formatarCurso(nome: string): string {
  if (!nome) return '';
    const mapa: any = {
      computacao: 'Computação',
      ambiental: 'Ambiental',
      civil: 'Civil',
      eletrica: 'Elétrica',
      mecanica: 'Mecânica'
    };

    const chave = nome.toLowerCase().trim();

    if (mapa[chave]) return mapa[chave];

    return chave.charAt(0).toUpperCase() + chave.slice(1);
  }

}
