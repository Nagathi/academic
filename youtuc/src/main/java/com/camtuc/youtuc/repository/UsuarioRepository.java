package com.camtuc.youtuc.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import com.camtuc.youtuc.model.UsuarioModel;

@Repository
public interface UsuarioRepository extends CrudRepository <UsuarioModel, String>{
    UserDetails findUserDetailsByEmail(String email);
    Optional<UsuarioModel> findByEmail(String email);
    Optional<UsuarioModel> findByEmailAndSenha(String email, String senha);
    Optional<UsuarioModel> findByUsuario(String usuario);
    boolean existsByUsuario(String usuario);
}
