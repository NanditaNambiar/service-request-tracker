package Service_request_tracker.example.srt.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import Service_request_tracker.example.srt.Dto.RoleDTO;
import Service_request_tracker.example.srt.entity.Role;
import Service_request_tracker.example.srt.repository.RoleRepository;
import Service_request_tracker.example.srt.service.RoleService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }

    @Override
    public Role getRoleByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }

    @Override
    public void deleteRole(Long id) {
        Role role = getRoleById(id);
        roleRepository.delete(role);
    }

    @Override
    public RoleDTO mapToDTO(Role role) {
        RoleDTO dto = new RoleDTO();
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setDescription(role.getDescription());
        return dto;
    }
}
