package Service_request_tracker.example.srt.service;

import java.util.List;

import Service_request_tracker.example.srt.Dto.CategoryDTO;
import Service_request_tracker.example.srt.entity.Category;

public interface CategoryService {

    Category createCategory(Category category);

    List<Category> getAllCategories();

    Category getCategoryById(Long id);

    void deleteCategory(Long id);

    // Map entity to DTO
    CategoryDTO mapToDTO(Category category);
}


