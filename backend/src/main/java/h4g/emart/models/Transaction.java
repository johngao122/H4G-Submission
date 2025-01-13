package h4g.emart.models;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;

@Document(collection = "Transaction")

public class Transaction {
    private @Getter String transactionId;
    private @Getter String userId;
    private @Getter String productId;
    private @Getter int qtyPurchased;
    private @Getter long totalPrice;
    private @Getter LocalDateTime datetime;

    public Transaction(String transactionId, String userId, String productId, int qtyPurchased, long totalPrice) {
        this.transactionId = transactionId;
        this.userId = userId;
        this.productId = productId;
        this.qtyPurchased = qtyPurchased;
        this.totalPrice = totalPrice;
        this.datetime = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Transaction [transactionId=" + transactionId + ", userId=" + userId + ", productId=" + productId
                + ", qtyPurchased=" + qtyPurchased + ", totalPrice=" + totalPrice + ", datetime=" + datetime + "]";
    }
}

