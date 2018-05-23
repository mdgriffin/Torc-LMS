package torclms.controller;

import torclms.exception.ResourceNotFoundException;
import torclms.model.User;
import torclms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserRepository userRepository;

    // Get All Users
    @GetMapping("/users")
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    // Create a new User
    @PostMapping("/users")
    public User createUser(@Valid @RequestBody User user) {
        return userRepository.save(user);
    }

    // Get a Single User
    // Get a Single Note
    @GetMapping("/users/{id}")
    public User getNoteById(@PathVariable(value = "id") Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    // Update a Note
    @PutMapping("/notes/{id}")
    public User updateNote(@PathVariable(value = "id") Long noteId,
                           @Valid @RequestBody User userDetails) {

        User user = userRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", noteId));


        user.setFirstname(userDetails.getFirstname());
        user.setSurname(userDetails.getSurname());

        User updatedNote = userRepository.save(user);
        return updatedNote;
    }

    // Delete a Note
    // Delete a Note
    @DeleteMapping("/notes/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable(value = "id") Long userId) {
        User note = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", userId));

        userRepository.delete(note);

        return ResponseEntity.ok().build();
    }
}