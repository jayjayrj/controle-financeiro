package com.jayjayrj.controlefinanceiro.infrastructure.repository;

import com.jayjayrj.controlefinanceiro.infrastructure.entity.UsuarioEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UsuarioRepository extends MongoRepository<UsuarioEntity, Integer> {

    UsuarioEntity findByEmail(String email);

    UsuarioEntity findByUsuarioAndSenha(String email, String senha);

    @Transactional
    void deleteByEmail(String email);

    List<UsuarioEntity> id(Integer id);
}
