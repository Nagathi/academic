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
      ano: ['', Validators.required],
      foto: ['']
    });
  }
  
  salvarDisciplina(): void {
    const disciplina = this.disciplinaForm.value;
    console.log('Disciplina:', disciplina);
  }
}
