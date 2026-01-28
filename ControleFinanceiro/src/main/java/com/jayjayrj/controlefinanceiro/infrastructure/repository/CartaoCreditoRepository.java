package com.jayjayrj.controlefinanceiro.infrastructure.repository;

import com.jayjayrj.controlefinanceiro.infrastructure.entity.CartaoCreditoEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.CartaoCreditoEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CartaoCreditoRepository extends MongoRepository<CartaoCreditoEntity, Integer> {
    CartaoCreditoEntity findByBandeira(String bandeira);
    CartaoCreditoEntity findByNome(String nome);
    CartaoCreditoEntity findByNumero(String numero);
    Optional<CartaoCreditoEntity> findById(Integer id);
}
