package com.jayjayrj.controlefinanceiro.infrastructure.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="banco_entity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BancoEntity {
    @Id
    private Integer id;
    @Indexed(unique = true)
    private String nome;
    @Indexed(unique = true)
    private String numero;
}
