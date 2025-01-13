package h4g.emart.repositories;

import h4g.emart.models.User;
import h4g.emart.models.UserStatus;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // Find users by their status
    List<User> findByStatus(UserStatus status);
}
