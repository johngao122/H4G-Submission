package h4g.emart.models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

import h4g.emart.models.PreorderStatus;
import h4g.emart.services.PreorderService;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "Preorder")

public class Preorder {
    @Id
    private @Getter @Setter String preorderId;
    private @Getter String userId;
    private @Getter String productId;
    private @Getter @Setter int qtyPreordered;
    private @Getter @Setter double totalPrice;
    private @Getter @Setter LocalDateTime datetime;
    @JsonProperty("status")
    private @Getter @Setter PreorderStatus status;

    public Preorder() {}
    
    public Preorder(String preorderId, String userId, String productId, int qtyPreordered, double totalPrice,
            LocalDateTime datetime, PreorderStatus status) {
        this.preorderId = preorderId;
        this.userId = userId;
        this.productId = productId;
        this.qtyPreordered = qtyPreordered;
        this.totalPrice = totalPrice;
        this.datetime = datetime;
        this.status = status;
    }

    public Preorder(String userId, String productId, int qtyPreordered) {
        this.userId = userId;
        this.productId = productId;
        this.qtyPreordered = qtyPreordered;
        this.status = PreorderStatus.PENDING;
        this.datetime = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Preorder [preorderId=" + preorderId + ", userId=" + userId + ", productId=" + productId
                + ", qtyPreordered=" + qtyPreordered + ", totalPrice=" + totalPrice + ", datetime=" + datetime + "]";
    }
}