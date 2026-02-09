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

import com.camtuc.youtuc.dto.BannerDisciplinaDTO;
import com.camtuc.youtuc.dto.ConteudoDisciplinaDTO;
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
                disciplina.setCursos(disciplinaDTO.getCursos());
                disciplina.setUsuario(usuarioOptional.get());
                disciplina.setDescricao(disciplinaDTO.getDescricao());

                DisciplinaModel disciplinaSalva = disciplinaRepository.save(disciplina);

                Long id = disciplinaSalva.getId();

                String diretorioAtual = System.getProperty("user.dir");
                String caminhoRelativo = "/youtuc/src/media/disciplinas/Disciplina" + id;
                String caminhoAbsoluto = diretorioAtual + caminhoRelativo;

                File novaPasta = new File(caminhoAbsoluto);

                if(!novaPasta.exists()){
                    novaPasta.mkdirs();
                }

                if (disciplinaDTO.getImagem() != null){
                    String uploadImagem = caminhoAbsoluto;
                    String uniqueImageName = UUID.randomUUID().toString() + "_" + disciplinaDTO.getImagem().getOriginalFilename();

                    Path destinoImagem = Path.of(uploadImagem, uniqueImageName);
                    Files.copy(disciplinaDTO.getImagem().getInputStream(), destinoImagem, StandardCopyOption.REPLACE_EXISTING);

                    disciplinaSalva.setImagem("Disciplina" + id + "/" + uniqueImageName);

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
                disciplinaDTO.setImagem(disciplina.getImagem());
                disciplinaDTO.setTitulo(disciplina.getTitulo());
                disciplinaDTO.setAno(disciplina.getAno());
                disciplinaDTO.setNome(disciplina.getUsuario().getNome());
                disciplinaDTO.setFoto(disciplina.getUsuario().getFoto());

                disciplinasDTO.add(disciplinaDTO);
            }
            
            return ResponseEntity.status(HttpStatus.OK).body(disciplinasDTO);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    public ResponseEntity<?> obterDisciplinas(){

        Iterable<DisciplinaModel> all = disciplinaRepository.findAll();
        List<DisciplinaModel> list = new ArrayList<>();
        all.forEach(list::add);

        List<BannerDisciplinaDTO> disciplinasDTO = new ArrayList<>();

        list.stream().limit(100).forEach(disciplina -> {
            BannerDisciplinaDTO dto = new BannerDisciplinaDTO();
            dto.setId(disciplina.getId());
            dto.setImagem(disciplina.getImagem());
            dto.setTitulo(disciplina.getTitulo());
            dto.setAno(disciplina.getAno());
            dto.setFoto(disciplina.getUsuario().getFoto());
            dto.setAutor(disciplina.getUsuario().getNome());
            dto.setCursos(disciplina.getCursos());
            disciplinasDTO.add(dto);
        });



        return ResponseEntity.status(HttpStatus.OK).body(disciplinasDTO);

    }

    public ResponseEntity<?> verDisciplina(Long id){
        Optional<DisciplinaModel> disciplinaOptional = disciplinaRepository.findById(id);

        if(disciplinaOptional.isPresent()){
            DisciplinaModel disciplina = disciplinaOptional.get();
            ConteudoDisciplinaDTO disciplinaDTO = new ConteudoDisciplinaDTO();

            disciplinaDTO.setId(disciplina.getId());
            disciplinaDTO.setImagem(disciplina.getImagem());
            disciplinaDTO.setTitulo(disciplina.getTitulo());
            disciplinaDTO.setAno(disciplina.getAno());
            disciplinaDTO.setCursos(disciplina.getCursos());
            disciplinaDTO.setAutor(disciplina.getUsuario().getNome());
            disciplinaDTO.setFoto(disciplina.getUsuario().getFoto());
            disciplinaDTO.setDescricao(disciplina.getDescricao());

            return ResponseEntity.status(HttpStatus.OK).body(disciplinaDTO);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Disciplina não encontrada.");
    }
    
}
