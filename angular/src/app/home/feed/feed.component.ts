import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environment';

interface Disciplina {
  id: number;
  foto: string;
  titulo: string;
  autor: string;
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  itensPorPagina = 6;
  paginaAtual = 1;

  disciplinas: Disciplina[] = [];

  constructor(private http: HttpService) {

  }

  ngOnInit() {
      this.listarDisciplinas();
  }

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

  

  listarDisciplinas(): void {
    this.http.getListaDisciplinas().then(
      (response) => {
        this.disciplinas = response.map(disciplina => ({
          ...disciplina,
          foto: `${environment.apiURL}/disciplinas/${disciplina.foto}`
        }));
        console.log(this.disciplinas);
      },
      (error) => {
        alert('Ocorreu um erro ao carregar as disciplinas. Por favor, tente novamente mais tarde.');
      }
    );  
  }

}
