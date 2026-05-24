package org.example.backend.repository;

import org.example.backend.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SectionRepository extends JpaRepository<Section, Long> {

    List<Section> findByCourseId(Long courseId);

    List<Section> findByCourseIdOrderByOrderIndexAsc(Long courseId);
}