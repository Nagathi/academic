import { Component } from '@angular/core';

interface Disciplina {
  id: number;
  imagem: string;
  nome: string;
  usuario: {
    nome: string;
    imagem: string;
  };
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  itensPorPagina = 6;
  paginaAtual = 1;

  disciplinas: Disciplina[] = [
    {
      id: 1,
      imagem: 'caminho/para/imagem1.jpg',
      nome: 'Matemática',
      usuario: {
        nome: 'João',
        imagem: 'caminho/para/imagem-usuario1.jpg'
      }
    },
    {
      id: 2,
      imagem: 'caminho/para/imagem2.jpg',
      nome: 'História',
      usuario: {
        nome: 'Maria',
        imagem: 'caminho/para/imagem-usuario2.jpg'
      }
    },
    {
      id: 1,
      imagem: 'caminho/para/imagem1.jpg',
      nome: 'Matemática',
      usuario: {
        nome: 'João',
        imagem: 'caminho/para/imagem-usuario1.jpg'
      }
    },
    {
      id: 2,
      imagem: 'caminho/para/imagem2.jpg',
      nome: 'História',
      usuario: {
        nome: 'Maria',
        imagem: 'caminho/para/imagem-usuario2.jpg'
      }
    },
    {
      id: 1,
      imagem: 'caminho/para/imagem1.jpg',
      nome: 'Matemática',
      usuario: {
        nome: 'João',
        imagem: 'caminho/para/imagem-usuario1.jpg'
      }
    },
    {
      id: 2,
      imagem: 'caminho/para/imagem2.jpg',
      nome: 'História',
      usuario: {
        nome: 'Maria',
        imagem: 'caminho/para/imagem-usuario2.jpg'
      }
    },
    {
      id: 1,
      imagem: 'caminho/para/imagem1.jpg',
      nome: 'Matemática',
      usuario: {
        nome: 'João',
        imagem: 'caminho/para/imagem-usuario1.jpg'
      }
    },
    {
      id: 2,
      imagem: 'caminho/para/imagem2.jpg',
      nome: 'História',
      usuario: {
        nome: 'Maria',
        imagem: 'caminho/para/imagem-usuario2.jpg'
      }
    },
    {
      id: 1,
      imagem: 'caminho/para/imagem1.jpg',
      nome: 'Matemática',
      usuario: {
        nome: 'João',
        imagem: 'caminho/para/imagem-usuario1.jpg'
      }
    },
    {
      id: 2,
      imagem: 'caminho/para/imagem2.jpg',
      nome: 'História',
      usuario: {
        nome: 'Maria',
        imagem: 'caminho/para/imagem-usuario2.jpg'
      }
    },
    {
      id: 1,
      imagem: 'caminho/para/imagem1.jpg',
      nome: 'Matemática',
      usuario: {
        nome: 'João',
        imagem: 'caminho/para/imagem-usuario1.jpg'
      }
    },
    {
      id: 2,
      imagem: 'caminho/para/imagem2.jpg',
      nome: 'História',
      usuario: {
        nome: 'Maria',
        imagem: 'caminho/para/imagem-usuario2.jpg'
      }
    },
  ];

  constructor(){

  }

  ngOnInit() {}

  getSectionsPorPagina(): any[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.disciplinas.slice(inicio, fim);
  }

  totalPaginas(): number {
    return Math.ceil(this.disciplinas.length / this.itensPorPagina);
  }
  
  mudarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaAtual = pagina;
    }
  }
}
