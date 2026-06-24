package org.example.backend;

import org.example.backend.entity.UserProgress;
import org.example.backend.repository.UserProgressRepository;
import org.example.backend.service.UserProgressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserProgressServiceTest {

    private UserProgressRepository repository;
    private UserProgressService service;

    @BeforeEach
    void setUp() {
        repository = mock(UserProgressRepository.class);
        service = new UserProgressService(repository);
    }

    @Test
    void saveProgressShouldSetCompletedAtAndSave() {
        UserProgress progress = new UserProgress();
        progress.setUserId(1L);

        when(repository.save(any(UserProgress.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UserProgress result = service.saveProgress(progress);

        assertNotNull(result.getCompletedAt());
        verify(repository).save(progress);
    }

    @Test
    void getUserProgressShouldReturnProgressList() {
        UserProgress progress =
                new UserProgress(1L, 2L, 3L, 4L, 90);

        when(repository.findByUserId(1L))
                .thenReturn(List.of(progress));

        List<UserProgress> result = service.getUserProgress(1L);

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getUserId());

        verify(repository).findByUserId(1L);
    }

    @Test
    void getSpecificProgressShouldReturnProgressWhenExists() {
        UserProgress progress =
                new UserProgress(1L, 2L, 3L, 4L, 90);

        when(repository.findByUserIdAndSectionIdAndSectionQuizIdAndFinalQuizId(
                1L, 2L, 3L, 4L
        )).thenReturn(Optional.of(progress));

        Optional<UserProgress> result =
                service.getSpecificProgress(1L, 2L, 3L, 4L);

        assertTrue(result.isPresent());
        assertEquals(90, result.get().getScore());

        verify(repository)
                .findByUserIdAndSectionIdAndSectionQuizIdAndFinalQuizId(
                        1L, 2L, 3L, 4L
                );
    }

    @Test
    void getSpecificProgressShouldReturnEmptyWhenNotFound() {

        when(repository.findByUserIdAndSectionIdAndSectionQuizIdAndFinalQuizId(
                1L, 2L, 3L, 4L
        )).thenReturn(Optional.empty());

        Optional<UserProgress> result =
                service.getSpecificProgress(1L, 2L, 3L, 4L);

        assertTrue(result.isEmpty());
    }

    @Test
    void deleteProgressShouldDeleteById() {

        service.deleteProgress(99L);

        verify(repository).deleteById(99L);
    }

    @Test
    void saveProgressShouldOverwriteCompletedAtTimestamp() {
        UserProgress progress = new UserProgress();
        progress.setCompletedAt(LocalDateTime.of(2020,1,1,0,0));

        when(repository.save(any(UserProgress.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UserProgress result = service.saveProgress(progress);

        assertTrue(
                result.getCompletedAt().isAfter(
                        LocalDateTime.of(2020,1,1,0,0)
                )
        );
    }
}