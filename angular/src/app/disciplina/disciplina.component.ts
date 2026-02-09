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

  conteudos: any[] = [
    {
      id: 1,
      titulo: 'Aula 1: Introdução',
      descricao: 'Breve introdução ao conteúdo da disciplina.',
      tipo: 'video',
      anexo: 'https://www.youtube.com/embed/your-video-id'
    },
    {
      id: 2,
      titulo: 'Aula 2: Exemplo Prático',
      descricao: 'Exemplo prático para a compreensão do conteúdo.',
      tipo: 'slides',
      anexo: ''
    },
    {
      id: 3,
      titulo: 'Aula 3: Material Complementar',
      descricao: 'Material complementar para estudo adicional.',
      tipo: 'documento',
      anexo: ''
    },
    {
      id: 4,
      titulo: 'Aula 3: Material Complementar',
      descricao: 'Material complementar para estudo adicional.',
      tipo: 'documento',
      anexo: ''
    },
    {
      id: 5,
      titulo: 'Aula 3: Material Complementar',
      descricao: 'Material complementar para estudo adicional.',
      tipo: 'documento',
      anexo: ''
    },
    {
      id: 6,
      titulo: 'Aula 3: Material Complementar',
      descricao: 'Material complementar para estudo adicional.',
      tipo: 'documento',
      anexo: ''
    },
    {
      id: 7,
      titulo: 'Aula 3: Material Complementar',
      descricao: 'Material complementar para estudo adicional.',
      tipo: 'documento',
      anexo: ''
    }
  ];

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
}
