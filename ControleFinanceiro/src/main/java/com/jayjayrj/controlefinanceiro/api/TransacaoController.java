package com.jayjayrj.controlefinanceiro.api;
import com.jayjayrj.controlefinanceiro.api.request.TransacaoRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.BancoResponseDTO;
import com.jayjayrj.controlefinanceiro.api.response.CartaoCreditoResponseDTO;
import com.jayjayrj.controlefinanceiro.api.response.ContaCorrenteResponseDTO;
import com.jayjayrj.controlefinanceiro.api.response.TransacaoResponseDTO;
import com.jayjayrj.controlefinanceiro.business.BancoService;
import com.jayjayrj.controlefinanceiro.business.CartaoCreditoService;
import com.jayjayrj.controlefinanceiro.business.ContaCorrenteService;
import com.jayjayrj.controlefinanceiro.business.TransacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/transacoes")
@RequiredArgsConstructor
public class TransacaoController {

    private final TransacaoService transacaoService;
    private final ContaCorrenteService contaCorrenteService;
    private final CartaoCreditoService cartaoCreditoService;

    @PostMapping()
    public ResponseEntity<TransacaoResponseDTO> gravaDadosTransacao(@RequestBody TransacaoRequestDTO transacaoRequestDTO) {
        System.out.println("Entrei no TransacaoController.gravaDadosTransacao()");
        return ResponseEntity.ok(transacaoService.gravarTransacoes(transacaoRequestDTO));
    }

    @GetMapping("/listar")
    public ResponseEntity<Page<TransacaoResponseDTO>> listarTransacoes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "data") String sortBy) {

        System.out.println("Entrei no TransacaoController.listarTransacoes()");

        Page<TransacaoResponseDTO> transacoes = transacaoService.listarTransacoes(page, size, sortBy);
        Page<TransacaoResponseDTO> transacoesComBanco = transacoes.map(transacao -> {

            String nomeConta = "";
            if (transacao.idConta() != null) {
                ContaCorrenteResponseDTO contaCorrente  = contaCorrenteService.buscaDadosContaCorrentePorId(transacao.idConta());

                if (contaCorrente != null) {
                    nomeConta = contaCorrente.nomeBanco();
                    System.out.println("O nome da conta é " +  nomeConta);
                }
            }

            String nomeCartao = "";
            if (transacao.idCartao() != null) {
                CartaoCreditoResponseDTO cartaoCredito = cartaoCreditoService.buscaDadosCartaoCreditoPorId(transacao.idCartao());

                if (cartaoCredito != null) {
                    nomeCartao = cartaoCredito.nome();
                    System.out.println("O nome do cartão é " +  nomeCartao);
                }
            }

            return new TransacaoResponseDTO(
                    transacao.id(),
                    transacao.idUsuario(),
                    transacao.naturezaOperacao(),
                    transacao.idConta(),
                    nomeConta,
                    null,
                    transacao.idCartao(),
                    transacao.nomeCartao(),
                    null,
                    transacao.descricao(),
                    transacao.data(),
                    transacao.valor(),
                    transacao.parcelaAtual(),
                    transacao.quantidadeVezes());
        });

        return ResponseEntity.ok(transacoesComBanco);
    }

    @GetMapping("/listarPorContaCartao")
    public ResponseEntity<Page<TransacaoResponseDTO>> listarTransacoesPorContaOuCartao(
            @RequestParam(required = false) Integer idConta,
            @RequestParam(required = false) Integer idCartao,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "data") String sortBy) {

        System.out.println("Entrei no TransacaoController.listarTransacoesPorContaOuCartao()");

        Page<TransacaoResponseDTO> transacoes = null;
        if (idConta != null) {
            transacoes = transacaoService.listarTransacoesPorIdConta(idConta, page, size, sortBy);
        } else {
            transacoes = transacaoService.listarTransacoesPorIdCartao(idCartao, page, size, sortBy);
        }

        Page<TransacaoResponseDTO> transacoesComBanco = transacoes.map(transacao -> {

            String nomeConta = "";
            BigDecimal saldoConta = null;
            if (transacao.idConta() != null) {
                ContaCorrenteResponseDTO contaCorrente  = contaCorrenteService.buscaDadosContaCorrentePorId(transacao.idConta());

                if (contaCorrente != null) {
                    nomeConta = contaCorrente.nomeBanco() + " - " + contaCorrente.numeroConta();
                    saldoConta =  contaCorrente.saldo();
                    System.out.println("O saldo da conta é " +  saldoConta.toString());
                    System.out.println("O nome da conta é " +  nomeConta);
                }
            }

            String nomeCartao = "";
            BigDecimal limiteCartao = null;
            if (transacao.idCartao() != null) {
                CartaoCreditoResponseDTO cartaoCredito = cartaoCreditoService.buscaDadosCartaoCreditoPorId(transacao.idCartao());

                if (cartaoCredito != null) {
                    nomeCartao = cartaoCredito.bandeira() + " - " +  cartaoCredito.nome();
                    limiteCartao = cartaoCredito.limite();
                    System.out.println("O limite do cartão é " +  limiteCartao);
                    System.out.println("O nome do cartão é " +  nomeCartao);
                }
            }

            return new TransacaoResponseDTO(
                    transacao.id(),
                    transacao.idUsuario(),
                    transacao.naturezaOperacao(),
                    transacao.idConta(),
                    nomeConta,
                    saldoConta,
                    transacao.idCartao(),
                    nomeCartao,
                    limiteCartao,
                    transacao.descricao(),
                    transacao.data(),
                    transacao.valor(),
                    transacao.parcelaAtual(),
                    transacao.quantidadeVezes());
        });

        return ResponseEntity.ok(transacoesComBanco);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransacaoResponseDTO> buscaTransacaoPorId(@PathVariable Integer id) {
        System.out.println("Entrei no TransacaoController.buscaTransacaoPorId()");
        TransacaoResponseDTO dto = transacaoService.buscaDadosTransacaoPorId(id);
        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransacaoResponseDTO> atualizaTransacao(
            @PathVariable Integer id,
            @RequestBody TransacaoRequestDTO transacaoRequestDTO) {
        System.out.println("Entrei no TransacaoController.atualizaTransacao()");

        TransacaoResponseDTO dto = transacaoService.atualizarTransacao(id, transacaoRequestDTO);

        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletaDadosTransacao(@PathVariable Integer id) {
        transacaoService.deletaDadosTransacao(id);
        return ResponseEntity.accepted().build();
    }
}
