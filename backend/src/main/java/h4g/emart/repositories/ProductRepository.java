package h4g.emart.repositories;

import h4g.emart.models.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    /**
     * Finds a product by its ID.
     * 
     * @param productId The ID of the product to search for.
     * @return The product with the specified ID, or null if not found.
     */
    Product findByProductId(String productId);

    /**
     * Finds products by category.
     * 
     * @param category The category to filter products by.
     * @return A list of products in the specified category.
     */
    List<Product> findByCategory(String category);

    /**
     * Finds products by a price range.
     * 
     * @param minPrice The minimum price of products to retrieve.
     * @param maxPrice The maximum price of products to retrieve.
     * @return A list of products within the specified price range.
     */
    List<Product> findByPriceBetween(long minPrice, long maxPrice);
}
