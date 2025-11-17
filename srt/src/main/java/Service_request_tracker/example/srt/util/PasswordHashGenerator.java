package Service_request_tracker.example.srt.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "password123"; // same as your DB password
        String hashedPassword = encoder.encode(rawPassword);
        System.out.println("Hashed password: " + hashedPassword);
    }
}
