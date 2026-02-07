package com.camtuc.youtuc.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.camtuc.youtuc.dto.DadosPerfilDTO;
import com.camtuc.youtuc.dto.PerfilDTO;
import com.camtuc.youtuc.model.UsuarioModel;
import com.camtuc.youtuc.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenService tokenService;

    public ResponseEntity<?> carregarDados(String token){
        String email = tokenService.validarToken(token);
        
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);

        if(usuarioOptional.isPresent()){
            PerfilDTO perfilDTO = new PerfilDTO();
            perfilDTO.setFoto(usuarioOptional.get().getFoto());
            perfilDTO.setNome(usuarioOptional.get().getNome());
            perfilDTO.setUsuario(usuarioOptional.get().getUsuario());

            return ResponseEntity.status(HttpStatus.OK).body(perfilDTO);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    public ResponseEntity<?> salvarDados(DadosPerfilDTO dadosDTO) {
        try {
            String email = tokenService.validarToken(dadosDTO.getToken());
    
            Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);
    
            if (usuarioOptional.isPresent()) {
                if (!usuarioRepository.existsByUsuario(dadosDTO.getUsuario()) || dadosDTO.getUsuario().equals(usuarioOptional.get().getUsuario())) {
                    UsuarioModel usuario = usuarioOptional.get();
    
                    if (dadosDTO.getFoto() != null) {
                        String diretorioAtual = System.getProperty("user.dir");
                        String caminhoRelativo = "/youtuc/src/media/usuarios/fotos/";
                        String caminhoAbsoluto = diretorioAtual + caminhoRelativo;

                        String uploadImagem = caminhoAbsoluto;
                        String uniqueImageName = UUID.randomUUID().toString() + "_" + dadosDTO.getFoto().getOriginalFilename();
    
                        Path destinoImagem = Path.of(uploadImagem, uniqueImageName);
                        Files.copy(dadosDTO.getFoto().getInputStream(), destinoImagem, StandardCopyOption.REPLACE_EXISTING);
     
                        if(usuario.getFoto() != null){
                            String caminhoCompletoArquivo = Paths.get(uploadImagem, usuario.getFoto()).toString();
                            Files.deleteIfExists(Paths.get(caminhoCompletoArquivo));

                            usuario.setFoto(null);
                        }

                        usuario.setFoto(uniqueImageName);
                    }
    
                    usuario.setNome(dadosDTO.getNome());
                    usuario.setUsuario(dadosDTO.getUsuario());
    
                    usuarioRepository.save(usuario);
    
                    return ResponseEntity.ok().build();
                } else {
                    return ResponseEntity.status(HttpStatus.CONFLICT).build();
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar o upload da imagem.");
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar a solicitação.");
        }
    }
    
}
