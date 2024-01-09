import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  @ViewChild('filePicker') filePicker!: ElementRef<HTMLInputElement>;
  @ViewChild('imageDisplay') imageDisplay!: ElementRef<HTMLImageElement>;

  foto = "assets/svg/avatar.svg";
  nome = "Gustavo";
  usuario = "gustavo00";

  editar: boolean = false;
  disciplinas: any[] = []
  itensPorPagina = 6;
  paginaAtual = 1;

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

}
