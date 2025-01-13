package h4g.emart.models;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import h4g.emart.models.PreorderStatus;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "Preorder")

public class Preorder {
    private @Getter @Setter String preorderId;
    private @Getter String userId;
    private @Getter String productId;
    private @Getter @Setter int qtyPreordered;
    private @Getter @Setter long totalPrice;
    private @Getter @Setter LocalDateTime datetime;
    private @Getter @Setter PreorderStatus status;

    public Preorder(String userId, String productId, int qtyPreordered, long totalPrice, LocalDateTime datetime) {
        this.userId = userId;
        this.productId = productId;
        this.qtyPreordered = qtyPreordered;
        this.totalPrice = totalPrice;
        this.datetime = LocalDateTime.now();
        this.status = PreorderStatus.PENDING;
    }

    public Preorder(String preorderId, String userId, String productId, int qtyPreordered, long totalPrice) {
        this.preorderId = preorderId;
        this.userId = userId;
        this.productId = productId;
        this.qtyPreordered = qtyPreordered;
        this.totalPrice = totalPrice;
        this.datetime = LocalDateTime.now();
        this.status = PreorderStatus.PENDING;
    }

    @Override
    public String toString() {
        return "Preorder [preorderId=" + preorderId + ", userId=" + userId + ", productId=" + productId
                + ", qtyPreordered=" + qtyPreordered + ", totalPrice=" + totalPrice + ", datetime=" + datetime + "]";
    }
}