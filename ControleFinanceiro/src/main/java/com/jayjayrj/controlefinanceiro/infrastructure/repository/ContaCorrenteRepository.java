package com.jayjayrj.controlefinanceiro.infrastructure.repository;

import com.jayjayrj.controlefinanceiro.infrastructure.entity.ContaCorrenteEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ContaCorrenteRepository extends MongoRepository<ContaCorrenteEntity, Integer> {
    ContaCorrenteEntity findByNumeroAgenciaAndNumeroConta(Long numeroAgencia, Long numeroConta);
    Optional<ContaCorrenteEntity> findById(Integer id);
}
