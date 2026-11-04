package com.gestagy.repository;

import com.gestagy.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByInternshipId(Long internshipId);
    List<Task> findByInternshipIdAndStatus(Long internshipId, Task.TaskStatus status);
}

