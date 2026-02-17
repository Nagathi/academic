import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-edicao-aula',
  templateUrl: './edicao-aula.component.html',
  styleUrls: ['./edicao-aula.component.css']
})
export class EdicaoAulaComponent {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  aula: any = null;
  materiais: any[] = [];
  links: any[] = [];
  editandoTitulo = false;
  editandoDescricao = false;
  editandoConteudo: any = null;
  arquivo: File | null = null;
  descricaoArquivo: string = '';
  adicionandoArquivo = false;
  tituloArquivo: string = '';

  constructor(private http: HttpService) {}

  ngOnInit() {
    this.http.getAulaById(1).then(
      (response: any) => {
        this.aula = response;

        if (this.aula?.conteudos) {
          this.materiais = this.aula.conteudos.filter((c: any) => c.tipo === 'arquivo');
          this.links = this.aula.conteudos.filter((c: any) => c.tipo === 'video' || c.tipo === 'link');
        }
      }
    );
  }

  editarTitulo() {
    this.editandoTitulo = true;
  }

  salvarTitulo() {
    this.editandoTitulo = false;
    this.http.editarTituloAula(this.aula.id, this.aula.titulo);
  }

  cancelarTitulo() {
    this.editandoTitulo = false;
  }

  editarDescricao() {
    this.editandoDescricao = true;
  }

  salvarDescricao() {
    this.editandoDescricao = false;
    this.http.editarDescricaoAula(this.aula.id, this.aula.descricao);
  }

  cancelarDescricao() {
    this.editandoDescricao = false;
  }

  editarConteudo(item: any) {}

  abrirSeletor() {
    this.fileInput.nativeElement.click();
  }

  arquivoSelecionado(event: any) {
    this.adicionandoArquivo = true;
    const file = event.target.files[0];
    if (file) {
      this.arquivo = file;
    }
  }

  cancelarArquivo() {
    this.arquivo = null;
    this.fileInput.nativeElement.value = '';
  }

  enviarArquivo() {
    if (!this.arquivo) return;
    this.http.enviarArquivoAula(this.aula.id, this.arquivo, this.tituloArquivo, this.descricaoArquivo).then(
      (response: any) => {
        this.materiais.push(response);
        this.cancelarArquivo();
      }
    );
  }

  adicionarLink() {}
}
