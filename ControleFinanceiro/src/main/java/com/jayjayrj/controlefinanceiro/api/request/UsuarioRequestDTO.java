package com.jayjayrj.controlefinanceiro.api.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
public class UsuarioRequestDTO {

    private String nome;

    @JsonProperty(required = true)
    private String email;

    @JsonProperty(required = true)
    private String usuario;

    @JsonProperty(required = true)
    private String senha;
}