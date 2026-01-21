package com.jayjayrj.controlefinanceiro.infrastructure.entity;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class BancoEntityTest {

    @Test
    void deveConstruirComBuilder() {
        BancoEntity banco = BancoEntity.builder()
                .id(1)
                .nome("Banco do Brasil")
                .numero("001")
                .build();

        assertThat(banco.getId()).isEqualTo(1);
        assertThat(banco.getNome()).isEqualTo("Banco do Brasil");
        assertThat(banco.getNumero()).isEqualTo("001");
    }

    @Test
    void deveTestarConstrutoresGettersESetters() {
        BancoEntity banco = new BancoEntity();
        banco.setId(2);
        banco.setNome("Caixa Econômica");
        banco.setNumero("104");

        assertThat(banco.getId()).isEqualTo(2);
        assertThat(banco.getNome()).isEqualTo("Caixa Econômica");
        assertThat(banco.getNumero()).isEqualTo("104");
    }
}