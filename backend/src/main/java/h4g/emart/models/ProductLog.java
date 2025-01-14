package h4g.emart.models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;

@Document(collection = "ProductLog")

public class ProductLog {
    @Id
    private @Getter String logId;
    private @Getter String userId;
    private @Getter String productId;
    private @Getter LocalDateTime datetime;
    private @Getter String action;
    
    public ProductLog(String logId, String userId, String productId, LocalDateTime datetime, String action) {
        this.logId = logId;
        this.userId = userId;
        this.productId = productId;
        this.datetime = datetime;
        this.action = action;
    }

    @Override
    public String toString() {
        return "ProductLog [logId=" + logId + ", userId=" + userId + ", productId=" + productId + ", datetime="
                + datetime + ", action=" + action + "]";
    }
}
