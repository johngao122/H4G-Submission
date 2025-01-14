package h4g.emart.controllers;

import h4g.emart.models.User;
import h4g.emart.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

class BalanceRequest {
    private @Getter @Setter double amount;
}

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // 1. Create a User
    /**
     * Creates a new user in the system.
     * @param user The user object to be created.
     * @return A ResponseEntity containing the created user and HTTP status 201 (Created).
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    // 2. Get a User by ID (Read)
    /**
     * Retrieves a user by their unique user ID.
     * @param userId The unique ID of the user to be retrieved.
     * @return A ResponseEntity containing the user and HTTP status 200 (OK) if found,
     *         or HTTP status 404 (Not Found) if the user doesn't exist.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 3. Get All Users (Read)
    /**
     * Retrieves all users in the system.
     * @return A ResponseEntity containing a list of all users and HTTP status 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // 4. Update a User
    /**
     * Updates an existing user based on the provided user data.
     * @param userId The ID of the user to be updated.
     * @param updatedUser The updated user object.
     * @return A ResponseEntity containing the updated user and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if the user does not exist.
     */
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody User updatedUser) {
        User user = userService.updateUser(userId, updatedUser);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 5. Delete a User
    /**
     * Deletes a user from the system based on the provided user ID.
     * @param userId The ID of the user to be deleted.
     * @return A ResponseEntity with HTTP status 204 (No Content) if the deletion is successful,
     *         or HTTP status 404 (Not Found) if the user does not exist.
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        boolean deleted = userService.deleteUser(userId);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 6. Add Balance to a User's Account
    /**
     * Adds balance to a user's account.
     * @param userId The ID of the user to whom balance should be added.
     * @param amount The amount to be added to the user's balance.
     * @return A ResponseEntity containing the updated user and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if the user does not exist.
     * NOTE: Should only be accessible by admin to forcibly inject/extract from a user's balance
     */
    @PostMapping("/{userId}/addBalance")
    public ResponseEntity<User> addBalance(@PathVariable String userId, @RequestBody BalanceRequest amount) {
        User user = userService.addBalance(userId, amount.getAmount());
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 7. Deduct Balance from a User's Account
    /**
     * Deducts balance from a user's account.
     * @param userId The ID of the user from whom balance should be deducted.
     * @param amount The amount to be deducted from the user's balance.
     * @return A ResponseEntity containing the updated user and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if the user does not exist.
     * NOTE: Should only be accessible by admin to forcibly inject/extract from a user's balance
     */
    @PostMapping("/{userId}/deductBalance")
    public ResponseEntity<User> deductBalance(@PathVariable String userId, @RequestBody BalanceRequest amount) {
        User user = userService.deductBalance(userId, amount.getAmount());
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 8. Change User Status
    /**
     * Changes the status of a user.
     * @param userId The ID of the user whose status should be updated.
     * @param userStatus The new status to be applied to the user.
     * @return A ResponseEntity containing the updated user and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if the user does not exist.
     */
    @PatchMapping("/{userId}/status")
    public ResponseEntity<User> changeUserStatus(@PathVariable String userId, @RequestParam("status") String userStatus) {
        User user = userService.changeUserStatus(userId, userStatus);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 9. Get Users by Status
    /**
     * Retrieves users based on their current status.
     * @param userStatus The status to filter users by.
     * @return A ResponseEntity containing a list of users with the specified status and HTTP status 200 (OK).
     */
    @GetMapping("/status/{userStatus}")
    public ResponseEntity<List<User>> getUsersByStatus(@PathVariable String userStatus) {
        List<User> users = userService.getUsersByStatus(userStatus);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
}
