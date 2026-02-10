package com.jayjayrj.controlefinanceiro.api.converter;

import com.jayjayrj.controlefinanceiro.api.response.CartaoCreditoResponseDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.CartaoCreditoEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartaoCreditoMapper {

    CartaoCreditoResponseDTO paraCartaoCreditoResponseDTO(CartaoCreditoEntity entity);
}
