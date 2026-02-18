import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from '../services/http.service';
import { ActivatedRoute } from '@angular/router';

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
  linksExternos: any[] = [];

  editandoTitulo = false;
  editandoDescricao = false;

  arquivo: File | null = null;
  descricaoArquivo = '';
  tituloArquivo = '';
  adicionandoArquivo = false;

  novaUrl = '';
  tituloLink = '';
  descricaoLink = '';
  adicionandoLink = false;

  novoLinkExterno = '';
  tituloLinkExterno = '';
  descricaoLinkExterno = '';
  adicionandoLinkExterno = false;

  toast = '';
  loadingRequisicao = false;

  constructor(private http: HttpService,
              private route: ActivatedRoute
  ) {}

  ngOnInit() {

    let id: any = 0;
    this.route.queryParamMap.subscribe(params => {
      id = params.get('d');
    });

    this.http.getAulaById(id).then((response: any) => {
      this.aula = response;

      if (this.aula?.conteudos) {
        this.materiais = this.aula.conteudos.filter((c: any) => c.tipo === 'arquivo');
        this.links = this.aula.conteudos.filter((c: any) => c.tipo === 'video');
        this.linksExternos = this.aula.conteudos.filter((c: any) => c.tipo === 'link');
      }
    });
  }

  mostrarToast(msg: string) {
    this.toast = msg;
    setTimeout(() => this.toast = '', 2500);
  }

  iniciarLoading() {
    this.loadingRequisicao = true;
  }

  finalizarLoading(msg?: string) {
    this.loadingRequisicao = false;
    if (msg) this.mostrarToast(msg);
  }

  editarTitulo() {
    this.editandoTitulo = true;
  }

  salvarTitulo() {
    this.editandoTitulo = false;
    this.iniciarLoading();
    this.http.editarTituloAula(this.aula.id, this.aula.titulo).then(() => {
      this.finalizarLoading('Título atualizado');
    });
  }

  cancelarTitulo() {
    this.editandoTitulo = false;
  }

  editarDescricao() {
    this.editandoDescricao = true;
  }

  salvarDescricao() {
    this.editandoDescricao = false;
    this.iniciarLoading();
    this.http.editarDescricaoAula(this.aula.id, this.aula.descricao).then(() => {
      this.finalizarLoading('Descrição atualizada');
    });
  }

  cancelarDescricao() {
    this.editandoDescricao = false;
  }

  abrirSeletor() {
    this.fileInput.nativeElement.click();
  }

  arquivoSelecionado(event: any) {
    this.adicionandoArquivo = true;
    const file = event.target.files[0];
    if (file) this.arquivo = file;
  }

  cancelarArquivo() {
    this.arquivo = null;
    this.tituloArquivo = '';
    this.descricaoArquivo = '';
    this.fileInput.nativeElement.value = '';
  }

  enviarArquivo() {
    if (!this.arquivo) return;

    this.iniciarLoading();

    this.http.enviarArquivoAula(
      this.aula.id,
      this.arquivo,
      this.tituloArquivo,
      this.descricaoArquivo
    ).then((response: any) => {
      this.materiais.push(response);
      this.cancelarArquivo();
      this.finalizarLoading('Material enviado');
    });
  }

  adicionarLink() {
    if (!this.novaUrl) {
      this.adicionandoLink = true;
      return;
    }

    this.iniciarLoading();

    this.http.adicionarLinkAula(
      this.aula.id,
      this.novaUrl,
      this.tituloLink,
      this.descricaoLink
    ).then((response: any) => {
      this.links.push(response);
      this.novaUrl = '';
      this.tituloLink = '';
      this.descricaoLink = '';
      this.adicionandoLink = false;
      this.finalizarLoading('Vídeo adicionado');
    });
  }

  criarLinkExterno() {
    if (!this.novoLinkExterno) {
      this.adicionandoLinkExterno = true;
      return;
    }

    this.iniciarLoading();

    this.http.adicionarLinkExternoAula(
      this.aula.id,
      this.novoLinkExterno,
      this.tituloLinkExterno,
      this.descricaoLinkExterno
    ).then((response: any) => {
      this.linksExternos.push(response);
      this.novoLinkExterno = '';
      this.tituloLinkExterno = '';
      this.descricaoLinkExterno = '';
      this.adicionandoLinkExterno = false;
      this.finalizarLoading('Link adicionado');
    });
  }

  removerMaterial(index: number) {
    const confirmacao = confirm('Deseja realmente excluir este material?');
    if (!confirmacao) return;

    const item = this.materiais[index];
    this.iniciarLoading();

    this.http.removerConteudo(item.id).then(() => {
      this.materiais.splice(index, 1);
      this.finalizarLoading('Material removido');
    });
  }

  removerVideo(index: number) {
    const confirmacao = confirm('Deseja realmente excluir este vídeo?');
    if (!confirmacao) return;

    const item = this.links[index];
    this.iniciarLoading();

    this.http.removerConteudo(item.id).then(() => {
      this.links.splice(index, 1);
      this.finalizarLoading('Vídeo removido');
    });
  }

  removerLinkExterno(index: number) {
    const confirmacao = confirm('Deseja realmente excluir este link?');
    if (!confirmacao) return;

    const item = this.linksExternos[index];
    this.iniciarLoading();

    this.http.removerConteudo(item.id).then(() => {
      this.linksExternos.splice(index, 1);
      this.finalizarLoading('Link removido');
    });
  }

}
