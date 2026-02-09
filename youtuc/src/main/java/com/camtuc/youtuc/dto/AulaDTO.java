package com.camtuc.youtuc.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AulaDTO {

    private String titulo;
    private String descricao;
    private List<MultipartFile> arquivos;
    
}
