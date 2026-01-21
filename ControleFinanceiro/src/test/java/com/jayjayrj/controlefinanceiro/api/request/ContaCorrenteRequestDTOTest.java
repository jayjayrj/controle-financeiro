package com.jayjayrj.controlefinanceiro.api.request;

import com.jayjayrj.controlefinanceiro.infrastructure.entity.BancoEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.UsuarioEntity;
import org.junit.jupiter.api.Test;

import java.util.Currency;

import static org.assertj.core.api.Assertions.assertThat;

class ContaCorrenteRequestDTOTest {

    @Test
    void deveConstruirComBuilder() {
        UsuarioEntity usuario = new UsuarioEntity();
        BancoEntity banco = new BancoEntity();

        ContaCorrenteRequestDTO dto = ContaCorrenteRequestDTO.builder()
                .usuario(usuario)
                .banco(banco)
                .numeroAgencia(123L)
                .numeroConta(456L)
                .saldo(Currency.getInstance("BRL"))
                .build();

        assertThat(dto.getUsuario()).isEqualTo(usuario);
        assertThat(dto.getBanco()).isEqualTo(banco);
        assertThat(dto.getNumeroAgencia()).isEqualTo(123L);
        assertThat(dto.getNumeroConta()).isEqualTo(456L);
        assertThat(dto.getSaldo()).isEqualTo(Currency.getInstance("BRL"));
    }

    @Test
    void deveTestarEqualsAndHashCode() {
        UsuarioEntity usuario = new UsuarioEntity();
        BancoEntity banco = new BancoEntity();

        ContaCorrenteRequestDTO dto1 = new ContaCorrenteRequestDTO(usuario, banco, 123L, 456L, Currency.getInstance("BRL"));
        ContaCorrenteRequestDTO dto2 = new ContaCorrenteRequestDTO(usuario, banco, 123L, 456L, Currency.getInstance("BRL"));

        assertThat(dto1).isEqualTo(dto2);
        assertThat(dto1.hashCode()).isEqualTo(dto2.hashCode());
    }

    @Test
    void deveTestarGettersESetters() {
        ContaCorrenteRequestDTO dto = new ContaCorrenteRequestDTO();
        dto.setNumeroAgencia(111L);
        dto.setNumeroConta(222L);

        assertThat(dto.getNumeroAgencia()).isEqualTo(111L);
        assertThat(dto.getNumeroConta()).isEqualTo(222L);
    }
}