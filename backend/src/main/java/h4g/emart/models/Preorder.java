package h4g.emart.models;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;

@Document(collection = "Preorders")

public class Preorder {
    private @Getter String preorderId;
    private @Getter String userId;
    private @Getter String productId;
    private @Getter int qtyPreordered;
    private @Getter long totalPrice;
    private @Getter LocalDateTime datetime;

    public Preorder(String preorderId, String userId, String productId, int qtyPreordered, long totalPrice) {
        this.preorderId = preorderId;
        this.userId = userId;
        this.productId = productId;
        this.qtyPreordered = qtyPreordered;
        this.totalPrice = totalPrice;
        this.datetime = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Preorder [preorderId=" + preorderId + ", userId=" + userId + ", productId=" + productId
                + ", qtyPreordered=" + qtyPreordered + ", totalPrice=" + totalPrice + ", datetime=" + datetime + "]";
    }
}

