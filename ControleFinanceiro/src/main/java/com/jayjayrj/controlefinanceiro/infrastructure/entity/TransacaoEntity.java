package com.jayjayrj.controlefinanceiro.infrastructure.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Currency;
import java.util.Date;

@Document(collection="transacao_entity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransacaoEntity {
    @Id
    private Integer id;
    private Integer conta;
    private String naturezaOperacao;
    private Date data;
    private Currency valor;
    private Integer quantidadeVezes;
}
