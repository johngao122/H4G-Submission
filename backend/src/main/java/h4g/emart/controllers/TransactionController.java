package h4g.emart.controllers;

import h4g.emart.models.Transaction;
import h4g.emart.models.Transaction;
import h4g.emart.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // 1. Get all Transactions (Read)
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // 2. Get Transaction by Transaction ID
    @GetMapping("/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable String transactionId) {
        Transaction transaction = transactionService.getTransactionById(transactionId);
        if (transaction == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(transaction, HttpStatus.OK);
    }

    // 3. Get Transactions by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByUserId(@PathVariable String userId) {
        List<Transaction> transactions = transactionService.getTransactionsByUserId(userId);
        if (transactions == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // 4. Get Transactions by Product ID
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Transaction>> getTransactionsByProductId(@PathVariable String productId) {
        List<Transaction> transactions = transactionService.getTransactionsByProductId(productId);
        if (transactions.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // 5. Create a Transaction (Create)
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        Transaction createdTransaction = transactionService.createTransaction(transaction);
        return new ResponseEntity<>(createdTransaction, HttpStatus.CREATED);
    }

    // 6. Delete a Transaction (Delete)
    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable String transactionId) {
        boolean isDeleted = transactionService.deleteTransaction(transactionId);
        if (!isDeleted) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // 7. Get Transactions in Timeframe
    /**
     * Retrieves all transactions within a certain timeframe.
     * @param start The start of the timeframe.
     * @param end The end of the timeframe.
     * @return A ResponseEntity containing a list of Transactions and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if no Transactions are found in the timeframe.
     */
    @GetMapping("/timeframe")
    public ResponseEntity<List<Transaction>> getTransactionsInTimeframe(
            @RequestParam("start") String start,
            @RequestParam("end") String end) {

        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);

        List<Transaction> transaction = transactionService.getTransactionsInTimeframe(startTime, endTime);
        if (transaction.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(transaction, HttpStatus.OK);
    }
}
