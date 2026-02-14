package com.camtuc.youtuc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.camtuc.youtuc.dto.DisciplinaDTO;
import com.camtuc.youtuc.dto.EditarCursosDTO;
import com.camtuc.youtuc.dto.EditarDescricaoDTO;
import com.camtuc.youtuc.dto.EditarTituloDTO;
import com.camtuc.youtuc.service.DisciplinaService;


@RequestMapping("/disciplina")
@RestController
public class DisciplinaController {

    @Autowired
    private DisciplinaService disciplinaService;

    @PostMapping(value = "/nova-disciplina", consumes = "multipart/form-data")
    public ResponseEntity<?> cadastrarDisciplina(@RequestParam("titulo") String titulo,
                                                 @RequestParam("ano") String ano,
                                                 @RequestParam("token") String token,
                                                 @RequestParam(value = "cursos", required = false) String cursos,
                                                 @RequestPart(value = "imagem", required = false) MultipartFile imagem,
                                                 @RequestParam(value = "descricao", required = false) String descricao) {
        if (imagem != null && !imagem.isEmpty()) {
            long maxBytes = 50L * 1024L * 1024L;
            if (imagem.getSize() > maxBytes) {
                return ResponseEntity.status(413).body("Arquivo muito grande. Tamanho máximo permitido: 50MB");
            }

            String contentType = imagem.getContentType();
            if (contentType == null || !(contentType.equalsIgnoreCase("image/png")
                    || contentType.equalsIgnoreCase("image/jpeg")
                    || contentType.equalsIgnoreCase("image/jpg")
                    || contentType.equalsIgnoreCase("image/gif")
                    || contentType.equalsIgnoreCase("image/webp")
                    || contentType.equalsIgnoreCase("image/bmp")
                    || contentType.equalsIgnoreCase("image/svg+xml"))) {
                return ResponseEntity.status(415).body("Tipo de mídia não suportado");
            }
        }

        DisciplinaDTO disciplinaDTO = new DisciplinaDTO();
        disciplinaDTO.setToken(token);
        disciplinaDTO.setImagem(imagem);
        disciplinaDTO.setTitulo(titulo);
        disciplinaDTO.setAno(ano);
        disciplinaDTO.setCursos(cursos);
        disciplinaDTO.setDescricao(descricao);
        
        return disciplinaService.cadastrarDisciplina(disciplinaDTO);
    }

    @GetMapping("/minhas-disciplinas/{token}")
    public ResponseEntity<?> obterDisciplinasPorUsuario(@PathVariable String token){
        return disciplinaService.obterDisciplinasPorUsuario(token);
    }

    @GetMapping("/lista-disciplinas")
    public ResponseEntity<?> obterDisciplinas(){
        return disciplinaService.obterDisciplinas();
    }

    @GetMapping("/mostra-disciplina")
    public ResponseEntity<?> verDisciplina(@RequestParam Long id){
        return disciplinaService.verDisciplina(id);
    }

    @PostMapping("/novo-titulo")
    public ResponseEntity<?> editarTitulo(@RequestBody EditarTituloDTO editarTituloDTO){
        return disciplinaService.editarTitulo(editarTituloDTO.getTitulo(), editarTituloDTO.getId(), editarTituloDTO.getToken());
    }
    
    @PostMapping("/nova-descricao")
    public ResponseEntity<?> editarDescricao(@RequestBody EditarDescricaoDTO editarDescricaoDTO){
        return disciplinaService.editarDescricao(editarDescricaoDTO.getDescricao(), editarDescricaoDTO.getId(), editarDescricaoDTO.getToken());
    }
    
    @PostMapping("/novos-cursos")
    public ResponseEntity<?> editarCursos(@RequestBody EditarCursosDTO editarCursosDTO){
        return disciplinaService.editarCursos(editarCursosDTO.getCursos(), editarCursosDTO.getId(), editarCursosDTO.getToken());
    }
    
    
}