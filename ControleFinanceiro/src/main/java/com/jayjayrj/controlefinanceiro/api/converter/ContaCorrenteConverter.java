package com.jayjayrj.controlefinanceiro.api.converter;

import com.jayjayrj.controlefinanceiro.api.request.ContaCorrenteRequestDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.ContaCorrenteEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@RequiredArgsConstructor
public class ContaCorrenteConverter {

    public ContaCorrenteEntity paraContaCorrenteEntity(ContaCorrenteRequestDTO contaCorrenteDTO) {
        Random random = new Random();

        return ContaCorrenteEntity.builder()
                .id(random.nextInt())
                .idUsuario(contaCorrenteDTO.getIdUsuario())
                .idBanco(contaCorrenteDTO.getIdBanco())
                .numeroAgencia(contaCorrenteDTO.getNumeroAgencia())
                .numeroConta(contaCorrenteDTO.getNumeroConta())
                .saldo(contaCorrenteDTO.getSaldo())
                .build();
    }
}