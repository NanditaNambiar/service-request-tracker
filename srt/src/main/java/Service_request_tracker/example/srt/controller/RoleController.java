package Service_request_tracker.example.srt.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Service_request_tracker.example.srt.Dto.RoleDTO;
import Service_request_tracker.example.srt.entity.Role;
import Service_request_tracker.example.srt.serviceImpl.RoleServiceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoleController {

    private final RoleServiceImpl roleService;

    // ➕ Create a new role
    @PostMapping
    @Operation(summary = "Create a new role")
    @ApiResponse(
            responseCode = "201",
            description = "Role created successfully",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = RoleDTO.class)
            )
    )
    public ResponseEntity<Map<String, Object>> createRole(@RequestBody Role role) {
        Map<String, Object> response = new HashMap<>();
        try {
            Role savedRole = roleService.createRole(role);
            response.put("message", "Role created successfully");
            response.put("data", roleService.mapToDTO(savedRole));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            response.put("message", "Role already exists");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 📋 Get all roles
    @GetMapping
    @Operation(summary = "Get all roles")
    @ApiResponse(
            responseCode = "200",
            description = "Roles retrieved successfully",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = RoleDTO.class)
            )
    )
    public ResponseEntity<Map<String, Object>> getAllRoles() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<RoleDTO> dtos = roleService.getAllRoles().stream()
                    .map(roleService::mapToDTO)
                    .collect(Collectors.toList());
            response.put("message", "Roles retrieved successfully");
            response.put("data", dtos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 🔍 Get role by ID
    @GetMapping("/{id}")
    @Operation(summary = "Get role by ID")
    @ApiResponse(
            responseCode = "200",
            description = "Role retrieved successfully",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = RoleDTO.class)
            )
    )
    public ResponseEntity<Map<String, Object>> getRoleById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Role role = roleService.getRoleById(id);
            if (role == null) {
                response.put("message", "Role not found");
                response.put("data", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            response.put("message", "Role retrieved successfully");
            response.put("data", roleService.mapToDTO(role));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 🔍 Get role by name
    @GetMapping("/name/{name}")
    @Operation(summary = "Get role by name")
    @ApiResponse(
            responseCode = "200",
            description = "Role retrieved successfully",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = RoleDTO.class)
            )
    )
    public ResponseEntity<Map<String, Object>> getRoleByName(@PathVariable String name) {
        Map<String, Object> response = new HashMap<>();
        try {
            Role role = roleService.getRoleByName(name);
            if (role == null) {
                response.put("message", "Role not found");
                response.put("data", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            response.put("message", "Role retrieved successfully");
            response.put("data", roleService.mapToDTO(role));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ❌ Delete role
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a role by ID")
    @ApiResponse(
            responseCode = "204",
            description = "Role deleted successfully",
            content = @Content(mediaType = "application/json")
    )
    public ResponseEntity<Map<String, Object>> deleteRole(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            roleService.deleteRole(id);
            response.put("message", "Role deleted successfully");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
        } catch (RuntimeException e) {
            response.put("message", "Role not found");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
