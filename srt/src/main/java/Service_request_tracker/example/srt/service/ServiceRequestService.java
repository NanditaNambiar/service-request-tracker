package Service_request_tracker.example.srt.service;

import java.util.List;

import Service_request_tracker.example.srt.Dto.ServiceRequestDTO;
import Service_request_tracker.example.srt.entity.ServiceRequest;

public interface ServiceRequestService {

    ServiceRequest createRequest(ServiceRequest request);

    List<ServiceRequest> getRequestsForUser(Long userId);

    List<ServiceRequest> getRequestsForITStaff(Long userId);

    ServiceRequest closeRequest(Long requestId);

    void deleteRequest(Long requestId);

    // 🔄 Map entity to DTO
    ServiceRequestDTO mapToDTO(ServiceRequest request);
    public List<ServiceRequest> getRequestsForUserByEmail(String email);
    List<ServiceRequest> getRequestsForITStaffByEmail(String email);

}
