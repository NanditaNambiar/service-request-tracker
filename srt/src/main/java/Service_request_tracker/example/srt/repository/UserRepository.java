package Service_request_tracker.example.srt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import Service_request_tracker.example.srt.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByRoleName(String roleName);
    List<User> findByRoleNameAndCategoryId(String roleName, Long categoryId);
    Optional<User> findByEmail(String email);
    List<User> findByRoleNameIgnoreCase(String roleName);
    

}
