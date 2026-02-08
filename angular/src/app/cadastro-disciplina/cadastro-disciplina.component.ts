import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Conteudo } from '../models/disciplina.model';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-cadastro-disciplina',
  templateUrl: './cadastro-disciplina.component.html',
  styleUrls: ['./cadastro-disciplina.component.css']
})
export class CadastroDisciplinaComponent implements OnInit {
  disciplinaForm!: FormGroup;
  conteudos: Conteudo[] = [];
  fotoSelecionada: File | null = null;
  private readonly MAX_BYTES = 50 * 1024 * 1024; // 50MB
  private readonly ALLOWED_TYPES = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'
  ];

  constructor(private formBuilder: FormBuilder,
              private http: HttpService
  ) {}

  ngOnInit(): void {
    this.disciplinaForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      ano: ['', Validators.required],
      foto: [''],
      cursoAmbiental: [false],
      cursoCivil: [false],
      cursoComputacao: [false],
      cursoEletrica: [false],
      cursoMecanica: [false]
    });
  }
  
  salvarDisciplina(): void {
    const formData = new FormData();
    formData.append('titulo', this.disciplinaForm.get('titulo')?.value || '');
    formData.append('ano', this.disciplinaForm.get('ano')?.value || '');
    formData.append('token', localStorage.getItem('token') || '');
    
    const cursosArray: string[] = [];
    if (this.disciplinaForm.get('cursoAmbiental')?.value) cursosArray.push('Ambiental');
    if (this.disciplinaForm.get('cursoCivil')?.value) cursosArray.push('Civil');
    if (this.disciplinaForm.get('cursoComputacao')?.value) cursosArray.push('Computação');
    if (this.disciplinaForm.get('cursoEletrica')?.value) cursosArray.push('Elétrica');
    if (this.disciplinaForm.get('cursoMecanica')?.value) cursosArray.push('Mecânica');
    
    if (cursosArray.length > 0) {
      formData.append('cursos', cursosArray.join(','));
    }
    
    if (this.fotoSelecionada) {
      formData.append('foto', this.fotoSelecionada);
    }

    this.http.salvarDisciplina(formData).then(
      (response) => {
        if (response === '200') {
          alert('Disciplina salva com sucesso!');
          this.disciplinaForm.reset();
        } else if (response === '400') {
          alert('Erro ao salvar disciplina. Verifique os dados e tente novamente.');
        } else if (response === '406') {
          alert('Disciplina já existe. Por favor, escolha outro nome.');
        }
      },
      (error) => {
        alert('Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.');
      }
    );
  }

  onFotoSelecionada(event: any): void {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) {
      this.fotoSelecionada = null;
      this.disciplinaForm.patchValue({ foto: '' });
      return;
    }

    const file = files[0];

    if (file.size > this.MAX_BYTES) {
      alert('Arquivo muito grande. Tamanho máximo permitido: 50MB');
      event.target.value = '';
      this.fotoSelecionada = null;
      this.disciplinaForm.patchValue({ foto: '' });
      return;
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      alert('Tipo de arquivo não suportado. Envie uma imagem (png, jpg, gif, webp, bmp, svg)');
      event.target.value = '';
      this.fotoSelecionada = null;
      this.disciplinaForm.patchValue({ foto: '' });
      return;
    }

    this.fotoSelecionada = file;
    this.disciplinaForm.patchValue({ foto: file.name });
  }
}
