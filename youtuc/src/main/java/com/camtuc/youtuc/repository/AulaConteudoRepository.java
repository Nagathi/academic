package com.camtuc.youtuc.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.camtuc.youtuc.model.AulaConteudoModel;

@Repository
public interface AulaConteudoRepository extends CrudRepository<AulaConteudoModel, Long> {
    public Iterable<AulaConteudoModel> findAllByAulaId(Long aulaId);
}
