package h4g.emart.services;

import java.time.LocalDateTime;
import java.util.List;

import h4g.emart.models.ProductLog;
import h4g.emart.repositories.ProductLogRepository;
import h4g.emart.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ProductLogService {

    @Autowired
    private ProductLogRepository productLogRepository;

    public void createProductLog(String userId, String productId, String action) {
        ProductLog newProductLog = new ProductLog(
            SequenceGeneratorService.generateId("ProductLog"),
            userId,
            productId,
            LocalDateTime.now(),
            action
            );
        productLogRepository.save(newProductLog);
    }

    /**
     * Retrieves all product logs.
     * @return a list of all product logs.
     */
    public List<ProductLog> getAllProductLogs() {
        return productLogRepository.findAll();
    }

    /**
     * Retrieves product logs by product ID.
     * @param productId the ID of the product to filter logs.
     * @return a list of product logs associated with the given product ID.
     */
    public List<ProductLog> getProductLogsByProductId(String productId) {
        return productLogRepository.findByProductId(productId);
    }
}
