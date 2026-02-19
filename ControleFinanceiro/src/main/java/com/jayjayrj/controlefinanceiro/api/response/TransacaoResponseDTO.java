package com.jayjayrj.controlefinanceiro.api.response;

import java.math.BigDecimal;
import java.util.Date;

public record TransacaoResponseDTO(Integer id,
                                   Integer idUsuario,
                                   Integer naturezaOperacao,
                                   Integer idConta,
                                   String nomeConta,
                                   BigDecimal saldoConta,
                                   Integer idCartao,
                                   String nomeCartao,
                                   BigDecimal limiteCartao,
                                   String descricao,
                                   Date data,
                                   BigDecimal valor,
                                   Integer parcelaAtual,
                                   Integer quantidadeVezes) {
}