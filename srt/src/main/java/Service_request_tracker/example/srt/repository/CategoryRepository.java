package Service_request_tracker.example.srt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import Service_request_tracker.example.srt.entity.Category;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
}

