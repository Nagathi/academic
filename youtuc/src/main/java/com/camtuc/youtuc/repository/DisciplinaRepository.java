package com.camtuc.youtuc.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.camtuc.youtuc.model.DisciplinaModel;
import com.camtuc.youtuc.model.UsuarioModel;

public interface DisciplinaRepository extends CrudRepository<DisciplinaModel, Long> {
    List<DisciplinaModel> findDisciplinasByUsuario(UsuarioModel usuario);
}
