package com.jayjayrj.controlefinanceiro.api;

import com.jayjayrj.controlefinanceiro.api.request.UsuarioRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.UsuarioResponseDTO;
import com.jayjayrj.controlefinanceiro.business.UsuarioService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UsuarioController.class)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @Test
    void deveGravarUsuario() throws Exception {
        UsuarioResponseDTO response = new UsuarioResponseDTO(1L, "Jonas", "jonas@email.com", "jayjay", "123");
        Mockito.when(usuarioService.gravarUsuarios(any(UsuarioRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Jonas\",\"email\":\"jonas@email.com\",\"usuario\":\"jayjay\",\"senha\":\"123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Jonas"))
                .andExpect(jsonPath("$.usuario").value("jayjay"));
    }

    @Test
    void deveBuscarUsuarioPorUsuarioSenha() throws Exception {
        UsuarioResponseDTO response = new UsuarioResponseDTO(1L, "Maria", "maria@email.com", "mariaUser", "senha");
        Mockito.when(usuarioService.buscaDadosUsuario("mariaUser", "senha")).thenReturn(response);

        mockMvc.perform(get("/user")
                        .param("usuario", "mariaUser")
                        .param("senha", "senha"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Maria"))
                .andExpect(jsonPath("$.usuario").value("mariaUser"));
    }

    @Test
    void deveRetornarUnauthorizedAoBuscarUsuarioPorUsuarioSenha() throws Exception {
        Mockito.when(usuarioService.buscaDadosUsuario("x", "y")).thenReturn(null);

        mockMvc.perform(get("/user")
                        .param("usuario", "x")
                        .param("senha", "y"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deveBuscarUsuarioPorId() throws Exception {
        UsuarioResponseDTO response = new UsuarioResponseDTO(1L, "Ana", "ana@email.com", "anaUser", "senha");
        Mockito.when(usuarioService.buscaDadosUsuarioPorId(1)).thenReturn(response);

        mockMvc.perform(get("/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Ana"))
                .andExpect(jsonPath("$.usuario").value("anaUser"));
    }

    @Test
    void deveRetornarUnauthorizedAoBuscarUsuarioPorId() throws Exception {
        Mockito.when(usuarioService.buscaDadosUsuarioPorId(99)).thenReturn(null);

        mockMvc.perform(get("/user/99"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deveAtualizarUsuario() throws Exception {
        UsuarioResponseDTO response = new UsuarioResponseDTO(1L, "Carlos", "carlos@email.com", "carlosUser", "novaSenha");
        Mockito.when(usuarioService.atualizarUsuario(eq(1), any(UsuarioRequestDTO.class))).thenReturn(response);

        mockMvc.perform(put("/user/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Carlos\",\"email\":\"carlos@email.com\",\"usuario\":\"carlosUser\",\"senha\":\"novaSenha\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Carlos"))
                .andExpect(jsonPath("$.usuario").value("carlosUser"));
    }

    @Test
    void deveRetornarNotFoundAoAtualizarUsuario() throws Exception {
        Mockito.when(usuarioService.atualizarUsuario(eq(99), any(UsuarioRequestDTO.class))).thenReturn(null);

        mockMvc.perform(put("/user/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Inexistente\",\"email\":\"x@email.com\",\"usuario\":\"x\",\"senha\":\"y\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveDeletarUsuario() throws Exception {
        mockMvc.perform(delete("/user/1"))
                .andExpect(status().isAccepted());
        Mockito.verify(usuarioService).deletaDadosUsuario(1);
    }
}