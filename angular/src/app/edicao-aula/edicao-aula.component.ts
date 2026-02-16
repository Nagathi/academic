import { Component } from '@angular/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-edicao-aula',
  templateUrl: './edicao-aula.component.html',
  styleUrls: ['./edicao-aula.component.css']
})
export class EdicaoAulaComponent {

  aula: any = null;
  materiais: any[] = [];
  links: any[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.httpService.getAulaById(1).then(
      (response: any) => {
        this.aula = response;

        if (this.aula?.conteudos) {
          this.materiais = this.aula.conteudos.filter((c: any) => c.tipo === 'arquivo');
          this.links = this.aula.conteudos.filter((c: any) => c.tipo === 'video' || c.tipo === 'link');
        }
      },
      (error) => {
        console.error('Erro ao obter aula:', error);
      }
    );
  }

  editarTitulo() {
    
  }

  editarDescricao() {
    
  }

  editarConteudo(item: any) {
    
  }

  adicionarMaterial() {
    
  }

  adicionarLink() {
    
  }
}
