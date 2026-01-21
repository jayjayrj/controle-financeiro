package com.jayjayrj.controlefinanceiro.infrastructure.entity;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UsuarioEntityTest {

    @Test
    void deveConstruirComBuilder() {
        UsuarioEntity usuario = UsuarioEntity.builder()
                .id(1)
                .nome("Jonas")
                .email("jonas@email.com")
                .usuario("jayjay")
                .senha("123456")
                .build();

        assertThat(usuario.getId()).isEqualTo(1);
        assertThat(usuario.getNome()).isEqualTo("Jonas");
        assertThat(usuario.getEmail()).isEqualTo("jonas@email.com");
        assertThat(usuario.getUsuario()).isEqualTo("jayjay");
        assertThat(usuario.getSenha()).isEqualTo("123456");
    }

    @Test
    void deveTestarConstrutoresGettersESetters() {
        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setId(2);
        usuario.setNome("Maria");
        usuario.setEmail("maria@email.com");
        usuario.setUsuario("mariaUser");
        usuario.setSenha("senhaSegura");

        assertThat(usuario.getId()).isEqualTo(2);
        assertThat(usuario.getNome()).isEqualTo("Maria");
        assertThat(usuario.getEmail()).isEqualTo("maria@email.com");
        assertThat(usuario.getUsuario()).isEqualTo("mariaUser");
        assertThat(usuario.getSenha()).isEqualTo("senhaSegura");
    }
}