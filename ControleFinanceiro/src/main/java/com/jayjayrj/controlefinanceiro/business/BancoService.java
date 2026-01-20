package com.jayjayrj.controlefinanceiro.business;
import com.jayjayrj.controlefinanceiro.api.converter.BancoConverter;
import com.jayjayrj.controlefinanceiro.api.converter.BancoMapper;
import com.jayjayrj.controlefinanceiro.api.request.BancoRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.BancoResponseDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.BancoEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.exceptions.BusinessException;
import com.jayjayrj.controlefinanceiro.infrastructure.repository.BancoRepository;
import com.mongodb.DuplicateKeyException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.springframework.util.Assert.notNull;

@Service
@RequiredArgsConstructor
public class BancoService {

    private final BancoRepository bancoRepository;
    private final BancoConverter bancoConverter;
    private final BancoMapper bancoMapper;


    public BancoEntity salvaBanco(BancoEntity bancoEntity) {
        System.out.println("Entrei no BancoService.salvaBanco()");

        return bancoRepository.save(bancoEntity);
    }

    public BancoResponseDTO gravarBancos(BancoRequestDTO bancoRequestDTO) {
        try {
            System.out.println("Entrei no BancoService.gravarBancos()");
            notNull(bancoRequestDTO, "Os dados do banco são obrigatórios");
            BancoEntity bancoEntity = salvaBanco(bancoConverter.paraBancoEntity(bancoRequestDTO));
            return bancoMapper.paraBancoResponseDTO(bancoEntity);
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("Banco já existe com esse id, nome ou número.");
        } catch (Exception e) {
            throw new BusinessException("Erro ao gravar dados de banco", e);
        }
    }

    public BancoResponseDTO buscaDadosBanco(String banco) {
        System.out.println("Entrei no BancoService.buscaDadosBanco()");
        BancoEntity entity = bancoRepository.findByNome(banco);

        return entity != null ? bancoMapper.paraBancoResponseDTO(entity) : null;
    }

    public BancoResponseDTO buscaDadosBancoPorId(Integer id) {
        System.out.println("Entrei no BancoService.buscaDadosBancoPorId()");
        Optional<BancoEntity> entity = bancoRepository.findById(id);

        return entity.map(bancoMapper::paraBancoResponseDTO).orElse(null);
    }

    public Page<BancoResponseDTO> listarBancos(int page, int size, String sortBy) {
        System.out.println("Entrei no BancoService.listarBancos()");

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        Page<BancoEntity> entityPage = bancoRepository.findAll(pageable);

        // mapeia cada entidade para DTO
        return entityPage.map(bancoMapper::paraBancoResponseDTO);
    }

    public BancoResponseDTO atualizarBanco(Integer id, BancoRequestDTO bancoRequestDTO) {
        Optional<BancoEntity> entityOpt = bancoRepository.findById(id);

        if (entityOpt.isPresent()) {
            BancoEntity entity = entityOpt.get();

            // Verifica duplicação de email
            BancoEntity existenteNome = bancoRepository.findByNome(bancoRequestDTO.getNome());
            if (existenteNome != null && !existenteNome.getId().equals(id)) {
                throw new RuntimeException("Já existe um banco com este nome.");
            }

            // Verifica duplicação de banco (login)
            BancoEntity existenteBanco = bancoRepository.findByNumero(bancoRequestDTO.getNumero());
            if (existenteBanco != null && !existenteBanco.getId().equals(id)) {
                throw new RuntimeException("Já existe um banco com este número.");
            }

            // Atualiza os campos necessários
            entity.setNome(bancoRequestDTO.getNome());
            entity.setNumero(bancoRequestDTO.getNumero());

            BancoEntity atualizado = bancoRepository.save(entity);
            return bancoMapper.paraBancoResponseDTO(atualizado);
        }

        throw new RuntimeException("Banco não encontrado!");
    }

    public void deletaDadosBanco(Integer id) {
        bancoRepository.deleteById(id);
    }
}
