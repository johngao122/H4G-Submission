package h4g.emart.controllers;

import h4g.emart.models.ProductLog;
import h4g.emart.services.ProductLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    // 8. Get Product Logs in Timeframe
    /**
     * Retrieves all product logs within a certain timeframe.
     * @param start The start of the timeframe.
     * @param end The end of the timeframe.
     * @return A ResponseEntity containing a list of productLog and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if no productLog are found in the timeframe.
     */
    @GetMapping("/timeframe")
    public ResponseEntity<List<ProductLog>> getProductLogsInTimeframe(
            @RequestParam("start") String start,
            @RequestParam("end") String end) {

        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);

        List<ProductLog> productLog = productLogService.getProductLogsInTimeframe(startTime, endTime);
        if (productLog.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productLog, HttpStatus.OK);
    }
}
