package com.jayjayrj.controlefinanceiro.infrastructure.entity;

import org.junit.jupiter.api.Test;

import java.util.Currency;

import static org.assertj.core.api.Assertions.assertThat;

class ContaCorrenteEntityTest {

    @Test
    void deveConstruirComBuilder() {
        UsuarioEntity usuario = new UsuarioEntity();
        BancoEntity banco = new BancoEntity();
        Currency moeda = Currency.getInstance("BRL");

        ContaCorrenteEntity conta = ContaCorrenteEntity.builder()
                .id(1)
                .usuario(usuario)
                .banco(banco)
                .numeroAgencia(123L)
                .numeroConta(456L)
                .saldo(moeda)
                .build();

        assertThat(conta.getId()).isEqualTo(1);
        assertThat(conta.getUsuario()).isEqualTo(usuario);
        assertThat(conta.getBanco()).isEqualTo(banco);
        assertThat(conta.getNumeroAgencia()).isEqualTo(123L);
        assertThat(conta.getNumeroConta()).isEqualTo(456L);
        assertThat(conta.getSaldo()).isEqualTo(moeda);
    }

    @Test
    void deveTestarConstrutoresGettersESetters() {
        UsuarioEntity usuario = new UsuarioEntity();
        BancoEntity banco = new BancoEntity();
        Currency moeda = Currency.getInstance("USD");

        ContaCorrenteEntity conta = new ContaCorrenteEntity();
        conta.setId(2);
        conta.setUsuario(usuario);
        conta.setBanco(banco);
        conta.setNumeroAgencia(789L);
        conta.setNumeroConta(101112L);
        conta.setSaldo(moeda);

        assertThat(conta.getId()).isEqualTo(2);
        assertThat(conta.getUsuario()).isEqualTo(usuario);
        assertThat(conta.getBanco()).isEqualTo(banco);
        assertThat(conta.getNumeroAgencia()).isEqualTo(789L);
        assertThat(conta.getNumeroConta()).isEqualTo(101112L);
        assertThat(conta.getSaldo()).isEqualTo(moeda);
    }
}