package com.jayjayrj.controlefinanceiro.api;
import com.jayjayrj.controlefinanceiro.api.request.ContaCorrenteRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.BancoResponseDTO;
import com.jayjayrj.controlefinanceiro.api.response.ContaCorrenteResponseDTO;
import com.jayjayrj.controlefinanceiro.business.BancoService;
import com.jayjayrj.controlefinanceiro.business.ContaCorrenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contas")
@RequiredArgsConstructor
public class ContaCorrenteController {

    private final ContaCorrenteService contaCorrenteService;
    private final BancoService bancoService;

    @PostMapping()
    public ResponseEntity<ContaCorrenteResponseDTO> gravaDadosContaCorrente(@RequestBody ContaCorrenteRequestDTO contaCorrenteRequestDTO) {
        System.out.println("Entrei no ContaCorrenteController.gravaDadosContaCorrente()");
        return ResponseEntity.ok(contaCorrenteService.gravarContasCorrentes(contaCorrenteRequestDTO));
    }

    @GetMapping("/listar")
    public ResponseEntity<Page<ContaCorrenteResponseDTO>> listarContasCorrentes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nomeBanco") String sortBy) {

        System.out.println("Entrei no ContaCorrenteController.listarContasCorrentes()");

        Page<ContaCorrenteResponseDTO> contasCorrentes = contaCorrenteService.listarContasCorrentes(page, size, sortBy);
        Page<ContaCorrenteResponseDTO> contasComBanco = contasCorrentes.map(contaCorrente -> {

            String nomeBanco = "";
            if (contaCorrente.idBanco() != null) {
                BancoResponseDTO banco  = bancoService.buscaDadosBancoPorId(contaCorrente.idBanco());

                if (banco != null) {
                    nomeBanco = banco.nome();
                    System.out.println("O nome do banco é " +  nomeBanco);
                }
            }

            return new ContaCorrenteResponseDTO(
                    contaCorrente.id(),
                    contaCorrente.idUsuario(),
                    contaCorrente.idBanco(),
                    nomeBanco,
                    contaCorrente.numeroAgencia(),
                    contaCorrente.numeroConta(),
                    contaCorrente.saldo());
        });

        return ResponseEntity.ok(contasComBanco);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContaCorrenteResponseDTO> buscaContaCorrentePorId(@PathVariable Integer id) {
        System.out.println("Entrei no ContaCorrenteController.buscaContaCorrentePorId()");
        ContaCorrenteResponseDTO dto = contaCorrenteService.buscaDadosContaCorrentePorId(id);
        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContaCorrenteResponseDTO> atualizaContaCorrente(
            @PathVariable Integer id,
            @RequestBody ContaCorrenteRequestDTO contaCorrenteRequestDTO) {
        System.out.println("Entrei no ContaCorrenteController.atualizaContaCorrente()");

        ContaCorrenteResponseDTO dto = contaCorrenteService.atualizarContaCorrente(id, contaCorrenteRequestDTO);

        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletaDadosContaCorrente(@PathVariable Integer id) {
        contaCorrenteService.deletaDadosContaCorrente(id);
        return ResponseEntity.accepted().build();
    }
}
