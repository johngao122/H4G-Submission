package h4g.emart.repositories;

import h4g.emart.models.Task;
import h4g.emart.models.TaskStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByStatus(TaskStatus status);
}
