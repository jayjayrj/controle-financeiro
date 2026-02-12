package com.jayjayrj.controlefinanceiro.api.converter;

import com.jayjayrj.controlefinanceiro.api.response.TransacaoResponseDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.TransacaoEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransacaoMapper {

    TransacaoResponseDTO paraTransacaoResponseDTO(TransacaoEntity entity);
}
