package com.jayjayrj.controlefinanceiro.api.request;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UsuarioRequestDTOTest {

    @Test
    void deveConstruirComBuilder() {
        UsuarioRequestDTO dto = UsuarioRequestDTO.builder()
                .nome("Jonas")
                .email("jonas@email.com")
                .usuario("jayjay")
                .senha("123456")
                .build();

        assertThat(dto.getNome()).isEqualTo("Jonas");
        assertThat(dto.getEmail()).isEqualTo("jonas@email.com");
        assertThat(dto.getUsuario()).isEqualTo("jayjay");
        assertThat(dto.getSenha()).isEqualTo("123456");
    }

    @Test
    void deveTestarConstrutoresGettersESetters() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO();
        dto.setNome("Maria");
        dto.setEmail("maria@email.com");
        dto.setUsuario("mariaUser");
        dto.setSenha("senhaSegura");

        assertThat(dto.getNome()).isEqualTo("Maria");
        assertThat(dto.getEmail()).isEqualTo("maria@email.com");
        assertThat(dto.getUsuario()).isEqualTo("mariaUser");
        assertThat(dto.getSenha()).isEqualTo("senhaSegura");
    }

    @Test
    void deveTestarEqualsAndHashCode() {
        UsuarioRequestDTO dto1 = new UsuarioRequestDTO("João", "joao@email.com", "joaoUser", "senha123");
        UsuarioRequestDTO dto2 = new UsuarioRequestDTO("João", "joao@email.com", "joaoUser", "senha123");

        assertThat(dto1).isEqualTo(dto2);
        assertThat(dto1.hashCode()).isEqualTo(dto2.hashCode());
    }

    @Test
    void deveSerializarParaJson() throws Exception {
        UsuarioRequestDTO dto = UsuarioRequestDTO.builder()
                .nome("Ana")
                .email("ana@email.com")
                .usuario("anaUser")
                .senha("senhaAna")
                .build();

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(dto);

        assertThat(json).contains("ana@email.com");
        assertThat(json).contains("anaUser");
        assertThat(json).contains("senhaAna");
    }
}
