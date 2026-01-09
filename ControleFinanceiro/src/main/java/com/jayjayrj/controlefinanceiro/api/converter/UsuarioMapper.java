package com.jayjayrj.controlefinanceiro.api.converter;

import com.jayjayrj.controlefinanceiro.api.response.UsuarioResponseDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.UsuarioEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    UsuarioResponseDTO paraUsuarioResponseDTO(UsuarioEntity entity);
    UsuarioEntity paraUsuarioEntity(UsuarioResponseDTO dto);
}
