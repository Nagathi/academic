package com.camtuc.youtuc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.camtuc.youtuc.dto.DisciplinaDTO;
import com.camtuc.youtuc.service.DisciplinaService;

@RequestMapping("/disciplina")
@RestController
public class DisciplinaController {

    @Autowired
    private DisciplinaService disciplinaService;

    @PostMapping(value = "/nova-disciplina", consumes = "multipart/form-data")
    public ResponseEntity<?> cadastrarDisciplina(@RequestParam("titulo") String titulo,
                                         @RequestParam("ano") String ano,
                                         @RequestParam("token") String token,
                                         @RequestPart(value = "foto", required = false) MultipartFile foto){
        DisciplinaDTO disciplinaDTO = new DisciplinaDTO();
        disciplinaDTO.setToken(token);
        disciplinaDTO.setFoto(foto);
        disciplinaDTO.setTitulo(titulo);
        disciplinaDTO.setAno(ano);
        
        return disciplinaService.cadastrarDisciplina(disciplinaDTO);
    }

    @GetMapping("/minhas-disciplinas/{token}")
    public ResponseEntity<?> obterDisciplinasPorUsuario(@PathVariable String token){
        
        return disciplinaService.obterDisciplinasPorUsuario(token);
    }
}
