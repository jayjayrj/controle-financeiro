package com.jayjayrj.controlefinanceiro.api.converter;

import com.jayjayrj.controlefinanceiro.api.request.BancoRequestDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.BancoEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Random;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class BancoConverter {

    public BancoEntity paraBancoEntity(BancoRequestDTO bancoDTO) {
        Random random = new Random();

        return BancoEntity.builder()
                .id(random.nextInt())
                .nome(bancoDTO.getNome())
                .numero(bancoDTO.getNumero())
                .build();

    }
}