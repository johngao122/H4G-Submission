package h4g.emart.services;

import h4g.emart.models.Task;
import h4g.emart.models.TaskStatus;
import h4g.emart.models.User;
import h4g.emart.repositories.TaskRepository;
import h4g.emart.services.SequenceGeneratorService;
import h4g.emart.models.Contributor;
import h4g.emart.models.ContributorStatus;
import h4g.emart.models.PreorderStatus;
import h4g.emart.models.Task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    /**
     * Creates a new task.
     * @param task The task object to create.
     * @return The created task.
     */
    public Task createTask(Task task) {
        task.setTaskId(sequenceGeneratorService.generateId("Task"));
        return taskRepository.save(task);
    }

    /**
     * Retrieves a task by its ID.
     * @param taskId The ID of the task to retrieve.
     * @return The task if found, or null if not found.
     */
    public Task getTaskById(String taskId) {
        Optional<Task> task = taskRepository.findById(taskId);
        return task.orElse(null);
    }

    /**
     * Retrieves all tasks.
     * @return A list of all tasks.
     */
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    /**
     * Updates an existing task by its ID.
     * @param taskId The ID of the task to update.
     * @param updatedTask The updated task object.
     * @return The updated task if it exists, or null if not found.
     */
    public Task updateTask(String taskId, Task updatedTask) {
        if (taskRepository.existsById(taskId)) {
            updatedTask.setTaskId(taskId);
            return taskRepository.save(updatedTask);
        }
        return null;
    }

    /**
     * Deletes a task by its ID.
     * @param taskId The ID of the task to delete.
     * @return True if the task was deleted, false otherwise.
     */
    public boolean deleteTask(String taskId) {
        if (taskRepository.existsById(taskId)) {
            taskRepository.deleteById(taskId);
            return true;
        }
        return false;
    }

    /**
     * Adds a contributor to a task.
     * @param taskId The ID of the task.
     * @param contributorId The ID of the contributor to add.
     * @return The updated task if successful, or null if the task doesn't exist.
     */
    public Task addContributor(String taskId, String contributorId) {
        Optional<Task> optionalTask = taskRepository.findById(taskId);
        User user = userService.getUserById(contributorId);
        if (optionalTask.isPresent() && user != null) {
            Task task = optionalTask.get();
            if (!task.getContributors().contains(contributorId) && task.getStatus() == TaskStatus.OPEN) {
                Contributor contributor = new Contributor(taskId, contributorId, user.getName());
                task.getContributors().add(contributor);
                return taskRepository.save(task);
            }
        }
        return null;
    }

    /**
     * Retrieves tasks by their status.
     * @param status The status to filter tasks by.
     * @return A list of tasks with the specified status.
     */
    public List<Task> getTasksByStatus(String status) {
        TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase()); // Convert string to enum
        return taskRepository.findByStatus(taskStatus);
    }

    /**
     * Process tasks, paying out all ACCEPTED contributors and changing their status to PROCESSED
     * @param taskId The task to process.
     * @return The updated task
     */
    public Task processTask(String taskId) {
        Optional<Task> optionalTask = taskRepository.findById(taskId);
        if (!optionalTask.isPresent()) {
            return null;
        }
    
        Task task = optionalTask.get();
        double taskReward = task.getTaskReward();
    
        for (Contributor contributor : task.getContributors()) {
            try {
                if (contributor.getStatus() == ContributorStatus.APPROVED) {
                    userService.addBalance(contributor.getUserId(), taskReward);
                    contributor.setStatus(ContributorStatus.PROCESSED);
                }
            } catch (Exception e) {
                System.err.println("Error processing contributor " + contributor.getUserId() + ": " + e.getMessage());
            }
        }
    
        return taskRepository.save(task);
    }

    /**
     * Closes a task.
     * @param taskId The task to process.
     * @return The updated task
     */
    public Task closeTask(String taskId) {
        Optional<Task> optionalTask = taskRepository.findById(taskId);
        if (!optionalTask.isPresent()) {
            return null;
        }
    
        Task task = optionalTask.get();
        task.setStatus(TaskStatus.CLOSED);
    
        return taskRepository.save(task);
    }

    /**
     * Retrieves all tasks within a certain timeframe.
     * @param start The start of the timeframe.
     * @param end The end of the timeframe.
     * @return The list of tasks created in that timeframe
     */
    public List<Task> getTasksInTimeframe(LocalDateTime start, LocalDateTime end) {
        return taskRepository.findByDatetimeBetween(start, end);
    }
}
