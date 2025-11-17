package Service_request_tracker.example.srt.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Service_request_tracker.example.srt.Dto.DepartmentDTO;
import Service_request_tracker.example.srt.entity.Department;
import Service_request_tracker.example.srt.exception.ResourceNotFoundException;
import Service_request_tracker.example.srt.serviceImpl.DepartmentServiceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DepartmentController {

    private final DepartmentServiceImpl departmentService;

    // ➕ Create department
    @PostMapping
    @Operation(summary = "Create a new department")
    @ApiResponse(
            responseCode = "201",
            description = "Department created successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = DepartmentDTO.class))
    )
    public ResponseEntity<Map<String, Object>> createDepartment(@RequestBody Department department) {
        Department savedDept = departmentService.createDepartment(department);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Department created successfully");
        response.put("data", departmentService.mapToDTO(savedDept));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 📋 Get all departments
    @GetMapping
    @Operation(summary = "Get all departments")
    @ApiResponse(
            responseCode = "200",
            description = "Departments retrieved successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = DepartmentDTO.class))
    )
    public ResponseEntity<Map<String, Object>> getAllDepartments() {
        List<DepartmentDTO> dtos = departmentService.getAllDepartments().stream()
                .map(departmentService::mapToDTO)
                .collect(Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Departments retrieved successfully");
        response.put("data", dtos);
        return ResponseEntity.ok(response);
    }

    // 🔍 Get department by ID
    @GetMapping("/{id}")
    @Operation(summary = "Get department by ID")
    @ApiResponse(
            responseCode = "200",
            description = "Department retrieved successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = DepartmentDTO.class))
    )
    public ResponseEntity<Map<String, Object>> getDepartmentById(@PathVariable Long id) {
        Department dept = departmentService.getDepartmentById(id);
        if (dept == null) {
            throw new ResourceNotFoundException("Department not found with ID: " + id);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Department retrieved successfully");
        response.put("data", departmentService.mapToDTO(dept));
        return ResponseEntity.ok(response);
    }

    // ❌ Delete department
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a department by ID")
    @ApiResponse(responseCode = "204", description = "Department deleted successfully", content = @Content(mediaType = "application/json"))
    public ResponseEntity<Map<String, Object>> deleteDepartment(@PathVariable Long id) {
        Department dept = departmentService.getDepartmentById(id);
        if (dept == null) {
            throw new ResourceNotFoundException("Department not found with ID: " + id);
        }

        departmentService.deleteDepartment(id);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Department deleted successfully");
        response.put("data", null);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }
}
