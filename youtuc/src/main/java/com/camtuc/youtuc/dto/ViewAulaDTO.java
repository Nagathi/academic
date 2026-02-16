package com.camtuc.youtuc.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ViewAulaDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private List<ViewConteudoDTO> conteudos;
    
}
