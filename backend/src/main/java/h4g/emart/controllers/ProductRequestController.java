package h4g.emart.controllers;

import h4g.emart.models.ProductRequest;
import h4g.emart.services.ProductRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-requests")
public class ProductRequestController {

    @Autowired
    private ProductRequestService productRequestService;

    // 1. Get all Product Requests (Read)
    @GetMapping
    public ResponseEntity<List<ProductRequest>> getAllProductRequests() {
        List<ProductRequest> productRequests = productRequestService.getAllProductRequests();
        return new ResponseEntity<>(productRequests, HttpStatus.OK);
    }

    // 2. Get Product Request by Request ID
    @GetMapping("/{requestId}")
    public ResponseEntity<ProductRequest> getProductRequestById(@PathVariable String requestId) {
        ProductRequest productRequest = productRequestService.getProductRequestById(requestId);
        if (productRequest == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productRequest, HttpStatus.OK);
    }

    // 3. Get Product Requests by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProductRequest>> getProductRequestsByUserId(@PathVariable String userId) {
        List<ProductRequest> productRequests = productRequestService.getProductRequestsByUserId(userId);
        if (productRequests.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productRequests, HttpStatus.OK);
    }

    // 4. Create a Product Request (Create)
    @PostMapping
    public ResponseEntity<ProductRequest> createProductRequest(@RequestBody ProductRequest productRequest) {
        ProductRequest createdProductRequest = productRequestService.createProductRequest(productRequest);
        return new ResponseEntity<>(createdProductRequest, HttpStatus.CREATED);
    }

    // 5. Delete a Product Request (Delete)
    @DeleteMapping("/{requestId}")
    public ResponseEntity<Void> deleteProductRequest(@PathVariable String requestId) {
        boolean isDeleted = productRequestService.deleteProductRequest(requestId);
        if (!isDeleted) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
