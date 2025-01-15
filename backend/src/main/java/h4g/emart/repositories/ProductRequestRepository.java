package h4g.emart.repositories;

import h4g.emart.models.ProductRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ProductRequestRepository extends MongoRepository<ProductRequest, String> {
    List<ProductRequest> findByUserId(String userId);

    List<ProductRequest> findByDatetimeBetween(LocalDateTime start, LocalDateTime end);

}
