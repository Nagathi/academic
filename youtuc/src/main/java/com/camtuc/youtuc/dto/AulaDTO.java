package com.camtuc.youtuc.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AulaDTO {

    private String titulo;
    private String descricao;
    private Integer ordem;
    private Long disciplinaId;
    
}
