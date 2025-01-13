package h4g.emart.models;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "ProductRequest")

public class ProductRequest {
    private @Getter @Setter String requestId;
    private @Getter String userId;
    private @Getter String productName;
    private @Getter String productDescription;
    private @Getter LocalDateTime createdOn;

    public ProductRequest(String requestId, String userId, String productName, String productDescription,
            LocalDateTime createdOn) {
        this.requestId = requestId;
        this.userId = userId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.createdOn = createdOn;
    }

    public ProductRequest(String userId, String productName, String productDescription, LocalDateTime createdOn) {
        this.userId = userId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.createdOn = createdOn;
    }

    @Override
    public String toString() {
        return "ProductRequest [requestId=" + requestId + ", userId=" + userId + ", productName=" + productName
                + ", productDescription=" + productDescription + ", createdOn=" + createdOn + "]";
    }
}