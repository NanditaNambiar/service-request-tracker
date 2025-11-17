package Service_request_tracker.example.srt.service;

import Service_request_tracker.example.srt.Dto.LoginRequestDTO;
import Service_request_tracker.example.srt.Dto.LoginResponseDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO loginRequest);
}
