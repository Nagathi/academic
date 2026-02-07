import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalResponseComponent } from '../modais/modal-response/modal-response.component';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  registerForm: FormGroup;
  mensagem: any = "";
  loading: boolean = false;

  constructor(private http: HttpService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private router: Router) {
    this.registerForm = this.formBuilder.group({
      nome: ['', Validators.required],
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      confirmarSenha: ['', Validators.required]
    });
  }

  async cadastrar() {
    if (this.registerForm.valid && !this.loading) {
      this.loading = true;
      const usuario = this.registerForm.value;

      try {
        this.mensagem = await this.http.cadastrar(usuario);
      } catch(error) {
        this.mensagem = error;
      } finally {
        this.loading = false;
        if (this.mensagem === '200') {
          this.openModal('Sua solicitação foi realizada, para confirmar abra seu email informado e confirme seu cadastro.');
          this.router.navigate(['/email-verification']);
        }
      }
    }
  }

  openModal(message: string): void {
    const dialogRef = this.dialog.open(ModalResponseComponent, {
      data: {
        icon: 'correto.png',
        message: message
      }
    });
  }
}
