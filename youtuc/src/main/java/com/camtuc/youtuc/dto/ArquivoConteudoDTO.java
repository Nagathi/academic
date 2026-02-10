package com.camtuc.youtuc.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArquivoConteudoDTO {
    private Long aulaId;
    private MultipartFile arquivo;
    private String titulo;
    private String descricao;
}

