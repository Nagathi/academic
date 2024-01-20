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

import com.camtuc.youtuc.dto.DadosPerfilDTO;
import com.camtuc.youtuc.service.UsuarioService;


@RequestMapping("/usuario")
@RestController
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/perfil/{token}")
    public ResponseEntity<?> carregarDados(@PathVariable String token){
        return usuarioService.carregarDados(token);
    }

    @PostMapping(value = "/dados", consumes = "multipart/form-data")
    public ResponseEntity<?> salvarDados(@RequestParam("token") String token,
                                         @RequestParam("nome") String nome,
                                         @RequestParam("usuario") String usuario,
                                         @RequestPart(value = "foto", required = false) MultipartFile foto){
        DadosPerfilDTO dadosDTO = new DadosPerfilDTO();
        dadosDTO.setToken(token);
        dadosDTO.setFoto(foto);
        dadosDTO.setNome(nome);
        dadosDTO.setUsuario(usuario);
        
        return usuarioService.salvarDados(dadosDTO);
    }
}
