package Service_request_tracker.example.srt.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Service_request_tracker.example.srt.Dto.CategoryDTO;
import Service_request_tracker.example.srt.entity.Category;
import Service_request_tracker.example.srt.serviceImpl.CategoryServiceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryServiceImpl categoryService;

    // ➕ Create category
    @PostMapping
    @Operation(summary = "Create a new category")
    @ApiResponse(
            responseCode = "201",
            description = "Category created successfully",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = CategoryDTO.class)
            )
    )
    public ResponseEntity<Map<String, Object>> createCategory(@RequestBody Category category) {
        Map<String, Object> response = new HashMap<>();
        try {
            Category savedCategory = categoryService.createCategory(category);
            response.put("message", "Category created successfully");
            response.put("data", categoryService.mapToDTO(savedCategory));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            response.put("message", "Category already exists");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 📋 Get all categories
    @GetMapping
    @Operation(summary = "Get all categories")
    @ApiResponse(
            responseCode = "200",
            description = "Categories retrieved successfully",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = CategoryDTO.class)
            )
    )
    public ResponseEntity<Map<String, Object>> getAllCategories() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<CategoryDTO> dtos = categoryService.getAllCategories().stream()
                    .map(categoryService::mapToDTO)
                    .collect(Collectors.toList());
            response.put("message", "Categories retrieved successfully");
            response.put("data", dtos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 🔍 Get category by ID
    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    @ApiResponse(
            responseCode = "200",
            description = "Category retrieved successfully",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = CategoryDTO.class)
            )
    )
    public ResponseEntity<Map<String, Object>> getCategoryById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Category category = categoryService.getCategoryById(id);
            if (category == null) {
                response.put("message", "Category not found");
                response.put("data", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            response.put("message", "Category retrieved successfully");
            response.put("data", categoryService.mapToDTO(category));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ❌ Delete category
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a category by ID")
    @ApiResponse(
            responseCode = "204",
            description = "Category deleted successfully",
            content = @Content(mediaType = "application/json")
    )
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            categoryService.deleteCategory(id);
            response.put("message", "Category deleted successfully");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
        } catch (RuntimeException e) {
            response.put("message", "Category not found");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
