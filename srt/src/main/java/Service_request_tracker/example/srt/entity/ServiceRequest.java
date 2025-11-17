package Service_request_tracker.example.srt.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "service_requests")
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // must match mapToDTO

    @ManyToOne
    private Category category;

    @ManyToOne
    private User createdBy;

    @ManyToOne
    private User handledBy;

    private Boolean status; // true=open, false=closed

    private String description;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }  // ✅ this fixes your error
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public User getHandledBy() { return handledBy; }
    public void setHandledBy(User handledBy) { this.handledBy = handledBy; }

    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }
}
