package Service_request_tracker.example.srt.serviceImpl;

import Service_request_tracker.example.srt.Dto.LoginRequestDTO;
import Service_request_tracker.example.srt.Dto.LoginResponseDTO;
import Service_request_tracker.example.srt.entity.User;
import Service_request_tracker.example.srt.repository.UserRepository;
import Service_request_tracker.example.srt.service.AuthService;
import Service_request_tracker.example.srt.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        // Authenticate using email
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JWT token based on email
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().getName());

        return new LoginResponseDTO(token, user.getUsername(), user.getEmail(), user.getRole().getName());

    }
}
