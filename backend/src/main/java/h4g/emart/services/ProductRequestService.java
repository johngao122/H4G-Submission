package h4g.emart.services;

import h4g.emart.models.ProductRequest;
import h4g.emart.models.ProductRequest;
import h4g.emart.repositories.ProductRequestRepository;
import h4g.emart.services.SequenceGeneratorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductRequestService {

    @Autowired
    private ProductRequestRepository productRequestRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    /**
     * Retrieves all product requests.
     * @return a list of all product requests.
     */
    public List<ProductRequest> getAllProductRequests() {
        return productRequestRepository.findAll();
    }

    /**
     * Retrieves a product request by its ID.
     * @param requestId the ID of the product request to retrieve.
     * @return the product request if found, or null if not found.
     */
    public ProductRequest getProductRequestById(String requestId) {
        Optional<ProductRequest> productRequest = productRequestRepository.findById(requestId);
        return productRequest.orElse(null);
    }

    /**
     * Retrieves all product requests made by a specific user.
     * @param userId the ID of the user.
     * @return a list of product requests made by the user.
     */
    public List<ProductRequest> getProductRequestsByUserId(String userId) {
        return productRequestRepository.findByUserId(userId);
    }

    /**
     * Creates a new product request.
     * @param productRequest the product request to create.
     * @return the created product request.
     */
    public ProductRequest createProductRequest(ProductRequest productRequest) {
        productRequest.setRequestId(sequenceGeneratorService.generateId("ProductRequest"));
        return productRequestRepository.save(productRequest);
    }

    /**
     * Deletes a product request by its ID.
     * @param requestId the ID of the product request to delete.
     * @return true if the product request was deleted, false otherwise.
     */
    public boolean deleteProductRequest(String requestId) {
        if (productRequestRepository.existsById(requestId)) {
            productRequestRepository.deleteById(requestId);
            return true;
        }
        return false;
    }
    
    public List<ProductRequest> getProductRequestsInTimeframe(LocalDateTime start, LocalDateTime end) {
        return productRequestRepository.findByDatetimeBetween(start, end);
    }
}
