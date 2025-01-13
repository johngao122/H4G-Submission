package h4g.emart.repositories;

import h4g.emart.models.Preorder;
import h4g.emart.models.PreorderStatus;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PreorderRepository extends MongoRepository<Preorder, String> {

    /**
     * Finds all preorders by product ID.
     * 
     * @param productId The ID of the product.
     * @return A list of preorders associated with the product.
     */
    List<Preorder> findByProductId(String productId);

    /**
     * Finds all preorders by user ID.
     * 
     * @param userId The ID of the user.
     * @return A list of preorders made by the user.
     */
    List<Preorder> findByUserId(String userId);

    /**
     * Finds all preorders placed within a specific timeframe.
     * 
     * @param start The start of the timeframe.
     * @param end The end of the timeframe.
     * @return A list of preorders placed between the specified dates.
     */
    List<Preorder> findByDatetimeBetween(LocalDateTime start, LocalDateTime end);

     /**
     * Finds all preorders by status.
     * 
     * @param status The preorder status.
     * @return A list of preorders with said status.
     */
    List<Preorder> findByStatus(PreorderStatus status);
}
