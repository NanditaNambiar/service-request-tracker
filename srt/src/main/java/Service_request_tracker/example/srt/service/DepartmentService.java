package Service_request_tracker.example.srt.service;

import java.util.List;

import Service_request_tracker.example.srt.Dto.DepartmentDTO;
import Service_request_tracker.example.srt.entity.Department;

public interface DepartmentService {

    Department createDepartment(Department department);

    List<Department> getAllDepartments();

    Department getDepartmentById(Long id);

    void deleteDepartment(Long id);

    // Map entity to DTO
    DepartmentDTO mapToDTO(Department department);
}
