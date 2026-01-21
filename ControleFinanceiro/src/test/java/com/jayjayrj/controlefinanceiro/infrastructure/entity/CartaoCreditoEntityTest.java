package com.jayjayrj.controlefinanceiro.infrastructure.entity;

import org.junit.jupiter.api.Test;

import java.util.Currency;

import static org.assertj.core.api.Assertions.assertThat;

class CartaoCreditoEntityTest {

    @Test
    void deveConstruirComBuilder() {
        Currency moeda = Currency.getInstance("BRL");

        CartaoCreditoEntity cartao = CartaoCreditoEntity.builder()
                .id(1)
                .usuario(100)
                .bandeira("Visa")
                .vencimento(15)
                .limite(moeda)
                .totalFatura(moeda)
                .build();

        assertThat(cartao.getId()).isEqualTo(1);
        assertThat(cartao.getUsuario()).isEqualTo(100);
        assertThat(cartao.getBandeira()).isEqualTo("Visa");
        assertThat(cartao.getVencimento()).isEqualTo(15);
        assertThat(cartao.getLimite()).isEqualTo(moeda);
        assertThat(cartao.getTotalFatura()).isEqualTo(moeda);
    }

    @Test
    void deveTestarConstrutoresGettersESetters() {
        Currency moeda = Currency.getInstance("USD");

        CartaoCreditoEntity cartao = new CartaoCreditoEntity();
        cartao.setId(2);
        cartao.setUsuario(200);
        cartao.setBandeira("Mastercard");
        cartao.setVencimento(20);
        cartao.setLimite(moeda);
        cartao.setTotalFatura(moeda);

        assertThat(cartao.getId()).isEqualTo(2);
        assertThat(cartao.getUsuario()).isEqualTo(200);
        assertThat(cartao.getBandeira()).isEqualTo("Mastercard");
        assertThat(cartao.getVencimento()).isEqualTo(20);
        assertThat(cartao.getLimite()).isEqualTo(moeda);
        assertThat(cartao.getTotalFatura()).isEqualTo(moeda);
    }
}