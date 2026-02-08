import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  anoAtual = new Date().getFullYear();

  menuLinks = [
    { label: 'Início', url: '/home' },
    { label: 'Disciplinas', url: '/disciplina' },
    { label: 'Perfil', url: '/perfil' }
  ];

  redeSociais = [
    { icon: 'fab fa-facebook', url: '#', nome: 'Facebook' },
    { icon: 'fab fa-twitter', url: '#', nome: 'Twitter' },
    { icon: 'fab fa-instagram', url: '#', nome: 'Instagram' },
    { icon: 'fab fa-linkedin', url: '#', nome: 'LinkedIn' }
  ];
}
