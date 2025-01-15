package h4g.emart.controllers;

import h4g.emart.models.ProductRequest;
import h4g.emart.services.ProductRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    // 8. Get Product Requests in Timeframe
    /**
     * Retrieves all product requests within a certain timeframe.
     * @param start The start of the timeframe.
     * @param end The end of the timeframe.
     * @return A ResponseEntity containing a list of Product Requests and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if no Product Requests are found in the timeframe.
     */
    @GetMapping("/timeframe")
    public ResponseEntity<List<ProductRequest>> getProductRequestsInTimeframe(
            @RequestParam("start") String start,
            @RequestParam("end") String end) {

        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);

        List<ProductRequest> productRequest = productRequestService.getProductRequestsInTimeframe(startTime, endTime);
        if (productRequest.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productRequest, HttpStatus.OK);
    }
}
