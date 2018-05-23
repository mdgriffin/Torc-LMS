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
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    // Get All Notes

    // Create a new Note

    // Get a Single Note

    // Update a Note

    // Delete a Note
}