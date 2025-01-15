package h4g.emart.models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "ProductRequest")

public class ProductRequest {
    @Id
    private @Getter @Setter String requestId;
    private @Getter String userId;
    private @Getter String productName;
    private @Getter String productDescription;
    private @Getter LocalDateTime datetime = LocalDateTime.now();

    public ProductRequest() {}

    public ProductRequest(String requestId, String userId, String productName, String productDescription,
            LocalDateTime datetime) {
        this.requestId = requestId;
        this.userId = userId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.datetime = datetime;
    }

    public ProductRequest(String userId, String productName, String productDescription) {
        this.userId = userId;
        this.productName = productName;
        this.productDescription = productDescription;
    }

    @Override
    public String toString() {
        return "ProductRequest [requestId=" + requestId + ", userId=" + userId + ", productName=" + productName
                + ", productDescription=" + productDescription + ", datetime=" + datetime + "]";
    }
}
