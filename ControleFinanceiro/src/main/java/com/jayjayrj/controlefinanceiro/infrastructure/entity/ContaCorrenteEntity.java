package com.jayjayrj.controlefinanceiro.infrastructure.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Document(collection="conta_corrente_entity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContaCorrenteEntity {
    @Id
    private Integer id;
    private Integer idUsuario;
    private Integer idBanco;
    private Long numeroAgencia;
    private Long numeroConta;
    private BigDecimal saldo;
}
