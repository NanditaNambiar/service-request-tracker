package Service_request_tracker.example.srt.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import Service_request_tracker.example.srt.Dto.DepartmentDTO;
import Service_request_tracker.example.srt.entity.Department;
import Service_request_tracker.example.srt.repository.DepartmentRepository;
import Service_request_tracker.example.srt.service.DepartmentService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }

    @Override
    public void deleteDepartment(Long id) {
        Department dept = getDepartmentById(id);
        departmentRepository.delete(dept);
    }

    @Override
    public DepartmentDTO mapToDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        return dto;
    }
}
