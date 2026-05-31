package org.example.backend.service;

import org.example.backend.entity.Lesson;
import org.example.backend.entity.LessonContent;
import org.example.backend.entity.Section;

import org.example.backend.repository.SectionRepository;
import org.example.backend.repository.LessonRepository;
import org.example.backend.repository.LessonContentRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SectionService {

    private final SectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final LessonContentRepository lessonContentRepository;

    public SectionService(
            SectionRepository sectionRepository,
            LessonRepository lessonRepository,
            LessonContentRepository lessonContentRepository
    ) {
        this.sectionRepository = sectionRepository;
        this.lessonRepository = lessonRepository;
        this.lessonContentRepository = lessonContentRepository;
    }

    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }

    public List<Section> getSectionsByCourseId(Long courseId) {

        List<Section> sections =
                sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId);

        for (Section section : sections) {

            List<Lesson> lessons =
                    lessonRepository.findBySectionIdOrderByOrderIndexAsc(
                            section.getId()
                    );

            for (Lesson lesson : lessons) {

                List<LessonContent> contents =
                        lessonContentRepository
                                .findByLessonIdOrderByOrderIndexAsc(
                                        lesson.getId()
                                );

                lesson.setContent(contents);
            }

            section.setLessons(lessons);
        }

        return sections;
    }

    public Optional<Section> getSectionById(Long id) {
        return sectionRepository.findById(id);
    }

    public Section createSection(Section section) {
        return sectionRepository.save(section);
    }

    public Section updateSection(Long id, Section updatedSection) {

        return sectionRepository.findById(id)
                .map(section -> {

                    section.setTitle(updatedSection.getTitle());
                    section.setCourseId(updatedSection.getCourseId());
                    section.setOrderIndex(updatedSection.getOrderIndex());

                    return sectionRepository.save(section);

                })
                .orElseThrow(() ->
                        new RuntimeException("Section not found")
                );
    }

    public void deleteSection(Long id) {
        sectionRepository.deleteById(id);
    }
}