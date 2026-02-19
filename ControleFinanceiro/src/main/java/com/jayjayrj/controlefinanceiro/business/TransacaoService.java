package com.jayjayrj.controlefinanceiro.business;
import com.jayjayrj.controlefinanceiro.api.converter.TransacaoConverter;
import com.jayjayrj.controlefinanceiro.api.converter.TransacaoMapper;
import com.jayjayrj.controlefinanceiro.api.request.TransacaoRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.TransacaoResponseDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.TransacaoEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.exceptions.BusinessException;
import com.jayjayrj.controlefinanceiro.infrastructure.repository.TransacaoRepository;
import com.mongodb.DuplicateKeyException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

import static org.springframework.util.Assert.notNull;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final TransacaoConverter transacaoConverter;
    private final TransacaoMapper transacaoMapper;
    private final ContaCorrenteService contaCorrenteService;
    private final CartaoCreditoService cartaoCreditoService;

    public TransacaoEntity salvaTransacao(TransacaoEntity transacaoEntity) {
        System.out.println("Entrei no TransacaoService.salvaTransacao()");

        return transacaoRepository.save(transacaoEntity);
    }

    public TransacaoResponseDTO gravarTransacoes(TransacaoRequestDTO transacaoRequestDTO) {
        try {
            System.out.println("Entrei no TransacaoService.gravarTransacoes()");
            notNull(transacaoRequestDTO, "Os dados da transação são obrigatórios");
            TransacaoEntity transacaoEntity = salvaTransacao(transacaoConverter.paraTransacaoEntity(transacaoRequestDTO));

            // Se for uma transação de Conta Corrente, atualizar saldo. Senão, atualizar limite do cartão
            if (transacaoRequestDTO.getIdConta() != null) {
                BigDecimal saldoAtual = contaCorrenteService.buscarSaldoPorId(transacaoRequestDTO.getIdConta());
                BigDecimal saldoAtualizado = null;
                System.out.println("TransacaoService::gravarTransacoes::transacaoRequestDTO.getNaturezaOperacao() = " + transacaoRequestDTO.getNaturezaOperacao());
                if (Integer.valueOf(0).equals(transacaoRequestDTO.getNaturezaOperacao())) {
                    saldoAtualizado = saldoAtual.subtract(transacaoRequestDTO.getValor());
                } else {
                    saldoAtualizado = saldoAtual.add(transacaoRequestDTO.getValor());
                }
                contaCorrenteService.atualizarSaldoContaCorrente(transacaoRequestDTO.getIdConta(), saldoAtualizado);
            } else {
                BigDecimal limiteAtual = cartaoCreditoService.buscarLimitePorId(transacaoRequestDTO.getIdCartao());
                BigDecimal limiteAtualizado = null;
                System.out.println("TransacaoService::gravarTransacoes::transacaoRequestDTO.getNaturezaOperacao() = " + transacaoRequestDTO.getNaturezaOperacao());
                if (Integer.valueOf(0).equals(transacaoRequestDTO.getNaturezaOperacao())) {
                    limiteAtualizado = limiteAtual.subtract(transacaoRequestDTO.getValor());
                } else {
                    limiteAtualizado = limiteAtual.add(transacaoRequestDTO.getValor());
                }
                cartaoCreditoService.atualizarLimiteCartaoCredito(transacaoRequestDTO.getIdCartao(), limiteAtualizado);
            }

            return transacaoMapper.paraTransacaoResponseDTO(transacaoEntity);
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("Transação já existe com essas informações.");
        } catch (Exception e) {
            throw new BusinessException("Erro ao gravar dados da transação corrente", e);
        }
    }

    public TransacaoResponseDTO buscaDadosTransacaoPorId(Integer id) {
        System.out.println("Entrei no TransacaoService.buscaDadosTransacaoPorId()");
        Optional<TransacaoEntity> entity = transacaoRepository.findById(id);

        return entity.map(transacaoMapper::paraTransacaoResponseDTO).orElse(null);
    }

    public Page<TransacaoResponseDTO> listarTransacoes(int page, int size, String sortBy) {
        System.out.println("Entrei no TransacaoService.listarTransacoes()");

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        Page<TransacaoEntity> entityPage = transacaoRepository.findAll(pageable);

        // mapeia cada entidade para DTO
        return entityPage.map(transacaoMapper::paraTransacaoResponseDTO);
    }

    public Page<TransacaoResponseDTO> listarTransacoesPorIdConta(int idConta, int page, int size, String sortBy) {
        System.out.println("Entrei no TransacaoService.listarTransacoesPorIdConta()");

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        Page<TransacaoEntity> entityPage = transacaoRepository.findByIdConta(idConta, pageable);

        // mapeia cada entidade para DTO
        return entityPage.map(transacaoMapper::paraTransacaoResponseDTO);
    }

    public Page<TransacaoResponseDTO> listarTransacoesPorIdCartao(int idCartao, int page, int size, String sortBy) {
        System.out.println("Entrei no TransacaoService.listarTransacoesPorIdCartao()");

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        Page<TransacaoEntity> entityPage = transacaoRepository.findByIdCartao(idCartao, pageable);

        // mapeia cada entidade para DTO
        return entityPage.map(transacaoMapper::paraTransacaoResponseDTO);
    }

    public TransacaoResponseDTO atualizarTransacao(Integer id, TransacaoRequestDTO transacaoRequestDTO) {
        Optional<TransacaoEntity> entityOpt = transacaoRepository.findById(id);

        BigDecimal valorAntigo;
        Integer naturezaAntiga;
        if (entityOpt.isPresent()) {
            TransacaoEntity entity = entityOpt.get();

            // Guarda o natureza e valor antigo para uso futuro
            naturezaAntiga = entity.getNaturezaOperacao();
            valorAntigo = entity.getValor();

            // Atualiza os campos necessários
            entity.setNaturezaOperacao(transacaoRequestDTO.getNaturezaOperacao());
            entity.setIdConta(transacaoRequestDTO.getIdConta());
            entity.setIdCartao(transacaoRequestDTO.getIdCartao());
            entity.setDescricao(transacaoRequestDTO.getDescricao());
            entity.setData(transacaoRequestDTO.getData());
            entity.setValor(transacaoRequestDTO.getValor());
            entity.setQuantidadeVezes(transacaoRequestDTO.getQuantidadeVezes());

            TransacaoEntity atualizado = transacaoRepository.save(entity);

            // Se for uma transação de Conta Corrente, atualizar saldo. Senão, atualizar limite do cartão
            if (transacaoRequestDTO.getIdConta() != null) {
                BigDecimal saldoAtual = contaCorrenteService.buscarSaldoPorId(transacaoRequestDTO.getIdConta());
                // Remove o valor antigo do saldo
                BigDecimal saldoAtualizado;
                // Se o valor antigo era despesa, adiciona o valor e vice-versa
                if (Integer.valueOf(0).equals(naturezaAntiga)) {
                    saldoAtualizado = saldoAtual.add(valorAntigo);
                } else {
                    saldoAtualizado = saldoAtual.subtract(valorAntigo);
                }
                // Atualiza o saldo com o valor alterado
                if (Integer.valueOf(0).equals(transacaoRequestDTO.getNaturezaOperacao())) {
                    saldoAtualizado = saldoAtualizado.subtract(transacaoRequestDTO.getValor());
                } else {
                    saldoAtualizado = saldoAtualizado.add(transacaoRequestDTO.getValor());
                }
                contaCorrenteService.atualizarSaldoContaCorrente(transacaoRequestDTO.getIdConta(), saldoAtualizado);
            } else {
                BigDecimal limiteAtual = cartaoCreditoService.buscarLimitePorId(transacaoRequestDTO.getIdCartao());
                // Remove o valor antigo do limite
                BigDecimal limiteAtualizado;
                // Se o valor antigo era despesa, adiciona o valor e vice-versa
                if (Integer.valueOf(0).equals(naturezaAntiga)) { // 0 = Despesa
                    limiteAtualizado = limiteAtual.add(valorAntigo);
                } else {
                    limiteAtualizado = limiteAtual.subtract(valorAntigo);
                }
                // Atualiza o limite com o valor alterado
                if (Integer.valueOf(0).equals(transacaoRequestDTO.getNaturezaOperacao())) {  // 0 = Despesa
                    limiteAtualizado = limiteAtualizado.subtract(transacaoRequestDTO.getValor());
                } else {
                    limiteAtualizado = limiteAtualizado.add(transacaoRequestDTO.getValor());
                }
                cartaoCreditoService.atualizarLimiteCartaoCredito(transacaoRequestDTO.getIdCartao(), limiteAtualizado);
            }
            return transacaoMapper.paraTransacaoResponseDTO(atualizado);
        }

        throw new RuntimeException("Transação não encontrada!");
    }

    public void deletaDadosTransacao(Integer id) {
        Optional<TransacaoEntity> entityOpt = transacaoRepository.findById(id);
        if (entityOpt.isPresent()) {
            TransacaoEntity entity = entityOpt.get();
            // Se for uma transação de Conta Corrente, atualizar saldo. Senão, atualizar limite do cartão
            if (entity.getIdConta() != null) {
                BigDecimal saldoAtual = contaCorrenteService.buscarSaldoPorId(entity.getIdConta());
                // Remove o valor do saldo
                BigDecimal saldoAtualizado;
                if (Integer.valueOf(0).equals(entity.getNaturezaOperacao())) { // 0 = Despesa
                    saldoAtualizado = saldoAtual.add(entity.getValor());
                } else {
                    saldoAtualizado = saldoAtual.subtract(entity.getValor());
                }
                contaCorrenteService.atualizarSaldoContaCorrente(entity.getIdConta(), saldoAtualizado);
            } else {
                BigDecimal limiteAtual = cartaoCreditoService.buscarLimitePorId(entity.getIdCartao());
                // Remove o valor do limite
                BigDecimal limiteAtualizado;
                if (Integer.valueOf(0).equals(entity.getNaturezaOperacao())) { // 0 = Despesa
                    limiteAtualizado = limiteAtual.add(entity.getValor());
                } else {
                    limiteAtualizado = limiteAtual.subtract(entity.getValor());
                }
                cartaoCreditoService.atualizarLimiteCartaoCredito(entity.getIdCartao(), limiteAtualizado);
            }
        }

        transacaoRepository.deleteById(id);
    }
}
