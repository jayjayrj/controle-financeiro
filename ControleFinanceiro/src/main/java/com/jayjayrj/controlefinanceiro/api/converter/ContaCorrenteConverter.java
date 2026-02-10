package com.jayjayrj.controlefinanceiro.api.converter;

import com.jayjayrj.controlefinanceiro.api.request.CartaoCreditoRequestDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.CartaoCreditoEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@RequiredArgsConstructor
public class CartaoCreditoConverter {

    public CartaoCreditoEntity paraCartaoCreditoEntity(CartaoCreditoRequestDTO cartaoCreditoDTO) {
        Random random = new Random();

        return CartaoCreditoEntity.builder()
                .id(random.nextInt())
                .usuario(cartaoCreditoDTO.getUsuario())
                .bandeira(cartaoCreditoDTO.getBandeira())
                .numero(cartaoCreditoDTO.getNumero())
                .nome(cartaoCreditoDTO.getNome())
                .vencimento(cartaoCreditoDTO.getVencimento())
                .limite(cartaoCreditoDTO.getLimite())
                .totalFatura(cartaoCreditoDTO.getTotalFatura())
                .build();
    }
}