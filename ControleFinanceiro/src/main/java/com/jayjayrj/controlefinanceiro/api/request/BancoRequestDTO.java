package com.jayjayrj.controlefinanceiro.api.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
public class BancoRequestDTO {

    @JsonProperty(required = true)
    private String nome;

    @JsonProperty(required = true)
    private String numero;
}