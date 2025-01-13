package h4g.emart.repositories;

import h4g.emart.models.ProductLog;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductLogRepository extends MongoRepository<ProductLog, String> {
    List<ProductLog> findByProductId(String productId);
}
