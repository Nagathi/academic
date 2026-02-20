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
import com.camtuc.youtuc.model.DisciplinaModel;
import com.camtuc.youtuc.model.UsuarioModel;
import com.camtuc.youtuc.repository.AulaConteudoRepository;
import com.camtuc.youtuc.repository.AulaRepository;
import com.camtuc.youtuc.repository.DisciplinaRepository;
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

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public ResponseEntity<?> cadastrarAula(AulaDTO aulaDTO, String token) {
        String email = tokenService.validarToken(token);
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        DisciplinaModel disciplina = disciplinaRepository.findById(aulaDTO.getDisciplinaId()).orElse(null);
        if(disciplina == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Disciplina não encontrada.");
        }

         if(!disciplina.getUsuario().getId().equals(usuarioOptional.get().getId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para editar esta disciplina.");
        }

        AulaModel aula = new AulaModel();
        aula.setTitulo(aulaDTO.getTitulo());
        aula.setDescricao(aulaDTO.getDescricao());
        aula.setOrdem(aulaRepository.countByDisciplinaId(aulaDTO.getDisciplinaId()) + 1);
        aula.setDisciplina(disciplina);
        AulaModel resposta = aulaRepository.save(aula);
        if (resposta == null) {
            return ResponseEntity.badRequest().build();
        }

        AulaDTO respostaDTO = new AulaDTO();
        respostaDTO.setId(resposta.getId());
        respostaDTO.setTitulo(resposta.getTitulo());
        respostaDTO.setDescricao(resposta.getDescricao());
        return ResponseEntity.ok(respostaDTO);
    }

    public ResponseEntity<?> adicionarArquivo(ArquivoConteudoDTO arquivoDTO, String token) {
        String email = tokenService.validarToken(token);
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        System.out.println(arquivoDTO.getAulaId());

        Long aulaId = arquivoDTO.getAulaId();
        Long disciplinaId = aulaRepository.findById(aulaId).get().getDisciplina().getId();

        DisciplinaModel disciplina = disciplinaRepository.findById(disciplinaId).orElse(null);
        if(disciplina == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Disciplina não encontrada.");
        }

         if(!disciplina.getUsuario().getId().equals(usuarioOptional.get().getId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para editar esta disciplina.");
        }

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

            String destinoRelativo = "/disciplinas/Disciplina" + disciplinaId + "/Aula" + aulaId + "/" + uniqueImageName;
            try {
                Files.copy(arquivoDTO.getArquivo().getInputStream(), destinoVideo, StandardCopyOption.REPLACE_EXISTING);

                AulaConteudoModel aula = new AulaConteudoModel();
                aula.setTipo("arquivo");
                aula.setTitulo(arquivoDTO.getArquivo().getOriginalFilename());
                aula.setDescricao(arquivoDTO.getDescricao());
                aula.setUrl(destinoRelativo);
                aula.setAula(aulaRepository.findById(arquivoDTO.getAulaId()).get());
                
                aulaConteudoRepository.save(aula);

                return ResponseEntity.ok().build();
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }

        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<?> adicionarVideo(VideoConteudoDTO videoDTO, String token) {
        String email = tokenService.validarToken(token);
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

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

            if(aulaConteudos == null){
                viewAulaDTO.setConteudos(conteudos);
                return ResponseEntity.ok(viewAulaDTO);
            }

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

    public ResponseEntity<?> adicionarLink(Long aulaId, String titulo, String descricao, String url, String token) {
        String email = tokenService.validarToken(token);
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        AulaConteudoModel aula = new AulaConteudoModel();
        aula.setTipo("link");
        aula.setTitulo(titulo);
        aula.setDescricao(descricao);
        aula.setUrl(url);
        aula.setAula(aulaRepository.findById(aulaId).get());

        aulaConteudoRepository.save(aula);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> excluirAula(Long id, String token) {
        String email = tokenService.validarToken(token);
    
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);

        if(usuarioOptional.isPresent()){
            AulaModel aula = aulaRepository.findById(id).orElse(null);

            if(aula != null){   
                aulaRepository.delete(aula);
                return ResponseEntity.ok().build();
            }else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aula não encontrada.");
            }
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para editar esta disciplina.");
        }
    }

    public ResponseEntity<?> excluirConteudo(Long id, String token) {
        String email = tokenService.validarToken(token);
    
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);

        if(usuarioOptional.isPresent()){
            AulaConteudoModel conteudo = aulaConteudoRepository.findById(id).orElse(null);

            if(conteudo != null){   
                aulaConteudoRepository.delete(conteudo);
                return ResponseEntity.ok().build();
            }else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Conteúdo não encontrado.");
            }
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para editar esta disciplina.");
        }
    }

    public ResponseEntity<?> editarTituloAula(Long aulaId, String novoTitulo, String token) {
        String email = tokenService.validarToken(token);
    
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);

        if(usuarioOptional.isPresent()){
            AulaModel aula = aulaRepository.findById(aulaId).orElse(null);
            if(aula != null){
                aula.setTitulo(novoTitulo);
                aulaRepository.save(aula);
                return ResponseEntity.ok().build();
            }else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aula não encontrada.");
            }
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para editar esta disciplina.");
        }
    }

    public ResponseEntity<?> editarDescricaoAula(Long aulaId, String novaDescricao, String token) {
        String email = tokenService.validarToken(token);
    
        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);

        if(usuarioOptional.isPresent()){
            AulaModel aula = aulaRepository.findById(aulaId).orElse(null);
            if(aula != null){
                aula.setDescricao(novaDescricao);
                aulaRepository.save(aula);
                return ResponseEntity.ok().build();
            }else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aula não encontrada.");
            }
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para editar esta disciplina.");
        }
    }
    
}
