package h4g.emart.models;

import java.util.ArrayList;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "Task")

public class Task {
    @Id
    private @Getter @Setter String taskId;
    private @Getter @Setter String taskName;
    private @Getter @Setter String taskDesc;
    private @Getter @Setter double taskReward;
    private @Getter LocalDateTime createdOn = LocalDateTime.now();;
    @JsonProperty("status")
    private @Getter @Setter TaskStatus status = TaskStatus.OPEN;
    private @Getter ArrayList<Contributor> contributors = new ArrayList<Contributor>();

    public Task() {}

    public Task(String taskId, String taskName, String taskDesc, double taskReward, LocalDateTime createdOn,
            TaskStatus status, ArrayList<Contributor> contributors) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.taskDesc = taskDesc;
        this.taskReward = taskReward;
        this.createdOn = createdOn;
        this.status = status;
        this.contributors = contributors;
    }

    public Task(String taskName, String taskDesc, double taskReward) {
        this.taskName = taskName;
        this.taskDesc = taskDesc;
        this.taskReward = taskReward;
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

