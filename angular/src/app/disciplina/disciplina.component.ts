import { Component } from '@angular/core';

@Component({
  selector: 'app-disciplina',
  templateUrl: './disciplina.component.html',
  styleUrls: ['./disciplina.component.css']
})
export class DisciplinaComponent {
  nomeDisciplina: string = 'Desenvolvimento Web';
  nomeProfessor: string = 'Bruno Merlin';
  anoMinistracao: number = 2022;

  conteudos: any[] = [
    {
      titulo: 'Aula 1: Introdução',
      descricao: 'Breve introdução ao conteúdo da disciplina.',
      anexo: 'https://www.youtube.com/your-video-link'
    },
    {
      titulo: 'Aula 2: Exemplo Prático',
      descricao: 'Exemplo prático para a compreensão do conteúdo.',
      anexo: ''
    },
    {
      titulo: 'Aula 3: Material Complementar',
      descricao: 'Material complementar para estudo adicional.',
      anexo: ''
    }

  ];
}
