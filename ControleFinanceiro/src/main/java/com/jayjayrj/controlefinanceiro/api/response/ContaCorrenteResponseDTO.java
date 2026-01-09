package com.jayjayrj.controlefinanceiro.api.response;

import com.jayjayrj.controlefinanceiro.infrastructure.entity.BancoEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.UsuarioEntity;

import java.util.Currency;

public record ContaCorrenteResponseDTO(Integer id,
                                        UsuarioEntity usuario,
                                        BancoEntity banco,
                                        Long numeroAgencia,
                                        Long numeroConta,
                                        Currency saldo) {

}