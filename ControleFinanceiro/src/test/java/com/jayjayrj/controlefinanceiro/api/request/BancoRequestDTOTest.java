package com.jayjayrj.controlefinanceiro.api.request;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class BancoRequestDTOTest {

    @Test
    void deveConstruirComBuilder() {
        BancoRequestDTO dto = BancoRequestDTO.builder()
                .nome("Banco do Brasil")
                .numero("001")
                .build();

        assertThat(dto.getNome()).isEqualTo("Banco do Brasil");
        assertThat(dto.getNumero()).isEqualTo("001");
    }

    @Test
    void deveTestarConstrutoresGettersESetters() {
        BancoRequestDTO dto = new BancoRequestDTO();
        dto.setNome("Caixa Econômica");
        dto.setNumero("104");

        assertThat(dto.getNome()).isEqualTo("Caixa Econômica");
        assertThat(dto.getNumero()).isEqualTo("104");
    }

    @Test
    void deveTestarEqualsAndHashCode() {
        BancoRequestDTO dto1 = new BancoRequestDTO("Itaú", "341");
        BancoRequestDTO dto2 = new BancoRequestDTO("Itaú", "341");

        assertThat(dto1).isEqualTo(dto2);
        assertThat(dto1.hashCode()).isEqualTo(dto2.hashCode());
    }

    @Test
    void deveSerializarParaJson() throws Exception {
        BancoRequestDTO dto = BancoRequestDTO.builder()
                .nome("Santander")
                .numero("033")
                .build();

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(dto);

        assertThat(json).contains("Santander");
        assertThat(json).contains("033");
    }
}