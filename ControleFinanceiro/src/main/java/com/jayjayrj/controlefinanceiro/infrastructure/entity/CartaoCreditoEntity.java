package com.jayjayrj.controlefinanceiro.infrastructure.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Currency;

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
    private Integer vencimento;
    private Currency limite;
    private Currency totalFatura;
}
