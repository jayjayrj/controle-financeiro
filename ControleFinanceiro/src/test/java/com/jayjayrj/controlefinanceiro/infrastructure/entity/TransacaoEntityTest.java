package com.jayjayrj.controlefinanceiro.infrastructure.entity;

import org.junit.jupiter.api.Test;

import java.util.Currency;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

class TransacaoEntityTest {

    @Test
    void deveConstruirComBuilder() {
        Date hoje = new Date();
        Currency moeda = Currency.getInstance("BRL");

        TransacaoEntity transacao = TransacaoEntity.builder()
                .id(1)
                .conta(123)
                .descricao("DEPOSITO")
                .data(hoje)
                .valor(moeda)
                .quantidadeVezes(2)
                .build();

        assertThat(transacao.getId()).isEqualTo(1);
        assertThat(transacao.getConta()).isEqualTo(123);
        assertThat(transacao.getDescricao()).isEqualTo("DEPOSITO");
        assertThat(transacao.getData()).isEqualTo(hoje);
        assertThat(transacao.getValor()).isEqualTo(moeda);
        assertThat(transacao.getQuantidadeVezes()).isEqualTo(2);
    }

    @Test
    void deveTestarConstrutoresGettersESetters() {
        Date data = new Date();
        Currency moeda = Currency.getInstance("USD");

        TransacaoEntity transacao = new TransacaoEntity();
        transacao.setId(2);
        transacao.setConta(456);
        transacao.setDescricao("SAQUE");
        transacao.setData(data);
        transacao.setValor(moeda);
        transacao.setQuantidadeVezes(5);

        assertThat(transacao.getId()).isEqualTo(2);
        assertThat(transacao.getConta()).isEqualTo(456);
        assertThat(transacao.getDescricao()).isEqualTo("SAQUE");
        assertThat(transacao.getData()).isEqualTo(data);
        assertThat(transacao.getValor()).isEqualTo(moeda);
        assertThat(transacao.getQuantidadeVezes()).isEqualTo(5);
    }
}