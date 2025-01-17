package h4g.emart.repositories;

import h4g.emart.models.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByUserId(String userId);
    List<Transaction> findByProductId(String productId);
    List<Transaction> findByDatetimeBetween(LocalDateTime start, LocalDateTime end);
}
