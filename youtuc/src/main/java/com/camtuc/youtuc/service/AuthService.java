package com.camtuc.youtuc.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.camtuc.youtuc.dto.CadastroDTO;
import com.camtuc.youtuc.dto.LoginDTO;
import com.camtuc.youtuc.dto.SenhaDTO;
import com.camtuc.youtuc.model.AuthModel;
import com.camtuc.youtuc.model.LinkModel;
import com.camtuc.youtuc.model.RecoveryModel;
import com.camtuc.youtuc.model.UserRoleModel;
import com.camtuc.youtuc.model.UsuarioModel;
import com.camtuc.youtuc.repository.AuthRepository;
import com.camtuc.youtuc.repository.LinkRepository;
import com.camtuc.youtuc.repository.RecoveryRepository;
import com.camtuc.youtuc.repository.UsuarioRepository;

@Service
public class AuthService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private LinkRepository linkRepository;

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private RecoveryRepository recoveryRepository;

    public ResponseEntity<?> login(LoginDTO loginDTO) {
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(loginDTO.email());

        if (usuarioOptional.isPresent() && usuarioOptional.get().isValidado()) {
            var usernamePassword = new UsernamePasswordAuthenticationToken(loginDTO.email(), loginDTO.senha());
            try {
                var authentication = this.authenticationManager.authenticate(usernamePassword);
                var token = tokenService.gerarToken((UsuarioModel) authentication.getPrincipal());

                if (authRepository.existsByUsuario(usuarioOptional.get())) {
                    authRepository.expireSession(usuarioOptional.get());
                }

                AuthModel auth = new AuthModel();
                auth.setUsuario(usuarioOptional.get());
                auth.setExpirado(false);
                auth.setUuid(token);
                authRepository.save(auth);

                return ResponseEntity.ok(token);
            } catch (AuthenticationException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<?> cadastrar(CadastroDTO usuarioDTO){

        Optional<UsuarioModel> emailOptional = usuarioRepository.findByEmail(usuarioDTO.getEmail());
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByUsuario(usuarioDTO.getUsuario());

        if(emailOptional.isEmpty()){
            if(usuarioOptional.isEmpty()){
                UsuarioModel usuario = new UsuarioModel();

                usuario.setNome(usuarioDTO.getNome());
                usuario.setEmail(usuarioDTO.getEmail());
                usuario.setUsuario(usuarioDTO.getUsuario());
                usuario.setSenha(new BCryptPasswordEncoder().encode(usuarioDTO.getSenha()));
                usuario.setValidado(false);
                usuario.setVerificado(false);
                usuario.setRole(UserRoleModel.USER);

                usuarioRepository.save(usuario);

                usuarioOptional = usuarioRepository.findByEmail(usuario.getEmail());

                String link = UUID.randomUUID().toString();
                LinkModel novoLink = new LinkModel();
                novoLink.setLink(link);
                novoLink.setUsuario(usuarioOptional.get());
                LocalDateTime expiracao = LocalDateTime.now().plus(15, ChronoUnit.MINUTES);
                novoLink.setCriadoEm(expiracao);
                novoLink.setExpirado(false);

                linkRepository.save(novoLink);

                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(usuarioDTO.getEmail());
                message.setSubject("Confirme seu cadastro");
                message.setText(
                        "Olá! Clique no link a seguir para confirmar seu e-mail: http://localhost:4200/email?l="
                                + link);

                emailSender.send(message);

                return ResponseEntity.ok("Cadastro efetuado. Confirme-o através de seu e-mail.");
            }else{
                return ResponseEntity.badRequest().body("Esse usuário já existe.");
            }
        }else{
            return ResponseEntity.badRequest().body("Esse email já existe.");
        }
    }

    public ResponseEntity<?> verificarSessao(String token){
        Optional<AuthModel> sessao = authRepository.findByUuid(token);

        if(sessao.isPresent() && !sessao.get().isExpirado()){
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<?> encerrarSessao(String token){
        Optional<AuthModel> sessao = authRepository.findByUuid(token);
        if(sessao.isPresent() && !sessao.get().isExpirado()){
            AuthModel auth = sessao.get();
            auth.setExpirado(true);
            authRepository.save(auth);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<?> validarEmail(String uuid){
        Optional<LinkModel> linkOptional = linkRepository.findById(uuid);
        if(linkOptional.isPresent() && !linkOptional.get().isExpirado() && !linkOptional.get().getUsuario().isValidado()){
            UsuarioModel usuario = linkOptional.get().getUsuario();
            usuario.setValidado(true);
            usuarioRepository.save(usuario);

            LinkModel link = linkOptional.get();
            link.setExpirado(true);
            linkRepository.save(link);

            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<?> reenviarEmail(String link){
        Optional<LinkModel> linkOptional = linkRepository.findById(link);

        if(linkOptional.isPresent()){
            if(!linkOptional.get().getUsuario().isValidado()){
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(linkOptional.get().getUsuario().getEmail());
                message.setSubject("Confirme seu cadastro");
                message.setText(
                "Olá! Clique no link a seguir para confirmar seu e-mail: http://localhost:4200/email?l="
                                + linkOptional.get().getLink());
                emailSender.send(message);
                return ResponseEntity.ok().build();
            }else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    public ResponseEntity<?> confirmarEmail(String email){
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);

        if(usuarioOptional.isPresent()){
            if(usuarioOptional.get().isValidado()){
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            Optional<LinkModel> linkOptional = linkRepository.findByUsuarioId(usuarioOptional.get().getId());
            
            if(linkOptional.isPresent()){
                linkRepository.deleteById(linkOptional.get().getLink());

                String link = UUID.randomUUID().toString();
                LinkModel novoLink = new LinkModel();
                novoLink.setLink(link);
                novoLink.setUsuario(usuarioOptional.get());
                LocalDateTime expiracao = LocalDateTime.now().plus(15, ChronoUnit.MINUTES);
                novoLink.setCriadoEm(expiracao);
                novoLink.setExpirado(false);

                linkRepository.save(novoLink);
                
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(usuarioOptional.get().getEmail());
                message.setSubject("Confirme seu cadastro");
                message.setText(
                "Olá! Clique no link a seguir para confirmar seu e-mail: http://localhost:4200/email?l="
                                    + link);
                emailSender.send(message);
                return ResponseEntity.ok().build();
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<?> recuperarSenha(String email){
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);

        if(usuarioOptional.isPresent()){
            Optional<RecoveryModel> recoveryOptional = recoveryRepository.findByUsuarioId(usuarioOptional.get().getId());
            
            if(recoveryOptional.isPresent()){
                recoveryRepository.delete(recoveryOptional.get());
            }

            String link = UUID.randomUUID().toString();
            RecoveryModel novoLink = new RecoveryModel();
            novoLink.setLink(link);
            novoLink.setUsuario(usuarioOptional.get());
            LocalDateTime expiracao = LocalDateTime.now().plus(15, ChronoUnit.MINUTES);
            novoLink.setCriadoEm(expiracao);
            novoLink.setExpirado(false);

            recoveryRepository.save(novoLink);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(usuarioOptional.get().getEmail());
            message.setSubject("Recupere sua conta");
            message.setText(
            "Olá! Clique no link a seguir para redefinir sua senha: http://localhost:4200/new-password?l="
                                + link);
            emailSender.send(message);

            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<?> redefinirSenha(SenhaDTO senhaDTO){
        Optional<RecoveryModel> recoveryOptional = recoveryRepository.findById(senhaDTO.getLink());

        if(recoveryOptional.isPresent()){
            RecoveryModel recovery = recoveryOptional.get();
            if(!recovery.isExpirado()){
                LocalDateTime agora = LocalDateTime.now();
                LocalDateTime criadoEm = recovery.getCriadoEm();

                Duration duracao = Duration.between(criadoEm, agora);
                if (duracao.toMinutes() > 15) {
                    recovery.setExpirado(true);
                    recoveryRepository.save(recovery);

                    return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
                }else{
                    UsuarioModel usuario = recovery.getUsuario();
                    usuario.setSenha(new BCryptPasswordEncoder().encode(senhaDTO.getSenha()));
                    usuarioRepository.save(usuario);

                    recovery.setExpirado(true);
                    recoveryRepository.save(recovery);

                    return ResponseEntity.status(HttpStatus.OK).build();
                }
            }
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
