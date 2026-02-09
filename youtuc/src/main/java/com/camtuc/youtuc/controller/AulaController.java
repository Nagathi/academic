package com.camtuc.youtuc.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.camtuc.youtuc.service.AulaService;

@RequestMapping("/aula")
@RestController
public class AulaController {

    private AulaService aulaService;

    @PostMapping("/nova-aula")
    private ResponseEntity<?> cadastrarAula(@RequestParam("titulo") String titulo,
                                            @RequestParam("descricao") String descricao,
                                            @RequestPart(value = "arquivos", required = false) List<MultipartFile> arquivos) {


        return ResponseEntity.ok().build();
    }


    
}
