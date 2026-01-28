package com.jayjayrj.controlefinanceiro.api.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
public class CartaoCreditoRequestDTO {

    @JsonProperty(required = true)
    private Integer usuario;
    @JsonProperty(required = true)
    private String bandeira;
    @JsonProperty(required = true)
    private String numero;
    @JsonProperty(required = true)
    private String nome;
    @JsonProperty(required = true)
    private Integer vencimento;
    @JsonProperty(required = true)
    private BigDecimal limite;
    private BigDecimal totalFatura;
}