package com.jayjayrj.controlefinanceiro.infrastructure.repository;

import com.jayjayrj.controlefinanceiro.infrastructure.entity.TransacaoEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransacaoRepository extends MongoRepository<TransacaoEntity, Integer> {
}
