package com.jayjayrj.controlefinanceiro.api.converter;

import com.jayjayrj.controlefinanceiro.api.response.ContaCorrenteResponseDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.ContaCorrenteEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ContaCorrenteMapper {

    ContaCorrenteResponseDTO paraContaCorrenteResponseDTO(ContaCorrenteEntity entity);
}
