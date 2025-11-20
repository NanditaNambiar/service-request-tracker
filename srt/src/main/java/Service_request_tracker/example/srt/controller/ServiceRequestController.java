package Service_request_tracker.example.srt.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import Service_request_tracker.example.srt.Dto.ServiceRequestDTO;
import Service_request_tracker.example.srt.entity.ServiceRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import Service_request_tracker.example.srt.serviceImpl.ServiceRequestServiceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServiceRequestController {

    private final ServiceRequestServiceImpl requestService;

    // ➕ Create a new service request (USER or ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Create a new service request")
    @ApiResponse(
            responseCode = "201",
            description = "Service request created successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ServiceRequestDTO.class))
    )
    public ResponseEntity<Map<String, Object>> createRequest(@RequestBody ServiceRequest request) {
        ServiceRequest savedRequest = requestService.createRequest(request);
        Map<String, Object> response = Map.of(
                "message", "Service request created successfully",
                "data", requestService.mapToDTO(savedRequest)
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 📋 Get requests for a user (USER can see their own)
    @GetMapping("/user/{email}")
@PreAuthorize("#email == principal.username or hasRole('ADMIN')")
public ResponseEntity<Map<String, Object>> getRequestsForUser(@PathVariable String email) {
    List<ServiceRequestDTO> dtos = requestService.getRequestsForUserByEmail(email).stream()
            .map(requestService::mapToDTO)
            .collect(Collectors.toList());
    Map<String, Object> response = Map.of(
            "message", "User requests retrieved successfully",
            "data", dtos
    );
    return ResponseEntity.ok(response);
}

    // 📋 Get all requests (ADMIN only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('IT_STAFF')")
    @Operation(summary = "Get all service requests")
    @ApiResponse(
            responseCode = "200",
            description = "All service requests retrieved successfully",
            content = @Content(mediaType = "application/json")
    )
    public ResponseEntity<Map<String, Object>> getAllRequests() {
        try {
            List<ServiceRequestDTO> dtos = requestService.getAllRequests().stream()
                    .map(requestService::mapToDTO)
                    .collect(Collectors.toList());
            Map<String, Object> response = Map.of(
                    "message", "All requests retrieved successfully",
                    "data", dtos
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in getAllRequests: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = Map.of(
                    "message", "Error fetching requests: " + e.getMessage(),
                    "data", new java.util.ArrayList<>()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // 📋 Get requests for IT staff (assigned to them)
    @GetMapping("/itstaff/{email}")
@PreAuthorize("#email == principal.username or hasRole('ADMIN')")
public ResponseEntity<Map<String, Object>> getRequestsForITStaff(@PathVariable String email) {
    List<ServiceRequestDTO> dtos = requestService.getRequestsForITStaffByEmail(email).stream()
            .map(requestService::mapToDTO)
            .collect(Collectors.toList());
    Map<String, Object> response = Map.of(
            "message", "IT staff requests retrieved successfully",
            "data", dtos
    );
    return ResponseEntity.ok(response);
}



@PutMapping("/{requestId}/close")
@PreAuthorize("hasRole('IT_STAFF') or hasRole('ADMIN')")
@Operation(summary = "Close a service request")
@ApiResponse(
        responseCode = "200",
        description = "Service request closed successfully",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = ServiceRequestDTO.class))
)
public ResponseEntity<Map<String, Object>> closeRequest(
        @PathVariable Long requestId,
        @AuthenticationPrincipal UserDetails currentUser) {

    // Use email from JWT
    String email = currentUser.getUsername();

    // Service method checks if email matches assigned IT staff
    ServiceRequest closedRequest = requestService.closeRequestByEmail(requestId, email);

    Map<String, Object> response = Map.of(
            "message", "Service request closed successfully",
            "data", requestService.mapToDTO(closedRequest)
    );
    return ResponseEntity.ok(response);
}


    // ❌ Delete a service request (only ADMIN)
@DeleteMapping("/{requestId}")
@PreAuthorize("hasRole('IT_STAFF') or hasRole('ADMIN')")
public ResponseEntity<Map<String, Object>> deleteRequest(@PathVariable Long requestId) {
    requestService.deleteRequest(requestId);

    Map<String, Object> response = new HashMap<>();
    response.put("message", "Service request deleted successfully");
    response.put("data", null);  // null is fine in HashMap
    return ResponseEntity.ok(response);
}


}
