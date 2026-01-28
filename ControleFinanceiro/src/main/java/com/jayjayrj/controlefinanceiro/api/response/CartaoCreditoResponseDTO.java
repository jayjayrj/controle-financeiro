package com.jayjayrj.controlefinanceiro.api.response;

import java.math.BigDecimal;

public record CartaoCreditoResponseDTO(Long id,
                                       Integer usuario,
                                       String bandeira,
                                       String numero,
                                       String nome,
                                       Integer vencimento,
                                       BigDecimal limite,
                                       BigDecimal totalFatura) {


}