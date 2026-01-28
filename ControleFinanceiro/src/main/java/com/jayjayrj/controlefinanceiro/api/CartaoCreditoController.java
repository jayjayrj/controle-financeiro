package com.jayjayrj.controlefinanceiro.api;
import com.jayjayrj.controlefinanceiro.api.request.CartaoCreditoRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.CartaoCreditoResponseDTO;
import com.jayjayrj.controlefinanceiro.business.CartaoCreditoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cartoesCredito")
@RequiredArgsConstructor
public class CartaoCreditoController {

    private final CartaoCreditoService cartaoCreditoService;

    @PostMapping()
    public ResponseEntity<CartaoCreditoResponseDTO> gravaDadosCartaoCredito(@RequestBody CartaoCreditoRequestDTO cartaoCreditoRequestDTO) {
        System.out.println("Entrei no CartaoCreditoController.gravaDadosCartaoCredito()");
        return ResponseEntity.ok(cartaoCreditoService.gravarCartoesCredito(cartaoCreditoRequestDTO));
    }

    @GetMapping("/listar")
    public ResponseEntity<Page<CartaoCreditoResponseDTO>> listarCartoesCredito(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "bandeira") String sortBy) {

        Page<CartaoCreditoResponseDTO> cartoesCredito = cartaoCreditoService.listarCartoesCredito(page, size, sortBy);
        return ResponseEntity.ok(cartoesCredito);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartaoCreditoResponseDTO> buscaCartaoCreditoPorId(@PathVariable Integer id) {
        System.out.println("Entrei no CartaoCreditoController.buscaCartaoCreditoPorId()");
        CartaoCreditoResponseDTO dto = cartaoCreditoService.buscaDadosCartaoCreditoPorId(id);
        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartaoCreditoResponseDTO> atualizaCartaoCredito(
            @PathVariable Integer id,
            @RequestBody CartaoCreditoRequestDTO cartaoCreditoRequestDTO) {
        System.out.println("Entrei no CartaoCreditoController.atualizaCartaoCredito()");

        CartaoCreditoResponseDTO dto = cartaoCreditoService.atualizarCartaoCredito(id, cartaoCreditoRequestDTO);

        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletaDadosCartaoCredito(@PathVariable Integer id) {
        cartaoCreditoService.deletaDadosCartaoCredito(id);
        return ResponseEntity.accepted().build();
    }
}
