package com.jayjayrj.controlefinanceiro.infrastructure.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="usuario_entity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioEntity {
    @Id
    private Integer id;
    @Indexed(unique = true)
    private String nome;
    @Indexed(unique = true)
    private String email;
    @Indexed(unique = true)
    private String usuario;
    private String senha;
}
