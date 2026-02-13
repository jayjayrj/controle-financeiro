package com.jayjayrj.controlefinanceiro.business;
import com.jayjayrj.controlefinanceiro.api.converter.ContaCorrenteConverter;
import com.jayjayrj.controlefinanceiro.api.converter.ContaCorrenteMapper;
import com.jayjayrj.controlefinanceiro.api.request.ContaCorrenteRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.ContaCorrenteResponseDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.ContaCorrenteEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.exceptions.BusinessException;
import com.jayjayrj.controlefinanceiro.infrastructure.repository.ContaCorrenteRepository;
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
public class ContaCorrenteService {

    private final ContaCorrenteRepository contaCorrenteRepository;
    private final ContaCorrenteConverter contaCorrenteConverter;
    private final ContaCorrenteMapper contaCorrenteMapper;

    public ContaCorrenteEntity salvaContaCorrente(ContaCorrenteEntity contaCorrenteEntity) {
        System.out.println("Entrei no ContaCorrenteService.salvaContaCorrente()");

        return contaCorrenteRepository.save(contaCorrenteEntity);
    }

    public ContaCorrenteResponseDTO gravarContasCorrentes(ContaCorrenteRequestDTO contaCorrenteRequestDTO) {
        try {
            System.out.println("Entrei no ContaCorrenteService.gravarContasCorrentes()");
            notNull(contaCorrenteRequestDTO, "Os dados do conta de crédito são obrigatórios");
            ContaCorrenteEntity contaCorrenteEntity = salvaContaCorrente(contaCorrenteConverter.paraContaCorrenteEntity(contaCorrenteRequestDTO));
            return contaCorrenteMapper.paraContaCorrenteResponseDTO(contaCorrenteEntity);
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("Conta Corrente já existe com essas informações.");
        } catch (Exception e) {
            throw new BusinessException("Erro ao gravar dados da conta corrente", e);
        }
    }

    public ContaCorrenteResponseDTO buscaDadosContaCorrentePorId(Integer id) {
        System.out.println("Entrei no ContaCorrenteService.buscaDadosContaCorrentePorId()");
        Optional<ContaCorrenteEntity> entity = contaCorrenteRepository.findById(id);

        return entity.map(contaCorrenteMapper::paraContaCorrenteResponseDTO).orElse(null);
    }

    public Page<ContaCorrenteResponseDTO> listarContasCorrentes(int page, int size, String sortBy) {
        System.out.println("Entrei no ContaCorrenteService.listarContasCorrentes()");

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        Page<ContaCorrenteEntity> entityPage = contaCorrenteRepository.findAll(pageable);

        // mapeia cada entidade para DTO
        return entityPage.map(contaCorrenteMapper::paraContaCorrenteResponseDTO);
    }

    public ContaCorrenteResponseDTO atualizarContaCorrente(Integer id, ContaCorrenteRequestDTO contaCorrenteRequestDTO) {
        Optional<ContaCorrenteEntity> entityOpt = contaCorrenteRepository.findById(id);

        if (entityOpt.isPresent()) {
            ContaCorrenteEntity entity = entityOpt.get();

            // Verifica duplicação de email
            ContaCorrenteEntity existenteNome = contaCorrenteRepository.findByNumeroAgenciaAndNumeroConta(contaCorrenteRequestDTO.getNumeroAgencia(), contaCorrenteRequestDTO.getNumeroConta());
            if (existenteNome != null && !existenteNome.getId().equals(id)) {
                throw new RuntimeException("Já existe uma conta corrente com esta agência e número.");
            }

            // Atualiza os campos necessários
            entity.setNumeroAgencia(contaCorrenteRequestDTO.getNumeroAgencia());
            entity.setNumeroConta(contaCorrenteRequestDTO.getNumeroConta());
            entity.setSaldo(contaCorrenteRequestDTO.getSaldo());

            ContaCorrenteEntity atualizado = contaCorrenteRepository.save(entity);
            return contaCorrenteMapper.paraContaCorrenteResponseDTO(atualizado);
        }

        throw new RuntimeException("Conta Corrente não encontrada!");
    }

    public BigDecimal buscarSaldoPorId(Integer id) {

        ContaCorrenteEntity contaCorrenteEntity = contaCorrenteRepository.findById(id).orElse(null);
        if (contaCorrenteEntity != null) {
            return contaCorrenteEntity.getSaldo();
        }
        return null;
    }

    public void atualizarSaldoContaCorrente(Integer idContaCorrente, BigDecimal novoSaldo) {
        Optional<ContaCorrenteEntity> entityOpt = contaCorrenteRepository.findById(idContaCorrente);

        if (entityOpt.isPresent()) {
            ContaCorrenteEntity entity = entityOpt.get();

            // Atualiza os campos necessários
            entity.setSaldo(novoSaldo);

            contaCorrenteRepository.save(entity);
        } else {
            throw new RuntimeException("Conta Corrente não encontrada!");
        }
    }

    public void deletaDadosContaCorrente(Integer id) {
        contaCorrenteRepository.deleteById(id);
    }
}
