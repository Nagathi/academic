import { Component } from '@angular/core';
import { HttpService } from '../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalResponseComponent } from '../modais/modal-response/modal-response.component';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {
  link: string = "";
  valido: boolean = false;
  loadingHome: boolean = false;
  loadingResend: boolean = false;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(
      switchMap(params => {
        this.link = params['l'];
        return this.http.validar(this.link);
      })
    ).subscribe(
      (status: string) => {
        if (status === '200') {
          this.valido = true;
        } else if (status === '400') {
          this.valido = false;
        }
      },
      (error: any) => {
      }
    );
  }

  reenviarEmail() {
    this.loadingResend = true;
    this.route.queryParams.pipe(
      switchMap(params => {
        this.link = params['l'];
        return this.http.reenviarEmail(this.link);
      })
    ).subscribe(
      (status: string) => {
        this.loadingResend = false;
        if (status === '200') {
          const conteudo = {
            icon: "correto.png",
            message: "Seu link foi reenviado"
          }
          this.openModal(conteudo);
        } else if (status === '400') {
          const conteudo = {
            icon: "errado.png",
            message: "O link não pode ser reenviado, tente refazer o cadastro."
          }
          this.openModal(conteudo);
        } else if (status === '401') {
          const conteudo = {
            icon: "errado.png",
            message: "Parece que você já utilizou este link, tente fazer login."
          }
          this.openModal(conteudo);
        }
      },
      (error: any) => {
      }
    );
  }

  openModal(conteudo: any): void {
    const dialogRef = this.dialog.open(ModalResponseComponent, {
      data: {
        icon: conteudo.icon,
        message: conteudo.message
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.valido && !this.loadingHome) {
        this.router.navigate(['/home']);
      }
    });
  }
}
