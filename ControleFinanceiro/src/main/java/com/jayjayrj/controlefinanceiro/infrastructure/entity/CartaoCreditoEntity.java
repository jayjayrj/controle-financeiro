package com.jayjayrj.controlefinanceiro.infrastructure.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Document(collection="cartao_credito_entity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartaoCreditoEntity {
    @Id
    private Integer id;
    private Integer usuario;
    private String bandeira;
    private String numero;
    private String nome;
    private Integer vencimento;
    private BigDecimal limite;
    private BigDecimal totalFatura;
}
