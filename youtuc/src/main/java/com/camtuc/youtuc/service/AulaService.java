package com.camtuc.youtuc.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.camtuc.youtuc.dto.ArquivoConteudoDTO;
import com.camtuc.youtuc.dto.AulaDTO;
import com.camtuc.youtuc.dto.VideoConteudoDTO;
import com.camtuc.youtuc.dto.ViewAulaDTO;
import com.camtuc.youtuc.dto.ViewConteudoDTO;
import com.camtuc.youtuc.model.AulaConteudoModel;
import com.camtuc.youtuc.model.AulaModel;
import com.camtuc.youtuc.model.UsuarioModel;
import com.camtuc.youtuc.repository.AulaConteudoRepository;
import com.camtuc.youtuc.repository.AulaRepository;
import com.camtuc.youtuc.repository.UsuarioRepository;

@Service
public class AulaService {

    @Autowired
    private AulaRepository aulaRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AulaConteudoRepository aulaConteudoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

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

    public ResponseEntity<?> adicionarArquivo(ArquivoConteudoDTO arquivoDTO) {
        Long aulaId = arquivoDTO.getAulaId();
        Long disciplinaId = aulaRepository.findById(aulaId).get().getDisciplina().getId();

        String diretorioAtual = System.getProperty("user.dir");
        String caminhoRelativo = "/youtuc/src/media/disciplinas/"+ "Disciplina" + disciplinaId + "/Aula" + aulaId;
        String caminhoAbsoluto = diretorioAtual + caminhoRelativo;

        File novaPasta = new File(caminhoAbsoluto);

        if (!novaPasta.exists()) {
            novaPasta.mkdirs();
        }

        if(arquivoDTO.getArquivo() != null){
            String uploadVideo = caminhoAbsoluto;
            String uniqueImageName = UUID.randomUUID().toString() + "_" + arquivoDTO.getArquivo().getOriginalFilename();

            Path destinoVideo = Path.of(uploadVideo, uniqueImageName);
            try {
                Files.copy(arquivoDTO.getArquivo().getInputStream(), destinoVideo, StandardCopyOption.REPLACE_EXISTING);

                AulaConteudoModel aula = new AulaConteudoModel();
                aula.setTipo("arquivo");
                aula.setTitulo(arquivoDTO.getArquivo().getOriginalFilename());
                aula.setDescricao(arquivoDTO.getDescricao());
                aula.setUrl(destinoVideo.toString());
                aula.setAula(aulaRepository.findById(arquivoDTO.getAulaId()).get());
                
                aulaConteudoRepository.save(aula);

                return ResponseEntity.ok().build();
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }

        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<?> adicionarVideo(VideoConteudoDTO videoDTO) {

        AulaConteudoModel aula = new AulaConteudoModel();
        aula.setTipo("video");
        aula.setTitulo(videoDTO.getTitulo());
        aula.setDescricao(videoDTO.getDescricao());
        aula.setUrl(videoDTO.getVideo());
        aula.setAula(aulaRepository.findById(videoDTO.getAulaId()).get());

        aulaConteudoRepository.save(aula);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> mostrarAula(Long id, String token) {

        String email = tokenService.validarToken(token);
    
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);

        AulaModel aula = aulaRepository.findById(id).orElse(null);
        if(aula == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aula não encontrada.");
        }

        if(aula.getDisciplina().getUsuario().getId().equals(usuarioOptional.get().getId())){
            ViewAulaDTO viewAulaDTO = new ViewAulaDTO();
            viewAulaDTO.setId(aula.getId());
            viewAulaDTO.setTitulo(aula.getTitulo());
            viewAulaDTO.setDescricao(aula.getDescricao());

            Iterable<AulaConteudoModel> aulaConteudos = aulaConteudoRepository.findAllByAulaId(aula.getId());
            List<ViewConteudoDTO> conteudos = new ArrayList<ViewConteudoDTO>();

            for (AulaConteudoModel conteudo : aulaConteudos) {
                ViewConteudoDTO viewConteudoDTO = new ViewConteudoDTO();
                viewConteudoDTO.setId(conteudo.getId());
                viewConteudoDTO.setTitulo(conteudo.getTitulo());
                viewConteudoDTO.setDescricao(conteudo.getDescricao());
                viewConteudoDTO.setTipo(conteudo.getTipo());
                viewConteudoDTO.setUrl(conteudo.getUrl());

                conteudos.add(viewConteudoDTO);
            }

            viewAulaDTO.setConteudos(conteudos);

            return ResponseEntity.ok(viewAulaDTO);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para visualizar esta aula.");
        }
    }

    public ResponseEntity<?> excluirConteudo(Long aulaId, String token) {
        String email = tokenService.validarToken(token);
    
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);

        if(usuarioOptional.isPresent()){
            AulaModel aula = aulaRepository.findById(aulaId).orElse(null);
            aulaRepository.delete(aula);
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para editar esta disciplina.");
        }
    }
    
}
