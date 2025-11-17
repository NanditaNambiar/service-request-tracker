package Service_request_tracker.example.srt.service;

import java.util.List;

import Service_request_tracker.example.srt.entity.User;

public interface UserService {
    User createUser(User user);
    List<User> getUsersByRole(String roleName);
    User getUserById(Long id);
    List<User> getAllUsers(); 
    void deleteUser(Long id);
    User updateUser(Long id, User user);
   

}

