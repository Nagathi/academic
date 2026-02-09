package com.camtuc.youtuc.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.camtuc.youtuc.dto.AulaDTO;
import com.camtuc.youtuc.service.AulaService;

@RequestMapping("/aula")
@RestController
public class AulaController {

    private AulaService aulaService;

    @PostMapping("/nova-aula")
    private ResponseEntity<?> cadastrarAula(@RequestParam("titulo") String titulo,
                                            @RequestParam("descricao") String descricao,
                                            @RequestParam("disciplina_id") Long disciplinaId,
                                            @RequestParam("ordem") Integer ordem) {

        AulaDTO aulaDTO = new AulaDTO();
        aulaDTO.setTitulo(titulo);
        aulaDTO.setDescricao(descricao);
        aulaDTO.setDisciplinaId(disciplinaId);
        aulaDTO.setOrdem(ordem);


        return aulaService.cadastrarAula(aulaDTO);
    }


    
}
