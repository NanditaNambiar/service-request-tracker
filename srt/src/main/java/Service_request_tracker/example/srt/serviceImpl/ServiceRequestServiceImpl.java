package Service_request_tracker.example.srt.serviceImpl;

import Service_request_tracker.example.srt.Dto.ServiceRequestDTO;
import Service_request_tracker.example.srt.entity.Category;
import Service_request_tracker.example.srt.entity.ServiceRequest;
import Service_request_tracker.example.srt.entity.User;
import Service_request_tracker.example.srt.exception.ResourceNotFoundException;
import Service_request_tracker.example.srt.repository.CategoryRepository;
import Service_request_tracker.example.srt.repository.ServiceRequestRepository;
import Service_request_tracker.example.srt.repository.UserRepository;
import Service_request_tracker.example.srt.service.ServiceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ServiceRequestServiceImpl implements ServiceRequestService {

    private final ServiceRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    // Round-robin tracker per category
    private final Map<Long, Integer> categoryITIndexMap = new HashMap<>();

    @Override
public ServiceRequest createRequest(ServiceRequest request) {
    // Fetch category
    Category category = categoryRepository.findById(request.getCategory().getId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
    request.setCategory(category);

    // ✅ Set createdBy user
    if (request.getCreatedBy() == null || request.getCreatedBy().getId() == null) {
        throw new RuntimeException("CreatedBy user must be provided");
    }
    User creator = userRepository.findById(request.getCreatedBy().getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
    request.setCreatedBy(creator);

    // ✅ Get IT staff only for this category
    List<User> itStaffList = userRepository.findByRoleNameIgnoreCase("ROLE_IT_STAFF").stream()

            .filter(u -> u.getCategory() != null && u.getCategory().getId().equals(category.getId()))
            .toList();

    // Assign IT staff using round-robin
    if (!itStaffList.isEmpty()) {
        int index = categoryITIndexMap.getOrDefault(category.getId(), 0);
        User assignedStaff = itStaffList.get(index % itStaffList.size());
        request.setHandledBy(assignedStaff);
        categoryITIndexMap.put(category.getId(), (index + 1) % itStaffList.size());
    }

    request.setStatus(true); // open by default
    return requestRepository.save(request);
}



    @Override
    public List<ServiceRequest> getRequestsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByCreatedBy(user);
    }

    @Override
    public List<ServiceRequest> getRequestsForITStaff(Long userId) {
        User staff = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByHandledBy(staff);
    }

    @Override
    public ServiceRequest closeRequest(Long requestId) {
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(false);
        return requestRepository.save(request);
    }

    @Override
public void deleteRequest(Long requestId) {
    ServiceRequest request = requestRepository.findById(requestId)
            .orElseThrow(() -> new ResourceNotFoundException("Service request not found with id: " + requestId));
    // Optional null check for related fields if needed
    requestRepository.delete(request);
}
    @Override
public List<ServiceRequest> getRequestsForUserByEmail(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    return requestRepository.findByCreatedBy(user);
}
@Override
public List<ServiceRequest> getRequestsForITStaffByEmail(String email) {
    User staff = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    return requestRepository.findByHandledBy(staff);
}

    @Override
    public List<ServiceRequest> getAllRequests() {
        try {
            List<ServiceRequest> requests = requestRepository.findAll();
            System.out.println("Total requests fetched: " + requests.size());
            return requests;
        } catch (Exception e) {
            System.err.println("Error fetching all requests: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public ServiceRequestDTO mapToDTO(ServiceRequest request) {
        ServiceRequestDTO dto = new ServiceRequestDTO();
        dto.setId(request.getId());
        dto.setTitle(request.getTitle());
        dto.setDescription(request.getDescription());
        dto.setCategoryName(request.getCategory() != null ? request.getCategory().getName() : null);
        dto.setCreatedByName(request.getCreatedBy() != null ? request.getCreatedBy().getUsername() : null);
        dto.setHandledByName(request.getHandledBy() != null ? request.getHandledBy().getUsername() : null);
        dto.setStatus(request.getStatus());
        return dto;
    }
    public boolean isHandledBy(Long requestId, String email) {
    ServiceRequest request = requestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));
    return request.getHandledBy() != null && request.getHandledBy().getEmail().equals(email);
}

public ServiceRequest closeRequestByEmail(Long requestId, String email) {
    ServiceRequest request = requestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

    if (!request.getHandledBy().getEmail().equals(email)) {
        throw new RuntimeException("You are not authorized to close this request");
    }

    request.setStatus(false);
    return requestRepository.save(request);
}

}
