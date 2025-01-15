package h4g.emart.models;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "Contributors")

public class Contributor {
    private @Getter String taskId;
    private @Getter String userId;
    private @Getter @Setter String contributorName;
    private @Getter LocalDateTime datetime;
    @JsonProperty("status")
    private @Getter @Setter ContributorStatus status;

    public Contributor() {}
    
    public Contributor(String taskId, String userId, String contributorName) {
        this.taskId = taskId;
        this.userId = userId;
        this.contributorName = contributorName;
        this.datetime = LocalDateTime.now();
        this.status = ContributorStatus.PENDING;
    }

    @Override
    public String toString() {
        return "Contributor [taskId=" + taskId + ", userId=" + userId + ", datetime=" + datetime + ", status=" + status
                + "]";
    }
}
