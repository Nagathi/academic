import { Component } from '@angular/core';
import { HttpService } from '../services/http.service';
import { environment } from 'src/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {
  nomeDisciplina: string = '';
  nomeProfessor: string = '';
  anoMinistracao: number = 0;
  fotoProfessor: string = '/assets/placeholder-professor.jpg';
  cursos: string[] = [];
  descricao: string = '';
  editandoTitulo = false;
  editandoDescricao = false;
  editandoCursos = false;
  novoCurso = '';

  cursosPossiveis = [
  { nome: 'Computação', valor: 'computacao' },
  { nome: 'Mecânica', valor: 'mecanica' },
  { nome: 'Elétrica', valor: 'eletrica' },
  { nome: 'Civil', valor: 'civil' },
  { nome: 'Ambiental', valor: 'ambiental' }
];

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

  editarDisciplina(){ this.editandoTitulo = true }
  cancelarTitulo(){ this.editandoTitulo = false }

  editarDescricao(){ this.editandoDescricao = true }
  cancelarDescricao(){ this.editandoDescricao = false }

  salvarDisciplina() {
    this.editandoTitulo = false;
    const idDisciplina = Number(this.route.snapshot.queryParamMap.get('d')) || 0;
      this.http.editarTitulo(this.nomeDisciplina,  idDisciplina).then(
        (response) => {
          console.log('Título atualizado com sucesso');
        },
        (error) => {
          console.error('Erro ao atualizar título:', error);
        }
      );
  }

  salvarDescricao() {
    this.editandoDescricao = false;
    const idDisciplina = Number(this.route.snapshot.queryParamMap.get('d')) || 0;
      this.http.editarDescricao(this.descricao,  idDisciplina).then(
        (response) => {
          console.log('Descrição atualizada com sucesso');
        },
        (error) => {
          console.error('Erro ao atualizar descrição:', error);
        }
      );
  }

  backupCursos: string[] = [];

  editarCursos(){
    this.backupCursos = [...this.cursos];
    this.editandoCursos = true;
  }

  cancelarCursos(){
    this.cursos = [...this.backupCursos];
    this.editandoCursos = false;
  }

  toggleCurso(valor:string){
    const i = this.cursos.indexOf(valor);

    if(i >= 0){
      this.cursos.splice(i,1);
    } else {
      this.cursos.push(valor);
    }
  }

  isCursoSelecionado(valor:string){
    return this.cursos.includes(valor);
  }

  getCursoNome(valor:string){
    const c = this.cursosPossiveis.find(x => x.valor === valor);
    return c ? c.nome : valor;
  }

  salvarCursos(){
    this.editandoCursos = false;

    const idDisciplina = Number(this.route.snapshot.queryParamMap.get('d')) || 0;

    const cursosString = this.cursos.join(',');

    this.http.editarCursos(cursosString, idDisciplina).then(
      (e) => console.error(e)
    );
  }

  adicionarCurso(){
    if(!this.novoCurso.trim()) return
    this.cursos.push(this.novoCurso)
    this.novoCurso = ''
  }

  removerCurso(i:number){
    this.cursos.splice(i,1)
  }

  excluirConteudo(conteudo:any){
    if(!confirm(`Tem certeza que deseja excluir o conteúdo "${conteudo.titulo}"?`)) return;

    this.http.excluirConteudo(conteudo.id).then(
      (response) => {
        this.conteudos = this.conteudos.filter((c) => c.id !== conteudo.id);
      },
      (error) => {
        console.error('Erro ao excluir conteúdo:', error);
      }
    );  
  }

  goToAulaEdicao(id:number){
    window.location.href = `/edit-aula?d=${id}`;
  }
}