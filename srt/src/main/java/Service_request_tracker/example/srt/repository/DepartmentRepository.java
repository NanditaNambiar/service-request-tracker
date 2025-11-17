package Service_request_tracker.example.srt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import Service_request_tracker.example.srt.entity.Department;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByName(String name);
}

