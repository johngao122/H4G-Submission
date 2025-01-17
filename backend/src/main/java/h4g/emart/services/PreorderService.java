package h4g.emart.services;

import h4g.emart.models.Preorder;
import h4g.emart.models.PreorderStatus;
import h4g.emart.models.Product;
import h4g.emart.repositories.UserRepository;
import h4g.emart.repositories.PreorderRepository;
import h4g.emart.services.ProductService;
import h4g.emart.services.SequenceGeneratorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PreorderService {

    @Autowired
    private PreorderRepository preorderRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    /**
     * Creates a new preorder.
     * 
     * @param preorder The preorder to create.
     * @return The created preorder.
     */
    public Preorder createPreorder(Preorder preorder) {
        Product product = productService.getProductById(preorder.getProductId());
        if (userRepository.existsById(preorder.getUserId()) && product != null) {
            preorder.setPreorderId(sequenceGeneratorService.generateId("Preorder"));
            preorder.setTotalPrice(product.getPrice() * preorder.getQtyPreordered());
            return preorderRepository.save(preorder);
        }
        return null;
    }

    /**
     * Retrieves a preorder by its ID.
     * 
     * @param preorderId The ID of the preorder.
     * @return The preorder if found, otherwise null.
     */
    public Preorder getPreorderById(String preorderId) {
        Optional<Preorder> preorder = preorderRepository.findById(preorderId);
        return preorder.orElse(null);
    }

    /**
     * Retrieves all preorders.
     * 
     * @return A list of all preorders.
     */
    public List<Preorder> getAllPreorders() {
        return preorderRepository.findAll();
    }

    /**
     * Updates an existing preorder.
     * 
     * @param preorderId The ID of the preorder to update.
     * @param updatedPreorder The updated preorder details.
     * @return The updated preorder if found and updated, otherwise null.
     */
    public Preorder updatePreorder(String preorderId, Preorder updatedPreorder) {
        Optional<Preorder> existingPreorder = preorderRepository.findById(preorderId);
        if (existingPreorder.isPresent()) {
            Preorder preorder = existingPreorder.get();
            preorder.setQtyPreordered(updatedPreorder.getQtyPreordered());
            preorder.setTotalPrice(updatedPreorder.getTotalPrice());
            preorder.setDatetime(updatedPreorder.getDatetime());
            return preorderRepository.save(preorder);
        }
        return null;
    }

    /**
     * Deletes a preorder by its ID.
     * 
     * @param preorderId The ID of the preorder to delete.
     * @return True if the preorder was deleted, false if not found.
     */
    public boolean deletePreorder(String preorderId) {
        Optional<Preorder> preorder = preorderRepository.findById(preorderId);
        if (preorder.isPresent()) {
            preorderRepository.delete(preorder.get());
            return true;
        }
        return false;
    }

    /**
     * Updates the status of a preorder.
     * 
     * @param preorderId The ID of the preorder to update.
     * @param status The new status to set.
     * @return A ResponseEntity with the updated preorder or an error message.
     */
    public Preorder updatePreorderStatus(String preorderId, String status) {
        PreorderStatus preorderStatus = PreorderStatus.valueOf(status.toUpperCase());
        Optional<Preorder> preorder = preorderRepository.findById(preorderId);
        if (preorder.isPresent()) {
            Preorder p = preorder.get();
            p.setStatus(preorderStatus);
            return preorderRepository.save(p);
        } else {
            return null;
        }
    }

    /**
     * Retrieves all preorders by product ID.
     * 
     * @param productId The ID of the product to filter preorders.
     * @return A list of preorders for the specified product.
     */
    public List<Preorder> getPreordersByProductId(String productId) {
        return preorderRepository.findByProductId(productId);
    }

    /**
     * Retrieves all preorders placed within a specific timeframe.
     * 
     * @param start The start of the timeframe.
     * @param end The end of the timeframe.
     * @return A list of preorders placed within the timeframe.
     */
    public List<Preorder> getPreordersInTimeframe(LocalDateTime start, LocalDateTime end) {
        return preorderRepository.findByDatetimeBetween(start, end);
    }

    /**
     * Retrieves all preorders by user ID.
     * 
     * @param userId The ID of the user to filter preorders.
     * @return A list of preorders for the specified user.
     */
    public List<Preorder> getPreordersByUserId(String userId) {
        return preorderRepository.findByUserId(userId);
    }

    /**
     * Retrieves all preorders by status.
     * 
     * @param status The status to filter preorders by.
     * @return A list of preorders for the specified status.
     */
    public List<Preorder> getPreordersByStatus(String status) {
        PreorderStatus preorderStatus = PreorderStatus.valueOf(status.toUpperCase());
        return preorderRepository.findByStatus(preorderStatus);
    }
}
