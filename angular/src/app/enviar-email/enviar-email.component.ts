import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalResponseComponent } from '../modais/modal-response/modal-response.component';

enum Modo {
  RECUPERAR_SENHA = 'recuperarSenha',
  CONFIRMAR_EMAIL = 'confirmarEmail'
}

@Component({
  selector: 'app-enviar-email',
  templateUrl: './enviar-email.component.html',
  styleUrls: ['./enviar-email.component.css']
})
export class EnviarEmailComponent {
  enviarEmailForm: FormGroup;
  mensagem: any = "";
  loading: boolean = false;
  contador: number = 0;
  modo: Modo = Modo.RECUPERAR_SENHA;
  notFound: boolean = false;

  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    this.enviarEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      if (url.toString().includes('account-recovery')) {
        this.modo = Modo.RECUPERAR_SENHA;
      } else if (url.toString().includes('email-verification')) {
        this.modo = Modo.CONFIRMAR_EMAIL;
      }
    });
  }

  enviarEmail() {
    if (this.enviarEmailForm.valid && !this.loading) {
      this.loading = true;
      const email = this.enviarEmailForm.get('email')?.value;

      if (this.modo === Modo.RECUPERAR_SENHA) {
        this.recuperarSenha(email);
      } else if (this.modo === Modo.CONFIRMAR_EMAIL) {
        this.confirmarEmail(email);
      }
    }
  }

  iniciarContador() {
    this.contador = 30;
    const interval = setInterval(() => {
      this.contador--;
      if (this.contador === 0) {
        clearInterval(interval);
        this.loading = false;
      }
    }, 1000);
  }

  async confirmarEmail(email: any){
    try{
      this.mensagem = await this.http.confirmarEmail(email);
    }catch(error){

    }finally{
      if (this.mensagem === '200') {
        this.openModal('Um novo email de confirmação foi enviado, verifique seu email.');
        this.iniciarContador();
        this.notFound = false;
      }else if(this.mensagem === '400'){
        this.openModal('Parece que estamos com problemas. :(');
      }else if(this.mensagem === '404'){
        this.notFound = true;
        this.contador = 0;
        this.loading = false;
      }else if(this.mensagem === '409'){
        this.openModal('Seu email já está ativo, faça login na plataforma.');
        this.iniciarContador();
        this.notFound = false;
      }
    }
  }

  async recuperarSenha(email: any){
    try{
      this.mensagem = await this.http.recuperarSenha(email);
    }catch(error){

    }finally{
      if (this.mensagem === '200') {
        this.openModal('O email de redefinição foi enviado com sucesso. Abra seu email.');
        this.iniciarContador();
        this.notFound = false;
      }else if(this.mensagem === '404'){
        this.notFound = true;
        this.contador = 0;
        this.loading = false;
      }
    }
  }

  openModal(message: string): void {
    const dialogRef = this.dialog.open(ModalResponseComponent, {
      data: {
        icon: 'gmail.png',
        message: message
      }
    });
  }
}
