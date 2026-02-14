package com.camtuc.youtuc.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConteudoDisciplinaDTO {

    private Long id;
    private String imagem;
    private String titulo;
    private String ano;
    private String cursos;
    private String autor;
    private String foto;
    private String descricao;
    private List<AulaDTO> aulas;

}
