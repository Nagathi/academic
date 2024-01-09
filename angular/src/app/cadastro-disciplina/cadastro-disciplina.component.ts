import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Conteudo } from '../models/disciplina.model';

@Component({
  selector: 'app-cadastro-disciplina',
  templateUrl: './cadastro-disciplina.component.html',
  styleUrls: ['./cadastro-disciplina.component.css']
})
export class CadastroDisciplinaComponent implements OnInit {
  disciplinaForm!: FormGroup;
  conteudos: Conteudo[] = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.disciplinaForm = this.formBuilder.group({
      nomeDisciplina: ['', Validators.required],
      ano: ['', Validators.required]
    });
  }

  adicionarConteudo(): void {
    this.conteudos.push({
      titulo: '',
      anexo: '',
      descricao: ''
    });
  }

  removerConteudo(index: number): void {
    this.conteudos.splice(index, 1);
  }

  toggleInputType(index: number): void {
    const fileInput = document.getElementById(`anexo${index}`) as HTMLInputElement;

    if (fileInput) {
      if (fileInput.type === 'text') {
        fileInput.type = 'file';
      } else {
        fileInput.type = 'text';
      }
    }
  }

  salvarDisciplina(): void {
    const disciplina = this.disciplinaForm.value;
    console.log('Disciplina:', disciplina);
    console.log('Conteúdos:', this.conteudos);
  }

  isString(value: any): boolean {
    return typeof value !== 'string';
  }
}
