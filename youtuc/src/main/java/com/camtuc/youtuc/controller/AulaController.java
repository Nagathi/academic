package com.camtuc.youtuc.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.camtuc.youtuc.dto.ArquivoConteudoDTO;
import com.camtuc.youtuc.dto.AulaDTO;
import com.camtuc.youtuc.dto.VideoConteudoDTO;
import com.camtuc.youtuc.service.AulaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;




@RequestMapping("/aula")
@RestController
public class AulaController {

    @Autowired
    private AulaService aulaService;

    @PostMapping("/nova-aula/{id}")
    private ResponseEntity<?> cadastrarAula(@PathVariable Long id,
                                            @RequestBody Map<String, String> requestBody,
                                            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        AulaDTO aulaDTO = new AulaDTO();
        aulaDTO.setTitulo(requestBody.get("titulo"));
        aulaDTO.setDescricao(requestBody.get("descricao"));
        aulaDTO.setDisciplinaId(id);

        return aulaService.cadastrarAula(aulaDTO, token);
    }

    @PostMapping(value = "/novo-arquivo/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> postArquivo(@RequestParam("titulo") String titulo,
                                         @RequestParam("descricao") String descricao,
                                         @PathVariable Long id,
                                         @RequestPart("arquivo") MultipartFile arquivo,
                                         @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        ArquivoConteudoDTO arquivoDTO = new ArquivoConteudoDTO();
        arquivoDTO.setTitulo(titulo);
        arquivoDTO.setDescricao(descricao);
        arquivoDTO.setAulaId(id);
        arquivoDTO.setArquivo(arquivo);

        return aulaService.adicionarArquivo(arquivoDTO, token);
    }

    @PostMapping(value = "/novo-video/{id}")
    public ResponseEntity<?> postVideo( @PathVariable Long id,
                                        @RequestHeader("Authorization") String authHeader,
                                        @RequestBody Map<String, String> requestBody) {
        String token = authHeader.replace("Bearer ", "");
        
        String titulo = requestBody.get("titulo");
        String descricao = requestBody.get("descricao");
        String video = requestBody.get("video");
        VideoConteudoDTO videoDTO = new VideoConteudoDTO();
        videoDTO.setTitulo(titulo);
        videoDTO.setDescricao(descricao);
        videoDTO.setAulaId(id);
        videoDTO.setVideo(video);

        return aulaService.adicionarVideo(videoDTO, token);
    }

    @GetMapping("/mostra-aula/{id}")
    public ResponseEntity<?> mostrarAula(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        System.out.println("Token recebido: " + token);
        System.out.println("ID da aula: " + id);

        return aulaService.mostrarAula(id, token);
    }

    @PostMapping("/novo-link/{id}")
    public ResponseEntity<?> novoLink(@PathVariable Long id,
                                      @RequestHeader("Authorization") String authHeader,
                                      @RequestBody Map<String, String> requestBody) {
            String token = authHeader.replace("Bearer ", "");
            
            String titulo = requestBody.get("titulo");
            String descricao = requestBody.get("descricao");
            String url = requestBody.get("url");
    
            return aulaService.adicionarLink(id, titulo, descricao, url, token);
    }

    @DeleteMapping("/excluir-aula/{id}")
    public ResponseEntity<?> excluirAula(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return aulaService.excluirAula(id, token);
    }
    
    @DeleteMapping(value = "/excluir/{id}")
    public ResponseEntity<?> excluirConteudo(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return aulaService.excluirConteudo(id, token);
    }

    @PutMapping("/novo-titulo/{id}")
    public ResponseEntity<?> atualizarTitulo(@PathVariable Long id, @RequestBody Map<String, String> requestBody, @RequestHeader("Authorization") String authHeader) {
        String titulo = requestBody.get("titulo");
        String token = authHeader.replace("Bearer ", "");
        return aulaService.editarTituloAula(id, titulo, token);
    }

    @PutMapping("/nova-descricao/{id}")
    public ResponseEntity<?> atualizarDescricao(@PathVariable Long id, @RequestBody Map<String, String> requestBody, @RequestHeader("Authorization") String authHeader) {
        String descricao = requestBody.get("descricao");
        String token = authHeader.replace("Bearer ", "");
        return aulaService.editarDescricaoAula(id, descricao, token);
    }
    
}
