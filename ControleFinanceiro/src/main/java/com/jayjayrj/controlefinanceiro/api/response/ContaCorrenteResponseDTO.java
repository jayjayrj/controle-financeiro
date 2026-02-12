package com.jayjayrj.controlefinanceiro.api.response;

import com.jayjayrj.controlefinanceiro.infrastructure.entity.BancoEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.UsuarioEntity;

import java.math.BigDecimal;

public record ContaCorrenteResponseDTO(Integer id,
                                        Integer idUsuario,
                                        Integer idBanco,
                                        String nomeBanco,
                                        Long numeroAgencia,
                                        Long numeroConta,
                                        BigDecimal saldo) {

}