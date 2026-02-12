package com.jayjayrj.controlefinanceiro.api.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
public class TransacaoRequestDTO {

    @JsonProperty(required = true)
    private Integer idUsuario;
    private Integer idConta;
    private Integer idCartao;
    @JsonProperty(required = true)
    private String naturezaOperacao;
    @JsonProperty(required = true)
    private Date data;
    @JsonProperty(required = true)
    private BigDecimal valor;
    @JsonProperty(required = true)
    private Integer quantidadeVezes;
}