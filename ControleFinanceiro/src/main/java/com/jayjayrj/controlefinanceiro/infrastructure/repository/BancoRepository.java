package com.jayjayrj.controlefinanceiro.infrastructure.repository;

import com.jayjayrj.controlefinanceiro.infrastructure.entity.BancoEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface BancoRepository extends MongoRepository<BancoEntity, Integer> {
    BancoEntity findByNome(String nome);
    BancoEntity findByNumero(String numero);
    Optional<BancoEntity> findById(Integer id);
}
