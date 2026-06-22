package org.example.backend.service;

import org.example.backend.entity.User;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public User create(User user) {
        return repo.save(user);
    }

    // READ ALL
    public List<User> getAll() {
        return repo.findAll();
    }

    // READ BY ID
    public User getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // UPDATE
    public User update(Long id, User newUser) {
        User existing = getById(id);

        existing.setEmail(newUser.getEmail());
        existing.setName(newUser.getName());
        existing.setAvatarUrl(newUser.getAvatarUrl());
        existing.setBio(newUser.getBio());
        existing.setIsActive(newUser.getIsActive());
        existing.setEmailVerified(newUser.getEmailVerified());

        return repo.save(existing);
    }


    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        repo.deleteById(id);
    }

    public User findOrCreateGoogleUser(
            String email,
            String name,
            String avatarUrl,
            String providerId,
            Boolean emailVerified
    ) {
        return repo.findByEmail(email)
                .map(existing -> {
                    existing.setName(name);
                    existing.setAvatarUrl(avatarUrl);
                    existing.setEmailVerified(emailVerified);
                    existing.setProvider("google");
                    existing.setProviderId(providerId);
                    return repo.save(existing);
                })
                .orElseGet(() -> {
                    User user = new User();
                    user.setEmail(email);
                    user.setName(name);
                    user.setAvatarUrl(avatarUrl);
                    user.setEmailVerified(emailVerified);
                    user.setProvider("google");
                    user.setProviderId(providerId);
                    user.setIsActive(true);
                    return repo.save(user);
                });
    }
}