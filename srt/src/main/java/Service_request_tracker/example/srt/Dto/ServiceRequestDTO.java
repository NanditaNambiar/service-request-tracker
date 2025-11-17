package Service_request_tracker.example.srt.Dto;

public class ServiceRequestDTO {

    private Long id;
    private String title;
    private String description;
    private String categoryName;       // Category name only
    private String createdByName;      // User name only
    private String handledByName;      // IT Staff name only
    private Boolean status;            // true=open, false=closed

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

    public String getHandledByName() { return handledByName; }
    public void setHandledByName(String handledByName) { this.handledByName = handledByName; }

    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }
}
