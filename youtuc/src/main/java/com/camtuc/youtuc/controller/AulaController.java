package com.camtuc.youtuc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.camtuc.youtuc.dto.ArquivoConteudoDTO;
import com.camtuc.youtuc.dto.AulaDTO;
import com.camtuc.youtuc.dto.VideoConteudoDTO;
import com.camtuc.youtuc.service.AulaService;


@RequestMapping("/aula")
@RestController
public class AulaController {

    @Autowired
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

    @PostMapping(value = "/novo-arquivo", consumes = "multipart/form-data")
    public ResponseEntity<?> postArquivo(@RequestParam("titulo") String titulo,
                                         @RequestParam("descricao") String descricao,
                                         @RequestParam("aula_id") Long aulaId,
                                         @RequestParam("arquivo") MultipartFile arquivo) {
        ArquivoConteudoDTO arquivoDTO = new ArquivoConteudoDTO();
        arquivoDTO.setTitulo(titulo);
        arquivoDTO.setDescricao(descricao);
        arquivoDTO.setAulaId(aulaId);
        arquivoDTO.setArquivo(arquivo);

        return aulaService.adicionarArquivo(arquivoDTO);
    }

    @PostMapping(value = "/novo-video")
    public ResponseEntity<?> postVideo(@RequestParam("titulo") String titulo,
                                         @RequestParam("descricao") String descricao,
                                         @RequestParam("aula_id") Long aulaId,
                                         @RequestParam("video") String video) {
        VideoConteudoDTO videoDTO = new VideoConteudoDTO();
        videoDTO.setTitulo(titulo);
        videoDTO.setDescricao(descricao);
        videoDTO.setAulaId(aulaId);
        videoDTO.setVideo(video);

        return aulaService.adicionarVideo(videoDTO);
    }
    
}
