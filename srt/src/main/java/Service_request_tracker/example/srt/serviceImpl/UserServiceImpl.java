package Service_request_tracker.example.srt.serviceImpl;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import Service_request_tracker.example.srt.Dto.UserDTO;
import Service_request_tracker.example.srt.entity.User;
import Service_request_tracker.example.srt.repository.UserRepository;
import Service_request_tracker.example.srt.service.UserService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    /*@Override
    public User createUser(User user) {
        return userRepository.save(user);
    }*/

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
public void deleteUser(Long id) {
    try {
        User user = getUserById(id);
        System.out.println("Deleting user with ID: " + user.getId());
        userRepository.delete(user);
    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Error deleting user: " + e.getMessage());
    }
}

    @Override
        public List<User> getUsersByRole(String roleName) {
        return userRepository.findByRoleName(roleName);
    }


    // 🔄 Map User entity to DTO
    public UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername()); // matches your entity
        dto.setEmail(user.getEmail());
        dto.setRoleName(user.getRole() != null ? user.getRole().getName() : null);
        dto.setDepartmentName(user.getDepartment() != null ? user.getDepartment().getName() : null);
        dto.setCategoryName(user.getCategory() != null ? user.getCategory().getName() : null);
        return dto;
    }

@Override
public User updateUser(Long id, User user) {
    User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

    // Update fields
    existingUser.setUsername(user.getUsername());
    existingUser.setEmail(user.getEmail());

    // Only hash and update password if a new password is provided
    if (user.getPassword() != null && !user.getPassword().isEmpty()) {
        existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
    }

    // Only update department/role/category if they have IDs set (not null)
    if (user.getDepartment() != null && user.getDepartment().getId() != null) {
        existingUser.setDepartment(user.getDepartment());
    }
    if (user.getRole() != null && user.getRole().getId() != null) {
        existingUser.setRole(user.getRole());
    }
    if (user.getCategory() != null && user.getCategory().getId() != null) {
        existingUser.setCategory(user.getCategory());
    }

    return userRepository.save(existingUser);
}
@Autowired
private PasswordEncoder passwordEncoder;

@Override
public User createUser(User user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
}

}
