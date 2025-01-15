package h4g.emart.services;

import h4g.emart.models.UserStatus;
import h4g.emart.models.User;
import h4g.emart.repositories.UserRepository;
import h4g.emart.services.SequenceGeneratorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    // Create a new user
    public User createUser(User user) {
        // user.setUserId(sequenceGeneratorService.generateId("User"));
        return userRepository.save(user);
    }

    // Retrieve a user by their ID
    public User getUserById(String userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.orElse(null);
    }

    // Retrieve all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Update an existing user
    public User updateUser(String userId, User updatedUser) {
        if (userRepository.existsById(userId)) {
            updatedUser.setUserId(userId);
            return userRepository.save(updatedUser);
        }
        return null;
    }

    // Delete a user
    public boolean deleteUser(String userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }

    // Add balance to a user's account
    public User addBalance(String userId, double amount) {
        User user = getUserById(userId);
        if (user != null) {
            user.addBal(amount);
            return userRepository.save(user);
        }
        return null;
    }

    // Deduct balance from a user's account
    public User deductBalance(String userId, double amount) {
        User user = getUserById(userId);
        if (user != null && user.getVoucherBal() >= amount) {
            user.deductBal(amount);
            return userRepository.save(user);
        }
        return null;
    }

    // Change the status of a user
    public User changeUserStatus(String userId, String status) {
        UserStatus userStatus = UserStatus.valueOf(status.toUpperCase()); // Convert string to enum
        User user = getUserById(userId);
        if (user != null) {
            user.setStatus(userStatus);
            return userRepository.save(user);
        }
        return null;
    }

    // Retrieve users by their status
    public List<User> getUsersByStatus(String status) {
        UserStatus userStatus = UserStatus.valueOf(status.toUpperCase()); // Convert string to enum
        return userRepository.findByStatus(userStatus);
    }
}
