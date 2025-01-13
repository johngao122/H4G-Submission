package h4g.emart.controllers;

import h4g.emart.models.ProductLog;
import h4g.emart.services.ProductLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-logs")
public class ProductLogController {

    @Autowired
    private ProductLogService productLogService;

    // 1. Get all Product Logs (Read)
    @GetMapping
    public ResponseEntity<List<ProductLog>> getAllProductLogs() {
        List<ProductLog> productLogs = productLogService.getAllProductLogs();
        return new ResponseEntity<>(productLogs, HttpStatus.OK);
    }

    // 2. Get Product Logs by Product ID
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductLog>> getProductLogsByProductId(@PathVariable String productId) {
        List<ProductLog> productLogs = productLogService.getProductLogsByProductId(productId);
        if (productLogs.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productLogs, HttpStatus.OK);
    }
}
