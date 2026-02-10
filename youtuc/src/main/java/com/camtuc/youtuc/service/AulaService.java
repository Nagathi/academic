package com.camtuc.youtuc.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.camtuc.youtuc.dto.ArquivoConteudoDTO;
import com.camtuc.youtuc.dto.AulaDTO;
import com.camtuc.youtuc.dto.VideoConteudoDTO;
import com.camtuc.youtuc.model.AulaConteudoModel;
import com.camtuc.youtuc.model.AulaModel;
import com.camtuc.youtuc.repository.AulaConteudoRepository;
import com.camtuc.youtuc.repository.AulaRepository;

@Service
public class AulaService {

    @Autowired
    private AulaRepository aulaRepository;

    @Autowired
    private AulaConteudoRepository aulaConteudoRepository;

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
    
}
