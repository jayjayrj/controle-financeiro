package com.jayjayrj.controlefinanceiro.api.converter;

import com.jayjayrj.controlefinanceiro.api.request.TransacaoRequestDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.TransacaoEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@RequiredArgsConstructor
public class TransacaoConverter {

    public TransacaoEntity paraTransacaoEntity(TransacaoRequestDTO transacaoDTO) {
        Random random = new Random();

        return TransacaoEntity.builder()
                .id(random.nextInt())
                .idUsuario(transacaoDTO.getIdUsuario())
                .naturezaOperacao(transacaoDTO.getNaturezaOperacao())
                .idConta(transacaoDTO.getIdConta())
                .idCartao(transacaoDTO.getIdCartao())
                .descricao(transacaoDTO.getDescricao())
                .data(transacaoDTO.getData())
                .valor(transacaoDTO.getValor())
                .parcelaAtual(transacaoDTO.getParcelaAtual())
                .quantidadeVezes(transacaoDTO.getQuantidadeVezes())
                .build();
    }
}