package h4g.emart.models;

import java.util.ArrayList;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "Task")

public class Task {
    private @Getter String taskId;
    private @Getter @Setter String taskName;
    private @Getter @Setter String taskDesc;
    private @Getter @Setter long taskReward;
    private @Getter LocalDateTime createdOn;
    private @Getter @Setter TaskStatus status;
    private @Getter ArrayList<Contributor> contributors = new ArrayList<Contributor>();

    public Task(String taskId, String taskName, String taskDesc, long taskReward, TaskStatus status) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.taskDesc = taskDesc;
        this.taskReward = taskReward;
        this.createdOn = LocalDateTime.now();
        this.status = status;
    }

    public void addContributor(Contributor contributor) {
        contributors.add(contributor);
    }

    public String contributorsToString() {
        return this.contributors.stream()
            .map(Contributor::getUserId) // Map each Contributor to its userId
            .collect(Collectors.joining(", ", "[", "]")); // Join with ", ", and wrap in brackets
    }

    @Override
    public String toString() {
        return "Task [taskId=" + taskId + ", taskName=" + taskName + ", taskDesc=" + taskDesc + ", taskReward="
                + taskReward + ", createdOn=" + createdOn + ", TaskStatus=" + status + ", contributors=" + contributorsToString()
                + "]";
    }

}

