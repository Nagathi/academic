import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../services/http.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-aula',
  templateUrl: './aula.component.html',
  styleUrls: ['./aula.component.css']
})
export class AulaComponent implements OnInit {

  aula: any = null;
  loading = true;
  erro = '';
  apiUrl = this.http.getUrl();

  videoAtual: any = null;
  videoEmbed: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('a');

      if (!id) {
        this.erro = 'Aula inválida';
        this.loading = false;
        return;
      }

      this.http.getAulaById(Number(id)).then(
        (res: any) => {
          this.aula = res;

          const vids = this.videos;
          this.videoAtual = vids.length ? vids[0] : null;

          if (this.videoAtual) {
            this.videoEmbed = this.getYoutubeEmbed(this.videoAtual.url);
          }

          this.loading = false;
        },
        () => {
          this.erro = 'Erro ao carregar aula';
          this.loading = false;
        }
      );
    });
  }

  selecionarVideo(v: any) {
    this.videoAtual = v;
    this.videoEmbed = this.getYoutubeEmbed(v?.url);
  }

  getYoutubeEmbed(url: string | undefined): SafeResourceUrl | null {
    if (!url) return null;

    const id = this.extrairIdYoutube(url);
    if (!id) return null;

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}`
    );
  }

  extrairIdYoutube(url: string | undefined): string | null {
    if (!url) return null;

    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  }

  get videos() {
    return this.aula?.conteudos?.filter((c: any) => c.tipo === 'video') || [];
  }

  get materiais() {
    return this.aula?.conteudos?.filter((c: any) => c.tipo === 'arquivo') || [];
  }

  get links() {
    return this.aula?.conteudos?.filter((c: any) => c.tipo === 'link') || [];
  }
}