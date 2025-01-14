package h4g.emart.controllers;

import h4g.emart.models.Preorder;
import h4g.emart.models.PreorderStatus;
import h4g.emart.services.PreorderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/preorders")
public class PreorderController {

    @Autowired
    private PreorderService preorderService;

    // 1. Create a Preorder
    @PostMapping
    public ResponseEntity<Preorder> createPreorder(@RequestBody Preorder preorder) {
        Preorder createdPreorder = preorderService.createPreorder(preorder);
        if (preorder != null) {
            return new ResponseEntity<>(preorder, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // 2. Get a Preorder by ID (Read)
    @GetMapping("/{preorderId}")
    public ResponseEntity<Preorder> getPreorderById(@PathVariable String preorderId) {
        Preorder preorder = preorderService.getPreorderById(preorderId);
        if (preorder != null) {
            return new ResponseEntity<>(preorder, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 3. Get All Preorders (Read)
    @GetMapping
    public ResponseEntity<List<Preorder>> getAllPreorders() {
        List<Preorder> preorders = preorderService.getAllPreorders();
        return new ResponseEntity<>(preorders, HttpStatus.OK);
    }

    // 4. Update a Preorder
    @PutMapping("/{preorderId}")
    public ResponseEntity<Preorder> updatePreorder(@PathVariable String preorderId, @RequestBody Preorder updatedPreorder) {
        Preorder preorder = preorderService.updatePreorder(preorderId, updatedPreorder);
        if (preorder != null) {
            return new ResponseEntity<>(preorder, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 5. Delete a Preorder
    @DeleteMapping("/{preorderId}")
    public ResponseEntity<Void> deletePreorder(@PathVariable String preorderId) {
        boolean deleted = preorderService.deletePreorder(preorderId);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // 6. Update Preorder Status
    @PatchMapping("/{preorderId}/status")
    public ResponseEntity<Preorder> updatePreorderStatus(@PathVariable String preorderId, @RequestBody String status) {
        Preorder preorder = preorderService.updatePreorderStatus(preorderId, status);
        try {
            if (preorder != null) {
                return new ResponseEntity<>(preorder, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
    }

    // 7. Get Preorders by Product ID
    /**
     * Retrieves all preorders associated with a specific product ID.
     * @param productId The ID of the product to filter preorders.
     * @return A ResponseEntity containing a list of preorders and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if no preorders are found for the product.
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Preorder>> getPreordersByProductId(@PathVariable String productId) {
        List<Preorder> preorders = preorderService.getPreordersByProductId(productId);
        if (preorders.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(preorders, HttpStatus.OK);
    }

    // 8. Get Preorders in Timeframe
    /**
     * Retrieves all preorders placed within a certain timeframe.
     * @param start The start of the timeframe.
     * @param end The end of the timeframe.
     * @return A ResponseEntity containing a list of preorders and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if no preorders are found in the timeframe.
     */
    @GetMapping("/timeframe")
    public ResponseEntity<List<Preorder>> getPreordersInTimeframe(
            @RequestParam("start") String start,
            @RequestParam("end") String end) {

        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);

        List<Preorder> preorders = preorderService.getPreordersInTimeframe(startTime, endTime);
        if (preorders.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(preorders, HttpStatus.OK);
    }

    // 9. Get Preorders by User ID
    /**
     * Retrieves all preorders associated with a specific user ID.
     * @param userId The ID of the user to filter preorders.
     * @return A ResponseEntity containing a list of preorders and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if no preorders are found for the user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Preorder>> getPreordersByUserId(@PathVariable String userId) {
        List<Preorder> preorders = preorderService.getPreordersByUserId(userId);
        if (preorders.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(preorders, HttpStatus.OK);
    }

    // 10. Get Preorders by Preorder Status
    /**
     * Retrieves all preorders associated with a specific user ID.
     * @param status The status to filter preorders by.
     * @return A ResponseEntity containing a list of preorders and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if no preorders are found for the user.
     */
    @GetMapping("status/{status}")
    public ResponseEntity<List<Preorder>> getPreordersByStatus(@PathVariable String status) {
        List<Preorder> preorders = preorderService.getPreordersByStatus(status);
        if (preorders.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(preorders, HttpStatus.OK); 
    }
}
