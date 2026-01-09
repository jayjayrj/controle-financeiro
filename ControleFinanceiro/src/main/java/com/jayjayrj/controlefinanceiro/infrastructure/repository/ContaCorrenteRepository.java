package com.jayjayrj.controlefinanceiro.infrastructure.repository;

import com.jayjayrj.controlefinanceiro.infrastructure.entity.ContaCorrenteEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContaCorrenteRepository extends MongoRepository<ContaCorrenteEntity, Integer> {
}
