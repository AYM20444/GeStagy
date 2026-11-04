package com.gestagy.repository;

import com.gestagy.model.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByInternId(Long internId);
    List<Internship> findByTutorId(Long tutorId);
    List<Internship> findByDepartmentId(Long departmentId);
    long countByStatus(Internship.InternshipStatus status);
}

