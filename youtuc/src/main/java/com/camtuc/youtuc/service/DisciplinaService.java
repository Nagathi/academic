package com.camtuc.youtuc.service;

import java.io.File;
import java.io.IOException;
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

import com.camtuc.youtuc.dto.DisciplinaDTO;
import com.camtuc.youtuc.dto.SectionDisciplinaDTO;
import com.camtuc.youtuc.model.DisciplinaModel;
import com.camtuc.youtuc.model.UsuarioModel;
import com.camtuc.youtuc.repository.DisciplinaRepository;
import com.camtuc.youtuc.repository.UsuarioRepository;

@Service
public class DisciplinaService {

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenService tokenService;
    

    public ResponseEntity<?> cadastrarDisciplina(DisciplinaDTO disciplinaDTO){

        try {
            String email = tokenService.validarToken(disciplinaDTO.getToken());
    
            Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);

            if(usuarioOptional.isPresent()){
                DisciplinaModel disciplina = new DisciplinaModel();
                disciplina.setTitulo(disciplinaDTO.getTitulo());
                disciplina.setAno(disciplinaDTO.getAno());
                disciplina.setUsuario(usuarioOptional.get());

                DisciplinaModel disciplinaSalva = disciplinaRepository.save(disciplina);

                Long id = disciplinaSalva.getId();

                String diretorioAtual = System.getProperty("user.dir");
                String caminhoRelativo = "/youtuc/src/media/disciplinas/Disciplina " + id;
                String caminhoAbsoluto = diretorioAtual + caminhoRelativo;

                File novaPasta = new File(caminhoAbsoluto);

                if(!novaPasta.exists()){
                    novaPasta.mkdirs();
                }

                if (disciplinaDTO.getFoto() != null){
                    String uploadImagem = caminhoAbsoluto;
                    String uniqueImageName = UUID.randomUUID().toString() + "_" + disciplinaDTO.getFoto().getOriginalFilename();

                    Path destinoImagem = Path.of(uploadImagem, uniqueImageName);
                    Files.copy(disciplinaDTO.getFoto().getInputStream(), destinoImagem, StandardCopyOption.REPLACE_EXISTING);

                    disciplinaSalva.setFoto("Disciplina #" + id + "/" + uniqueImageName);

                    disciplinaRepository.save(disciplinaSalva);
                }

                return ResponseEntity.status(HttpStatus.OK).build();
            
            }
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ocorreu um erro de validação.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar o upload da imagem.");
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar a solicitação.");
        }
    }

    public ResponseEntity<?> obterDisciplinasPorUsuario(String token){

        String email = tokenService.validarToken(token);

        Optional<UsuarioModel> usuarioOptional = usuarioRepository.findByEmail(email);

        if(usuarioOptional.isPresent()){
            List<DisciplinaModel> disciplinas = disciplinaRepository.findDisciplinasByUsuario(usuarioOptional.get());
            List<SectionDisciplinaDTO> disciplinasDTO = new ArrayList<>();

            if(disciplinas.isEmpty()){
                return ResponseEntity.status(HttpStatus.OK).body("Não possui disciplinas");
            }

            for(DisciplinaModel disciplina : disciplinas){
                SectionDisciplinaDTO disciplinaDTO = new SectionDisciplinaDTO();

                disciplinaDTO.setId(disciplina.getId());
                disciplinaDTO.setFoto(disciplina.getFoto());
                disciplinaDTO.setTitulo(disciplina.getTitulo());
                disciplinaDTO.setAno(disciplina.getAno());
                disciplinaDTO.setNome(disciplina.getUsuario().getNome());

                disciplinasDTO.add(disciplinaDTO);
            }
            
            return ResponseEntity.status(HttpStatus.OK).body(disciplinasDTO);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
    
}
