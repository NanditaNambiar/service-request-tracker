package Service_request_tracker.example.srt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import Service_request_tracker.example.srt.entity.Category;
import Service_request_tracker.example.srt.entity.ServiceRequest;
import Service_request_tracker.example.srt.entity.User;

import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByCreatedBy(User user);
    List<ServiceRequest> findByHandledBy(User handledBy);
    List<ServiceRequest> findByCategory(Category category);

}

