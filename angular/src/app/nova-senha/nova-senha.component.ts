import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalResponseComponent } from '../modais/modal-response/modal-response.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../services/http.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-nova-senha',
  templateUrl: './nova-senha.component.html',
  styleUrls: ['./nova-senha.component.css']
})
export class NovaSenhaComponent {
  link: any = ""
  resetSenhaForm: FormGroup;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public dialog: MatDialog,
              private http: HttpService,
              private route: ActivatedRoute) {
    this.resetSenhaForm = this.formBuilder.group({
      senha: ['', Validators.required],
      confirmarSenha: ['', Validators.required]
    }, { validators: this.compararSenhas });
  }

  compararSenhas(group: FormGroup) {
    const senha = group?.get('senha')?.value;
    const confirmarSenha = group?.get('confirmarSenha')?.value;

    return senha === confirmarSenha ? null : { senhasDiferentes: true };
  }

  redefinirSenha() {
    if (this.resetSenhaForm.valid && !this.loading) {
      this.loading = true;
      this.route.queryParams.pipe(
        switchMap(params => {
          this.link = params['l'];
          const senha = this.resetSenhaForm.get('senha')?.value;
          const senhaModel = {
            link: this.link,
            senha: senha
          }
          return this.http.redefinirSenha(senhaModel);
        })
      ).subscribe(
          (status: string) => {
            if (status === '200') {
              this.openModal('Senha redefinida com sucesso. Você será redirecionado para a página de login.', 'correto.png');
              this.router.navigate(['/login']);
            }else if(status === '400'){
              this.openModal('Link inválido, peça um novo link de redefinição de senha', 'errado.png');
              this.loading = false;
            }else if(status === '406'){
              this.openModal('Link expirado, peça um novo link de redefinição de senha', 'errado.png');
              this.loading = false;
            }
          }
      )
    }
  }

  openModal(message: string, icon: string): void {
    const dialogRef = this.dialog.open(ModalResponseComponent, {
      data: {
        icon: icon,
        message: message
      }
    });
  }
}
