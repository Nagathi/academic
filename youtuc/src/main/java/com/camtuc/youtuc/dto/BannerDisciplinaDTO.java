package com.camtuc.youtuc.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BannerDisciplinaDTO {
    private String foto;
    private String  titulo;
    private String ano;
    private String autor;
}