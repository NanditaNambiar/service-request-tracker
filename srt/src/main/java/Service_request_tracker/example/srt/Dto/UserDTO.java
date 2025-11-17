package Service_request_tracker.example.srt.Dto;

public class UserDTO {

    private Long id;
    private String username;          // updated from 'name'
    private String email;
    private String roleName;          // Role name only, not full Role object
    private String departmentName;    // Department name only, not full Department object

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
}
