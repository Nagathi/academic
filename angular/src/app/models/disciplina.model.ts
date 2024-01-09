export interface Conteudo {
    titulo: string;
    anexo: File | string;
    descricao: string;
  }
  
  export interface Disciplina {
    nomeDisciplina: string;
    ano: number;
    conteudos: Conteudo[];
  }