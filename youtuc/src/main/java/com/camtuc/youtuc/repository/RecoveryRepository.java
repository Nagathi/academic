package com.camtuc.youtuc.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.camtuc.youtuc.model.RecoveryModel;

@Repository
public interface RecoveryRepository extends CrudRepository<RecoveryModel, String> {
    Optional<RecoveryModel> findByUsuarioId(String usuario_id);
}
