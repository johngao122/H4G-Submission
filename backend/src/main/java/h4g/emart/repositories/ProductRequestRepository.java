package h4g.emart.repositories;

import h4g.emart.models.ProductRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRequestRepository extends MongoRepository<ProductRequest, String> {
    List<ProductRequest> findByUserId(String userId);
}
