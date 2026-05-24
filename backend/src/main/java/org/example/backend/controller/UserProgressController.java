package org.example.backend.controller;

import org.example.backend.entity.UserProgress;
import org.example.backend.service.UserProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class UserProgressController {

    private final UserProgressService service;

    public UserProgressController(UserProgressService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UserProgress> saveProgress(@RequestBody UserProgress progress) {
        return ResponseEntity.ok(service.saveProgress(progress));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserProgress>> getUserProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getUserProgress(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable Long id) {
        service.deleteProgress(id);
        return ResponseEntity.noContent().build();
    }
}
