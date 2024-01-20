package com.camtuc.youtuc.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DadosPerfilDTO {
    private String token;

    private MultipartFile foto;
    private String nome;
    private String usuario;
}
