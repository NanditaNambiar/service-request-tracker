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

import Service_request_tracker.example.srt.Dto.UserDTO;
import Service_request_tracker.example.srt.entity.User;
import Service_request_tracker.example.srt.serviceImpl.UserServiceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserServiceImpl userService;

    // ➕ Create user — only ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @Operation(summary = "Create a new user")
    @ApiResponse(responseCode = "201", description = "User created successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class)))
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            User savedUser = userService.createUser(user);
            response.put("message", "User created successfully");
            response.put("data", userService.mapToDTO(savedUser));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 📋 Get all users — only ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    @Operation(summary = "Get all users")
    @ApiResponse(responseCode = "200", description = "All users retrieved successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class)))
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<UserDTO> dtos = userService.getAllUsers().stream()
                    .map(userService::mapToDTO)
                    .collect(Collectors.toList());
            response.put("message", "All users retrieved successfully");
            response.put("data", dtos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 🔍 Get user by ID — ADMIN or the user itself
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    @ApiResponse(responseCode = "200", description = "User retrieved successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class)))
    public ResponseEntity<Map<String, Object>> getUser(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userService.getUserById(id);
            response.put("message", "User retrieved successfully");
            response.put("data", userService.mapToDTO(user));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ❌ Delete user — ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user by ID")
    @ApiResponse(responseCode = "200", description = "User deleted successfully",
            content = @Content(mediaType = "application/json"))
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            userService.deleteUser(id);
            response.put("message", "User deleted successfully");
            response.put("data", null);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("data", null);
            String message = e.getMessage();
            if (message != null && message.contains("service requests")) {
                response.put("message", message);
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response); // 409
            } else if (message != null && message.contains("could not execute statement")) {
                response.put("message", "Cannot delete user — this user has submitted service requests.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response); // 409
            } else if (message != null && message.contains("User not found")) {
                response.put("message", message);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response); // 404
            } else {
                response.put("message", "Unexpected error: " + message);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }
    }

    // 🔄 Update user — ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    @Operation(summary = "Update a user by ID")
    @ApiResponse(responseCode = "200", description = "User updated successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class)))
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long id, @RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            User updatedUser = userService.updateUser(id, user);
            response.put("message", "User updated successfully");
            response.put("data", userService.mapToDTO(updatedUser));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
