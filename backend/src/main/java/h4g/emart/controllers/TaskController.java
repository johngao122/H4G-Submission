package h4g.emart.controllers;

import h4g.emart.models.Task;
import h4g.emart.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // 1. Create a Task
    /**
     * Creates a new task in the system.
     * @param task The task object to be created.
     * @return A ResponseEntity containing the created task and HTTP status 201 (Created).
     * Exclude taskId in request body
     */
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    // 2. Get a Task by ID (Read)
    /**
     * Retrieves a task by its unique task ID.
     * @param taskId The unique ID of the task to be retrieved.
     * @return A ResponseEntity containing the task and HTTP status 200 (OK) if found,
     *         or HTTP status 404 (Not Found) if the task doesn't exist.
     */
    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable String taskId) {
        Task task = taskService.getTaskById(taskId);
        if (task != null) {
            return new ResponseEntity<>(task, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 3. Get All Tasks (Read)
    /**
     * Retrieves all tasks in the system.
     * @return A ResponseEntity containing a list of all tasks and HTTP status 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    // 4. Update a Task
    /**
     * Updates an existing task based on the provided task data.
     * @param taskId The ID of the task to be updated.
     * @param updatedTask The updated task object.
     * @return A ResponseEntity containing the updated task and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if the task does not exist.
     */
    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable String taskId, @RequestBody Task updatedTask) {
        Task task = taskService.updateTask(taskId, updatedTask);
        if (task != null) {
            return new ResponseEntity<>(task, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 5. Delete a Task
    /**
     * Deletes a task from the system based on the provided task ID.
     * @param taskId The ID of the task to be deleted.
     * @return A ResponseEntity with HTTP status 204 (No Content) if the deletion is successful,
     *         or HTTP status 404 (Not Found) if the task does not exist.
     */
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable String taskId) {
        boolean deleted = taskService.deleteTask(taskId);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 6. Add a Contributor to a Task
    /**
     * Adds a contributor to a task.
     * @param taskId The ID of the task to which the contributor will be added.
     * @param contributorId The ID of the contributor to be added.
     * @return A ResponseEntity containing the updated task and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if the task or contributor does not exist.
     */
    @PostMapping("/{taskId}/contributors/{contributorId}")
    public ResponseEntity<Task> addContributor(@PathVariable String taskId, @PathVariable String contributorId) {
        Task task = taskService.addContributor(taskId, contributorId);
        if (task != null) {
            return new ResponseEntity<>(task, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 7. Remove a Contributor from a Task
    /**
     * Removes a contributor from a task.
     * @param taskId The ID of the task from which the contributor will be removed.
     * @param contributorId The ID of the contributor to be removed.
     * @return A ResponseEntity containing the updated task and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if the task or contributor does not exist.
     */
    @DeleteMapping("/{taskId}/contributors/{contributorId}")
    public ResponseEntity<Task> removeContributor(@PathVariable String taskId, @PathVariable String contributorId) {
        Task task = taskService.removeContributor(taskId, contributorId);
        if (task != null) {
            return new ResponseEntity<>(task, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 8. Get Tasks by Status
    /**
     * Retrieves tasks filtered by their status.
     * @param status The status to filter tasks by.
     * @return A ResponseEntity containing a list of tasks with the specified status and HTTP status 200 (OK).
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable TaskStatus status) {
        List<Task> tasks = taskService.getTasksByStatus(status);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }
}
