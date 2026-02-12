package com.jayjayrj.controlefinanceiro.api.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.BancoEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.UsuarioEntity;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
public class ContaCorrenteRequestDTO {

    @JsonProperty(required = true)
    private Integer idUsuario;
    @JsonProperty(required = true)
    private Integer idBanco;
    @JsonProperty(required = true)
    private Long numeroAgencia;
    @JsonProperty(required = true)
    private Long numeroConta;
    private BigDecimal saldo;
}