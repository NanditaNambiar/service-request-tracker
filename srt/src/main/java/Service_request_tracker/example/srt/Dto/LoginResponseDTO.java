package Service_request_tracker.example.srt.Dto;

public class LoginResponseDTO {
    private Long id;               // 💥 ADD THIS
    private String accessToken;
    private String username;
    private String email;
    private String role;

    public LoginResponseDTO(Long id, String accessToken, String username, String email, String role) {
        this.id = id;
        this.accessToken = accessToken;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
