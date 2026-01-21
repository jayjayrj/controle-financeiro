package com.jayjayrj.controlefinanceiro.api;
import com.jayjayrj.controlefinanceiro.api.request.BancoRequestDTO;
import com.jayjayrj.controlefinanceiro.api.request.BancoRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.BancoResponseDTO;
import com.jayjayrj.controlefinanceiro.api.response.BancoResponseDTO;
import com.jayjayrj.controlefinanceiro.business.BancoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bancos")
@RequiredArgsConstructor
public class BancoController {

    private final BancoService bancoService;

    @PostMapping()
    public ResponseEntity<BancoResponseDTO> gravaDadosBanco(@RequestBody BancoRequestDTO bancoRequestDTO) {
        System.out.println("Entrei no BancoController.gravaDadosBanco()");
        return ResponseEntity.ok(bancoService.gravarBancos(bancoRequestDTO));
    }

    @GetMapping("/listar")
    public ResponseEntity<Page<BancoResponseDTO>> listarBancos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sortBy) {

        Page<BancoResponseDTO> bancos = bancoService.listarBancos(page, size, sortBy);
        return ResponseEntity.ok(bancos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BancoResponseDTO> buscaBancoPorId(@PathVariable Integer id) {
        System.out.println("Entrei no BancoController.buscaBancoPorId()");
        BancoResponseDTO dto = bancoService.buscaDadosBancoPorId(id);
        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BancoResponseDTO> atualizaBanco(
            @PathVariable Integer id,
            @RequestBody BancoRequestDTO bancoRequestDTO) {
        System.out.println("Entrei no BancoController.atualizaBanco()");

        BancoResponseDTO dto = bancoService.atualizarBanco(id, bancoRequestDTO);

        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletaDadosBanco(@PathVariable Integer id) {
        bancoService.deletaDadosBanco(id);
        return ResponseEntity.accepted().build();
    }
}
