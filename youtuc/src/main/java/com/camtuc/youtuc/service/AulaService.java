package com.camtuc.youtuc.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.camtuc.youtuc.dto.AulaDTO;
import com.camtuc.youtuc.dto.ConteudoDTO;
import com.camtuc.youtuc.model.AulaModel;
import com.camtuc.youtuc.repository.AulaRepository;

@Service
public class AulaService {

    private AulaRepository aulaRepository;

    public ResponseEntity<?> cadastrarAula(AulaDTO aulaDTO) {
        AulaModel aula = new AulaModel();
        aula.setTitulo(aulaDTO.getTitulo());
        aula.setDescricao(aulaDTO.getDescricao());
        aula.setOrdem(aulaDTO.getOrdem());
        AulaModel resposta = aulaRepository.save(aula);
        if (resposta == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> cadastrarConteudo(ConteudoDTO conteudoDTO) {
        return ResponseEntity.ok().build();
    }
    
}
