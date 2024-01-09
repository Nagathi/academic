import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLogged: boolean = false;
  private authSubscription: Subscription;

  constructor(private http: HttpService,
              private authService: AuthService) {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => {
        this.isLogged = isLoggedIn;
      }
    );
  }

  ngOnInit(){
    this.http.autorizar();
  }

  sair(){
    this.http.encerrarSessao();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
