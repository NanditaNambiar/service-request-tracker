package Service_request_tracker.example.srt.controller;

import Service_request_tracker.example.srt.Dto.LoginRequestDTO;
import Service_request_tracker.example.srt.Dto.LoginResponseDTO;
import Service_request_tracker.example.srt.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO loginRequest) {
        return authService.login(loginRequest);
    }
}
