package com.jayjayrj.controlefinanceiro.infrastructure.repository;

import com.jayjayrj.controlefinanceiro.infrastructure.entity.CartaoCreditoEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CartaoCreditoRepository extends MongoRepository<CartaoCreditoEntity, Integer> {
}
