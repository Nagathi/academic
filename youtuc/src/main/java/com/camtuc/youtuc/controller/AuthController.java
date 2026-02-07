package com.camtuc.youtuc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.camtuc.youtuc.dto.CadastroDTO;
import com.camtuc.youtuc.dto.LoginDTO;
import com.camtuc.youtuc.dto.SenhaDTO;
import com.camtuc.youtuc.service.AuthService;

@RequestMapping("/auth")
@RestController
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> efetuarLogin(@RequestBody LoginDTO loginDTO){
        return authService.login(loginDTO);
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> efetuarCadastro(@RequestBody CadastroDTO usuarioDTO){
        return authService.cadastrar(usuarioDTO);
    }

    @PostMapping("/authorization/{token}")
    public ResponseEntity<?> verificarSessao(@PathVariable String token){
        return authService.verificarSessao(token);
    }

    @PostMapping("/session/{token}")
    public ResponseEntity<?> encerrarSessao(@PathVariable String token){
        return authService.encerrarSessao(token);
    }

    @PostMapping("/email/{uuid}")
    public ResponseEntity<?> validarEmail(@PathVariable String uuid){
        return authService.validarEmail(uuid);
    }

    @PostMapping("/novo-email/{uuid}")
    public ResponseEntity<?> reenviarEmail(@PathVariable String uuid){
        return authService.reenviarEmail(uuid);
    }

    @PostMapping("/email-verification/{email}")
    public ResponseEntity<?> confirmarEmail(@PathVariable String email){
        return authService.confirmarEmail(email);
    }

    @PostMapping("/account-recovery/{email}")
    public ResponseEntity<?> recuperarSenha(@PathVariable String email){
        return authService.recuperarSenha(email);
    }

    @PostMapping("/new-password")
    public ResponseEntity<?> redefinirSenha(@RequestBody SenhaDTO senhaDTO){
        return authService.redefinirSenha(senhaDTO);
    }
}
