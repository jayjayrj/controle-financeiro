package com.jayjayrj.controlefinanceiro.infrastructure.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
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
    private Integer idUsuario;
    private Integer idConta;
    private Integer idCartao;
    private String naturezaOperacao;
    private Date data;
    private BigDecimal valor;
    private Integer quantidadeVezes;
}
