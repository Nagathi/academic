package com.camtuc.youtuc.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.camtuc.youtuc.model.LinkModel;

public interface LinkRepository extends CrudRepository<LinkModel, String> {
    Optional<LinkModel> findByUsuarioId(String usuario_id);
}
