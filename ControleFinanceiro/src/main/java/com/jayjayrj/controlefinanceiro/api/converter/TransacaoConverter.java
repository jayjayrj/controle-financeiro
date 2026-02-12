package com.jayjayrj.controlefinanceiro.api.converter;

import com.jayjayrj.controlefinanceiro.api.request.ContaCorrenteRequestDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.ContaCorrenteEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@RequiredArgsConstructor
public class ContaCorrenteConverter {

    public ContaCorrenteEntity paraContaCorrenteEntity(ContaCorrenteRequestDTO cartaoCreditoDTO) {
        Random random = new Random();

        return ContaCorrenteEntity.builder()
                .id(random.nextInt())
                .idUsuario(cartaoCreditoDTO.getIdUsuario())
                .idBanco(cartaoCreditoDTO.getIdBanco())
                .numeroAgencia(cartaoCreditoDTO.getNumeroAgencia())
                .numeroConta(cartaoCreditoDTO.getNumeroConta())
                .saldo(cartaoCreditoDTO.getSaldo())
                .build();
    }
}