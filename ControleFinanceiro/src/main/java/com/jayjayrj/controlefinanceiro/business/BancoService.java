package com.jayjayrj.controlefinanceiro.business;
import com.jayjayrj.controlefinanceiro.api.converter.BancoConverter;
import com.jayjayrj.controlefinanceiro.api.converter.BancoMapper;
import com.jayjayrj.controlefinanceiro.api.request.BancoRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.BancoResponseDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.BancoEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.exceptions.BusinessException;
import com.jayjayrj.controlefinanceiro.infrastructure.repository.BancoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

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
        } catch (Exception e) {
            throw new BusinessException("Erro ao gravar dados de banco", e);
        }
    }

    public BancoResponseDTO buscaDadosBanco(String banco) {
        System.out.println("Entrei no BancoService.buscaDadosBanco()");
        BancoEntity entity = bancoRepository.findByNome(banco);

        return entity != null ? bancoMapper.paraBancoResponseDTO(entity) : null;
    }

    public Page<BancoResponseDTO> listarBancos(int page, int size, String sortBy) {
        System.out.println("Entrei no BancoService.listarBancos()");

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        Page<BancoEntity> entityPage = bancoRepository.findAll(pageable);

        // mapeia cada entidade para DTO
        return entityPage.map(bancoMapper::paraBancoResponseDTO);
    }

}
