package org.example.backend;

import org.example.backend.entity.User;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private UserRepository repo;
    private UserService service;

    @BeforeEach
    void setUp() {
        repo = mock(UserRepository.class);
        service = new UserService(repo);
    }

    @Test
    void createShouldSaveUser() {
        User user = sampleUser();

        when(repo.save(user)).thenReturn(user);

        User result = service.create(user);

        assertEquals("student@test.com", result.getEmail());
        assertEquals("Student User", result.getName());
        verify(repo).save(user);
    }

    @Test
    void getAllShouldReturnUsers() {
        User user = sampleUser();

        when(repo.findAll()).thenReturn(List.of(user));

        List<User> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("student@test.com", result.get(0).getEmail());
        verify(repo).findAll();
    }

    @Test
    void getByIdShouldReturnUserWhenExists() {
        User user = sampleUser();

        when(repo.findById(1L)).thenReturn(Optional.of(user));

        User result = service.getById(1L);

        assertEquals("student@test.com", result.getEmail());
        verify(repo).findById(1L);
    }

    @Test
    void getByIdShouldThrowWhenUserNotFound() {
        when(repo.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.getById(1L)
        );

        assertEquals("User not found with id: 1", exception.getMessage());
    }

    @Test
    void updateShouldModifyExistingUser() {
        User existing = sampleUser();

        User updated = new User();
        updated.setEmail("updated@test.com");
        updated.setName("Updated User");
        updated.setAvatarUrl("updated-avatar.jpg");
        updated.setBio("Updated bio");
        updated.setIsActive(false);
        updated.setEmailVerified(true);

        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(repo.save(existing)).thenReturn(existing);

        User result = service.update(1L, updated);

        assertEquals("updated@test.com", result.getEmail());
        assertEquals("Updated User", result.getName());
        assertEquals("updated-avatar.jpg", result.getAvatarUrl());
        assertEquals("Updated bio", result.getBio());
        assertFalse(result.getIsActive());
        assertTrue(result.getEmailVerified());

        verify(repo).save(existing);
    }

    @Test
    void deleteShouldDeleteWhenUserExists() {
        when(repo.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repo).deleteById(1L);
    }

    @Test
    void deleteShouldThrowWhenUserNotFound() {
        when(repo.existsById(1L)).thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.delete(1L)
        );

        assertEquals("User not found with id: 1", exception.getMessage());
        verify(repo, never()).deleteById(anyLong());
    }

    @Test
    void findOrCreateGoogleUserShouldCreateNewUserWhenEmailDoesNotExist() {
        when(repo.findByEmail("google@test.com"))
                .thenReturn(Optional.empty());

        when(repo.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = service.findOrCreateGoogleUser(
                "google@test.com",
                "Google User",
                "avatar.jpg",
                "google-sub-123",
                true
        );

        assertEquals("google@test.com", result.getEmail());
        assertEquals("Google User", result.getName());
        assertEquals("avatar.jpg", result.getAvatarUrl());
        assertEquals("google", result.getProvider());
        assertEquals("google-sub-123", result.getProviderId());
        assertTrue(result.getEmailVerified());
        assertTrue(result.getIsActive());
        assertEquals("USER", result.getRole());

        verify(repo).findByEmail("google@test.com");
        verify(repo).save(any(User.class));
    }

    @Test
    void findOrCreateGoogleUserShouldUpdateExistingUserWhenEmailExists() {
        User existing = sampleUser();

        when(repo.findByEmail("student@test.com"))
                .thenReturn(Optional.of(existing));

        when(repo.save(existing)).thenReturn(existing);

        User result = service.findOrCreateGoogleUser(
                "student@test.com",
                "Updated Google Name",
                "new-avatar.jpg",
                "new-provider-id",
                true
        );

        assertEquals("student@test.com", result.getEmail());
        assertEquals("Updated Google Name", result.getName());
        assertEquals("new-avatar.jpg", result.getAvatarUrl());
        assertEquals("google", result.getProvider());
        assertEquals("new-provider-id", result.getProviderId());
        assertTrue(result.getEmailVerified());

        verify(repo).findByEmail("student@test.com");
        verify(repo).save(existing);
    }

    private User sampleUser() {
        User user = new User();
        user.setEmail("student@test.com");
        user.setName("Student User");
        user.setAvatarUrl("avatar.jpg");
        user.setBio("Bio");
        user.setIsActive(true);
        user.setEmailVerified(false);
        user.setProvider("google");
        user.setProviderId("provider-123");
        user.setRole("USER");
        return user;
    }
}