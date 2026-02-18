package com.camtuc.youtuc.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.camtuc.youtuc.model.AulaModel;
import com.camtuc.youtuc.model.DisciplinaModel;

@Repository
public interface AulaRepository extends CrudRepository<AulaModel, Long> {
    List<AulaModel> findAulasByDisciplina(DisciplinaModel disciplina);
    int countByDisciplinaId(Long disciplinaId);
}
