import { Component } from '@angular/core';

@Component({
  selector: 'app-disciplina',
  templateUrl: './disciplina.component.html',
  styleUrls: ['./disciplina.component.css']
})
export class DisciplinaComponent {
  nomeDisciplina: string = 'Desenvolvimento Web';
  nomeProfessor: string = 'Bruno Merlin';
  anoMinistracao: number = 2024;
  fotoProfessor: string = '/assets/placeholder-professor.jpg';
  cursos: string[] = ['Engenharia de Computação', 'Sistemas de Informação'];
  descricao: string = 'Una disciplina que abrange os fundamentos e as práticas modernas de desenvolvimento para web, incluindo frontend, backend e deploy.';

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
    }
  ];

  getTipoIcon(tipo: string): string {
    const icons: any = {
      'video': 'fas fa-video',
      'slides': 'fas fa-presentation',
      'documento': 'fas fa-file-pdf'
    };
    return icons[tipo] || 'fas fa-file';
  }
}
