package h4g.emart.models;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "Contributors")

public class Contributor {
    private @Getter String taskId;
    private @Getter String userId;
    private @Getter LocalDateTime datetime;
    private @Getter @Setter ContributorStatus status;

    public Contributor(String taskId, String userId) {
        this.taskId = taskId;
        this.userId = userId;
        this.datetime = LocalDateTime.now();
        this.status = ContributorStatus.PENDING;
    }

    @Override
    public String toString() {
        return "Contributor [taskId=" + taskId + ", userId=" + userId + ", datetime=" + datetime + ", status=" + status
                + "]";
    }
}
