package com.jayjayrj.controlefinanceiro.api.response;

import java.math.BigDecimal;
import java.util.Date;

public record TransacaoResponseDTO(Integer id,
                                   Integer idUsuario,
                                   Integer idConta,
                                   String nomeConta,
                                   Integer idCartao,
                                   String nomeCartao,
                                   String naturezaOperacao,
                                   Date data,
                                   BigDecimal valor,
                                   Integer quantidadeVezes) {
}