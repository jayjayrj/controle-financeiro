package com.jayjayrj.controlefinanceiro.business;
import com.jayjayrj.controlefinanceiro.api.converter.CartaoCreditoConverter;
import com.jayjayrj.controlefinanceiro.api.converter.CartaoCreditoMapper;
import com.jayjayrj.controlefinanceiro.api.request.CartaoCreditoRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.CartaoCreditoResponseDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.CartaoCreditoEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.exceptions.BusinessException;
import com.jayjayrj.controlefinanceiro.infrastructure.repository.CartaoCreditoRepository;
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
public class CartaoCreditoService {

    private final CartaoCreditoRepository cartaoCreditoRepository;
    private final CartaoCreditoConverter cartaoCreditoConverter;
    private final CartaoCreditoMapper cartaoCreditoMapper;


    public CartaoCreditoEntity salvaCartaoCredito(CartaoCreditoEntity cartaoCreditoEntity) {
        System.out.println("Entrei no CartaoCreditoService.salvaCartaoCredito()");

        return cartaoCreditoRepository.save(cartaoCreditoEntity);
    }

    public CartaoCreditoResponseDTO gravarCartoesCredito(CartaoCreditoRequestDTO cartaoCreditoRequestDTO) {
        try {
            System.out.println("Entrei no CartaoCreditoService.gravarCartoesCredito()");
            notNull(cartaoCreditoRequestDTO, "Os dados do cartao de crédito são obrigatórios");
            CartaoCreditoEntity cartaoCreditoEntity = salvaCartaoCredito(cartaoCreditoConverter.paraCartaoCreditoEntity(cartaoCreditoRequestDTO));
            return cartaoCreditoMapper.paraCartaoCreditoResponseDTO(cartaoCreditoEntity);
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("Cartao de Crédito já existe com essas informações.");
        } catch (Exception e) {
            throw new BusinessException("Erro ao gravar dados do cartao de crédito", e);
        }
    }

    public CartaoCreditoResponseDTO buscaDadosCartaoCredito(String cartaoCredito) {
        System.out.println("Entrei no CartaoCreditoService.buscaDadosCartaoCredito()");
        CartaoCreditoEntity entity = cartaoCreditoRepository.findByNome(cartaoCredito);

        return entity != null ? cartaoCreditoMapper.paraCartaoCreditoResponseDTO(entity) : null;
    }

    public CartaoCreditoResponseDTO buscaDadosCartaoCreditoPorId(Integer id) {
        System.out.println("Entrei no CartaoCreditoService.buscaDadosCartaoCreditoPorId()");
        Optional<CartaoCreditoEntity> entity = cartaoCreditoRepository.findById(id);

        return entity.map(cartaoCreditoMapper::paraCartaoCreditoResponseDTO).orElse(null);
    }

    public Page<CartaoCreditoResponseDTO> listarCartoesCredito(int page, int size, String sortBy) {
        System.out.println("Entrei no CartaoCreditoService.listarCartoesCredito()");

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        Page<CartaoCreditoEntity> entityPage = cartaoCreditoRepository.findAll(pageable);

        // mapeia cada entidade para DTO
        return entityPage.map(cartaoCreditoMapper::paraCartaoCreditoResponseDTO);
    }

    public CartaoCreditoResponseDTO atualizarCartaoCredito(Integer id, CartaoCreditoRequestDTO cartaoCreditoRequestDTO) {
        Optional<CartaoCreditoEntity> entityOpt = cartaoCreditoRepository.findById(id);

        if (entityOpt.isPresent()) {
            CartaoCreditoEntity entity = entityOpt.get();

            // Verifica duplicação de email
            CartaoCreditoEntity existenteNome = cartaoCreditoRepository.findByNome(cartaoCreditoRequestDTO.getNome());
            if (existenteNome != null && !existenteNome.getId().equals(id)) {
                throw new RuntimeException("Já existe um cartao de crédito com este nome.");
            }

            // Verifica duplicação de cartaoCredito (login)
            CartaoCreditoEntity existenteCartaoCredito = cartaoCreditoRepository.findByNumero(cartaoCreditoRequestDTO.getNumero());
            if (existenteCartaoCredito != null && !existenteCartaoCredito.getId().equals(id)) {
                throw new RuntimeException("Já existe um cartao de crédito com este número.");
            }

            // Atualiza os campos necessários
            entity.setBandeira(cartaoCreditoRequestDTO.getBandeira());
            entity.setNome(cartaoCreditoRequestDTO.getNome());
            entity.setNumero(cartaoCreditoRequestDTO.getNumero());
            entity.setVencimento(cartaoCreditoRequestDTO.getVencimento());
            entity.setLimite(cartaoCreditoRequestDTO.getLimite());

            CartaoCreditoEntity atualizado = cartaoCreditoRepository.save(entity);
            return cartaoCreditoMapper.paraCartaoCreditoResponseDTO(atualizado);
        }

        throw new RuntimeException("Cartao de Crédito não encontrado!");
    }

    public void deletaDadosCartaoCredito(Integer id) {
        cartaoCreditoRepository.deleteById(id);
    }
}
