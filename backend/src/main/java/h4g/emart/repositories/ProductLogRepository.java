package h4g.emart.repositories;

import h4g.emart.models.ProductLog;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductLogRepository extends MongoRepository<ProductLog, String> {
    List<ProductLog> findByProductId(String productId);

    /**
     * Finds all preorders placed within a specific timeframe.
     * 
     * @param start The start of the timeframe.
     * @param end The end of the timeframe.
     * @return A list of preorders placed between the specified dates.
     */
    List<ProductLog> findByDatetimeBetween(LocalDateTime start, LocalDateTime end);
}
