import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message: any = "";
  loading: boolean = false;

  constructor(private httpService: HttpService, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  async logar() {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      const usuario = this.loginForm.value;

      try {
        this.message = await this.httpService.login(usuario);
      } catch(error) {
        this.message = error;
      } finally {
        this.loading = false;
      }
    }
  }
}
