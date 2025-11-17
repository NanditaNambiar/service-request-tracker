package Service_request_tracker.example.srt.service;

import java.util.List;

import Service_request_tracker.example.srt.Dto.RoleDTO;
import Service_request_tracker.example.srt.entity.Role;

public interface RoleService {

    Role createRole(Role role);

    List<Role> getAllRoles();

    Role getRoleById(Long id);

    Role getRoleByName(String name);

    void deleteRole(Long id);

    // Map entity to DTO
    RoleDTO mapToDTO(Role role);
}
