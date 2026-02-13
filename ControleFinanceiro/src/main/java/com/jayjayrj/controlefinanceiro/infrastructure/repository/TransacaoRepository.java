package com.jayjayrj.controlefinanceiro.infrastructure.repository;

import com.jayjayrj.controlefinanceiro.infrastructure.entity.TransacaoEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.TransacaoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TransacaoRepository extends MongoRepository<TransacaoEntity, Integer> {
    Optional<TransacaoEntity> findById(Integer id);
    Page<TransacaoEntity> findByIdConta(Integer idConta, Pageable pageable);
    Page<TransacaoEntity> findByIdCartao(Integer idCartao, Pageable pageable);
}
