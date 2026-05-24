package org.example.backend.controller;

import org.example.backend.entity.LessonContent;
import org.example.backend.service.LessonContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lesson-content")
@CrossOrigin
public class LessonContentController {

    private final LessonContentService service;

    public LessonContentController(LessonContentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LessonContent> create(@RequestBody LessonContent content) {
        return ResponseEntity.ok(service.create(content));
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<LessonContent>> getByLessonId(@PathVariable Long lessonId) {
        return ResponseEntity.ok(service.getByLessonId(lessonId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonContent> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<LessonContent> update(@PathVariable Long id,
                                                @RequestBody LessonContent content) {
        return ResponseEntity.ok(service.update(id, content));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
