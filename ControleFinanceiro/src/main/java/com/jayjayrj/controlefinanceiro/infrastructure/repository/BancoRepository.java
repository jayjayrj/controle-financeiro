package com.jayjayrj.controlefinanceiro.infrastructure.repository;

import com.jayjayrj.controlefinanceiro.infrastructure.entity.BancoEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.UsuarioEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BancoRepository extends MongoRepository<BancoEntity, Integer> {
    BancoEntity findByNome(String nome);
}
