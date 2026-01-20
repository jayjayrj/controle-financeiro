package com.jayjayrj.controlefinanceiro.business;
import com.jayjayrj.controlefinanceiro.api.converter.UsuarioConverter;
import com.jayjayrj.controlefinanceiro.api.converter.UsuarioMapper;
import com.jayjayrj.controlefinanceiro.api.request.UsuarioRequestDTO;
import com.jayjayrj.controlefinanceiro.api.response.UsuarioResponseDTO;
import com.jayjayrj.controlefinanceiro.infrastructure.entity.UsuarioEntity;
import com.jayjayrj.controlefinanceiro.infrastructure.exceptions.BusinessException;
import com.jayjayrj.controlefinanceiro.infrastructure.repository.UsuarioRepository;
import com.mongodb.DuplicateKeyException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.springframework.util.Assert.notNull;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioConverter usuarioConverter;
    private final UsuarioMapper usuarioMapper;


    public UsuarioEntity salvaUsuario(UsuarioEntity usuarioEntity) {
        System.out.println("Entrei no UsuarioService.salvaUsuario()");

        return usuarioRepository.save(usuarioEntity);
    }

    public UsuarioResponseDTO gravarUsuarios(UsuarioRequestDTO usuarioRequestDTO) {
        try {
            System.out.println("Entrei no UsuarioService.gravarUsuarios()");
            notNull(usuarioRequestDTO, "Os dados do usuário são obrigatórios");
            UsuarioEntity usuarioEntity = salvaUsuario(usuarioConverter.paraUsuarioEntity(usuarioRequestDTO));
            return usuarioMapper.paraUsuarioResponseDTO(usuarioEntity);
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("Usuário já existe com esse id, nome, usuário ou email.");
        } catch (Exception e) {
            throw new BusinessException("Erro ao gravar dados de usuário", e);
        }
    }

    public UsuarioResponseDTO buscaDadosUsuario(String usuario, String senha) {
        System.out.println("Entrei no UsuarioService.buscaDadosUsuario()");
        UsuarioEntity entity = usuarioRepository.findByUsuarioAndSenha(usuario, senha);

        return entity != null ? usuarioMapper.paraUsuarioResponseDTO(entity) : null;
    }

    public UsuarioResponseDTO buscaDadosUsuarioPorId(Integer id) {
        System.out.println("Entrei no UsuarioService.buscaDadosUsuarioPorId()");
        Optional<UsuarioEntity> entity = usuarioRepository.findById(id);

        return entity.map(usuarioMapper::paraUsuarioResponseDTO).orElse(null);
    }

    public UsuarioResponseDTO atualizarUsuario(Integer id, UsuarioRequestDTO usuarioRequestDTO) {
        Optional<UsuarioEntity> entityOpt = usuarioRepository.findById(id);

        if (entityOpt.isPresent()) {
            UsuarioEntity entity = entityOpt.get();

            // Verifica duplicação de email
            UsuarioEntity existenteEmail = usuarioRepository.findByEmail(usuarioRequestDTO.getEmail());
            if (existenteEmail != null && !existenteEmail.getId().equals(id)) {
                throw new RuntimeException("Já existe um usuário com este email.");
            }

            // Verifica duplicação de usuario (login)
            UsuarioEntity existenteUsuario = usuarioRepository.findByUsuario(usuarioRequestDTO.getUsuario());
            if (existenteUsuario != null && !existenteUsuario.getId().equals(id)) {
                throw new RuntimeException("Já existe um usuário com este nome de usuário.");
            }

            // Atualiza os campos necessários
            entity.setNome(usuarioRequestDTO.getNome());
            entity.setEmail(usuarioRequestDTO.getEmail());
            entity.setUsuario(usuarioRequestDTO.getUsuario());
            entity.setSenha(usuarioRequestDTO.getSenha());

            UsuarioEntity atualizado = usuarioRepository.save(entity);
            return usuarioMapper.paraUsuarioResponseDTO(atualizado);
        }

        throw new RuntimeException("Usuário não encontrado!");
    }

    public void deletaDadosUsuario(Integer id) {

        usuarioRepository.deleteById(id);

    }
}
