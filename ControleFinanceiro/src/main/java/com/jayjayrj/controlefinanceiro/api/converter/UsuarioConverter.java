package com.jayjayrj.controlefinanceiro.api.converter;

import com.jayjayrj.controlefinanceiro.api.request.UsuarioRequestDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.UsuarioEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UsuarioConverter {

    public UsuarioEntity paraUsuarioEntity(UsuarioRequestDTO usuarioDTO) {
        Random random = new Random();

        return UsuarioEntity.builder()
                .id(random.nextInt())
                .nome(usuarioDTO.getNome())
                .email(usuarioDTO.getEmail())
                .usuario(usuarioDTO.getUsuario())
                .senha(usuarioDTO.getSenha())
                .build();
    }
}