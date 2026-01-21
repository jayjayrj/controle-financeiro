package com.jayjayrj.controlefinanceiro.api;
import ch.qos.logback.core.net.SyslogOutputStream;
import com.jayjayrj.controlefinanceiro.api.request.UsuarioRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.UsuarioResponseDTO;
import com.jayjayrj.controlefinanceiro.business.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping()
    public ResponseEntity<UsuarioResponseDTO> gravaDadosUsuario(@RequestBody UsuarioRequestDTO usuarioRequestDTO) {
        System.out.println("Entrei no UsuarioController.gravaDadosUsuario()");
        return ResponseEntity.ok(usuarioService.gravarUsuarios(usuarioRequestDTO));
    }

    @GetMapping()
    public ResponseEntity<UsuarioResponseDTO> buscaUsuarioPorUsuarioSenha(@RequestParam ("usuario") String usuario, @RequestParam ("senha") String senha) {
        System.out.println("Entrei no UsuarioController.buscaUsuarioPorUsuarioSenha()");

        UsuarioResponseDTO dto = usuarioService.buscaDadosUsuario(usuario, senha);
        if (dto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscaUsuarioPorId(@PathVariable Integer id) {
        System.out.println("Entrei no UsuarioController.buscaUsuarioPorId()");
        UsuarioResponseDTO dto = usuarioService.buscaDadosUsuarioPorId(id);
        if (dto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizaUsuario(
            @PathVariable Integer id,
            @RequestBody UsuarioRequestDTO usuarioRequestDTO) {
        System.out.println("Entrei no UsuarioController.atualizaUsuario()");

        UsuarioResponseDTO dto = usuarioService.atualizarUsuario(id, usuarioRequestDTO);

        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletaDadosUsuario(@PathVariable Integer id) {
        usuarioService.deletaDadosUsuario(id);
        return ResponseEntity.accepted().build();
    }
}
