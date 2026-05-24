package org.example.backend.service;

import org.example.backend.entity.Section;
import org.example.backend.repository.SectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SectionService {

    private final SectionRepository sectionRepository;

    public SectionService(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }

    public List<Section> getSectionsByCourseId(Long courseId) {
        return sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    public Optional<Section> getSectionById(Long id) {
        return sectionRepository.findById(id);
    }

    public Section createSection(Section section) {
        return sectionRepository.save(section);
    }

    public Section updateSection(Long id, Section updatedSection) {
        return sectionRepository.findById(id).map(section -> {
            section.setTitle(updatedSection.getTitle());
            section.setCourseId(updatedSection.getCourseId());
            section.setOrderIndex(updatedSection.getOrderIndex());
            return sectionRepository.save(section);
        }).orElseThrow(() -> new RuntimeException("Section not found"));
    }

    public void deleteSection(Long id) {
        sectionRepository.deleteById(id);
    }
}
