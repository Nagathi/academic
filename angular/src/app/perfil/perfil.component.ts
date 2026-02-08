import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from '../services/http.service';
import { environment } from 'src/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  @ViewChild('filePicker') filePicker!: ElementRef<HTMLInputElement>;
  @ViewChild('imageDisplay') imageDisplay!: ElementRef<HTMLImageElement>;

  private readonly apiUrl = environment.apiURL;

  foto = "assets/svg/avatar.svg";
  imagem = "assets/svg/sem-imagem.svg";
  nome = "";
  usuario = "";

  editar: boolean = false;
  loading: boolean = false;
  disciplinas: any[] = []
  itensPorPagina = 6;
  paginaAtual = 1;

  constructor(private http: HttpService){

  }

  ngOnInit(){
    this.carregarDados();
    this.carregarDisciplinas();
  }

  onClick() {
    this.editar = true;
  }

  cancelar() {
    this.editar = false;
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

  carregarImagem(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.foto = e.target.result;
        this.imageDisplay.nativeElement.style.display = 'block';
      };
      reader.readAsDataURL(inputElement.files[0]);
    }
  }

  carregarDados(){
    this.http.carregarDados().subscribe(
      (response: any) => {
        if(response.foto != null){
          this.foto = `${this.apiUrl}/usuarios/fotos/` + response.foto;
        }
        if(response.imagem != null){
          this.imagem = `${this.apiUrl}/disciplinas/` + response.imagem;
        }
        this.nome = response.nome;
        this.usuario = response.usuario;
      }
    )
  }

  salvarDados() {
    this.loading = true;
    const token = localStorage.getItem("token");
    const formData: FormData = new FormData();

    if (token !== null) {
      formData.append('token', token);
    }

    formData.append('nome', this.nome);
    formData.append('usuario', this.usuario);

    if (this.filePicker.nativeElement.files && this.filePicker.nativeElement.files[0]) {
        formData.append('foto', this.filePicker.nativeElement.files[0]);
    }
  
    this.http.salvarDados(formData).subscribe(
      (response: any) => {
        this.editar = false;
        this.loading = false;
      },
      (error: any) => {
        console.error('Erro ao salvar dados:', error);
        this.loading = false;
      }
    );
  }

  carregarDisciplinas(){
    this.http.carregarMinhasDisciplinas().subscribe(
      response => {
        this.disciplinas = response;

        this.disciplinas.forEach(disciplina => {
          if (disciplina.imagem !== null) {
            disciplina.imagem = `${this.apiUrl}/disciplinas/` + disciplina.imagem;
          }
        });
      }
    )
  }

}
