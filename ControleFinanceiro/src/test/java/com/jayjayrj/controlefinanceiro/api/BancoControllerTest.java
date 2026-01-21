package com.jayjayrj.controlefinanceiro.api;

import com.jayjayrj.controlefinanceiro.api.request.BancoRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.BancoResponseDTO;
import com.jayjayrj.controlefinanceiro.business.BancoService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BancoController.class)
class BancoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BancoService bancoService;

    @Test
    void deveGravarBanco() throws Exception {
        BancoResponseDTO response = new BancoResponseDTO(1L, "Banco do Brasil", "001");
        Mockito.when(bancoService.gravarBancos(any(BancoRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/bancos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Banco do Brasil\",\"numero\":\"001\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Banco do Brasil"))
                .andExpect(jsonPath("$.numero").value("001"));
    }

    @Test
    void deveListarBancos() throws Exception {
        BancoResponseDTO response = new BancoResponseDTO(1L, "Itaú", "341");
        Page<BancoResponseDTO> page = new PageImpl<>(Collections.singletonList(response));
        Mockito.when(bancoService.listarBancos(0, 10, "nome")).thenReturn(page);

        mockMvc.perform(get("/bancos/listar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].nome").value("Itaú"))
                .andExpect(jsonPath("$.content[0].numero").value("341"));
    }

    @Test
    void deveBuscarBancoPorId() throws Exception {
        BancoResponseDTO response = new BancoResponseDTO(1L, "Caixa", "104");
        Mockito.when(bancoService.buscaDadosBancoPorId(1)).thenReturn(response);

        mockMvc.perform(get("/bancos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Caixa"))
                .andExpect(jsonPath("$.numero").value("104"));
    }

    @Test
    void deveRetornarNotFoundAoBuscarBancoPorId() throws Exception {
        Mockito.when(bancoService.buscaDadosBancoPorId(99)).thenReturn(null);

        mockMvc.perform(get("/bancos/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveAtualizarBanco() throws Exception {
        BancoResponseDTO response = new BancoResponseDTO(1L, "Santander", "033");
        Mockito.when(bancoService.atualizarBanco(eq(1), any(BancoRequestDTO.class))).thenReturn(response);

        mockMvc.perform(put("/bancos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Santander\",\"numero\":\"033\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Santander"))
                .andExpect(jsonPath("$.numero").value("033"));
    }

    @Test
    void deveRetornarNotFoundAoAtualizarBanco() throws Exception {
        Mockito.when(bancoService.atualizarBanco(eq(99), any(BancoRequestDTO.class))).thenReturn(null);

        mockMvc.perform(put("/bancos/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Inexistente\",\"numero\":\"999\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveDeletarBanco() throws Exception {
        mockMvc.perform(delete("/bancos/1"))
                .andExpect(status().isAccepted());
        Mockito.verify(bancoService).deletaDadosBanco(1);
    }
}