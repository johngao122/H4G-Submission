package h4g.emart.models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "Transaction")

public class Transaction {
    @Id
    private @Getter @Setter String transactionId;
    private @Getter String userId;
    private @Getter String productId;
    private @Getter int qtyPurchased;
    private @Getter @Setter double totalPrice;
    private @Getter LocalDateTime datetime = LocalDateTime.now();;

    public Transaction() {}

    public Transaction(String transactionId, String userId, String productId, int qtyPurchased, double totalPrice) {
        this.transactionId = transactionId;
        this.userId = userId;
        this.productId = productId;
        this.qtyPurchased = qtyPurchased;
        this.totalPrice = totalPrice;
        this.datetime = LocalDateTime.now();
    }

    public Transaction(String userId, String productId, int qtyPurchased) {
        this.userId = userId;
        this.productId = productId;
        this.qtyPurchased = qtyPurchased;
    }

    @Override
    public String toString() {
        return "Transaction [transactionId=" + transactionId + ", userId=" + userId + ", productId=" + productId
                + ", qtyPurchased=" + qtyPurchased + ", totalPrice=" + totalPrice + ", datetime=" + datetime + "]";
    }
}

