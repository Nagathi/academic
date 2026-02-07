package com.camtuc.youtuc.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.camtuc.youtuc.model.AuthModel;
import com.camtuc.youtuc.model.UsuarioModel;

import jakarta.transaction.Transactional;

@Repository
public interface AuthRepository extends CrudRepository <AuthModel, String>{
    boolean existsByUsuario(UsuarioModel usuario);
    Optional<AuthModel> findByUuid(String usuario);

    @Transactional
    @Modifying
    @Query("UPDATE AuthModel a SET a.expirado = true WHERE a.usuario = :usuario AND a.expirado = false")
    void expireSession(UsuarioModel usuario);
}