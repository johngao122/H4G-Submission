package h4g.emart.services;

import h4g.emart.exceptions.InsufficientBalanceException;
import h4g.emart.models.Product;
import h4g.emart.models.Transaction;
import h4g.emart.models.Transaction;
import h4g.emart.models.User;
import h4g.emart.services.ProductService;
import h4g.emart.services.SequenceGeneratorService;
import h4g.emart.services.UserService;
import h4g.emart.exceptions.InsufficientStockException;
import h4g.emart.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;
    
    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    /**
     * Retrieves all transactions.
     * @return A list of all transactions.
     */
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    /**
     * Retrieves a transaction by its ID.
     * @param transactionId The ID of the transaction to retrieve.
     * @return The transaction if found, or null if not found.
     */
    public Transaction getTransactionById(String transactionId) {
        Optional<Transaction> transaction = transactionRepository.findById(transactionId);
        return transaction.orElse(null);
    }

    /**
     * Retrieves transactions by user ID.
     * @param userId The ID of the user whose transactions to retrieve.
     * @return A list of transactions associated with the specified user.
     */
    public List<Transaction> getTransactionsByUserId(String userId) {
        return transactionRepository.findByUserId(userId);
    }

    /**
     * Retrieves transactions by product ID.
     * @param productId The ID of the product whose transactions to retrieve.
     * @return A list of transactions associated with the specified product.
     */
    public List<Transaction> getTransactionsByProductId(String productId) {
        return transactionRepository.findByProductId(productId);
    }

    /**
     * Creates a new transaction.
     * @param transaction The transaction object to create.
     * @return The created transaction.
     */
    public Transaction createTransaction(Transaction transaction) {
        User user = userService.getUserById(transaction.getUserId());
        if (user == null) {
            throw new IllegalArgumentException("User with ID " + transaction.getUserId() + " not found.");
        }

        Product product = productService.getProductById(transaction.getProductId());
        if (product == null) {
            throw new IllegalArgumentException("Product with ID " + transaction.getProductId() + " not found.");
        }

        // Check if product quantity is sufficient
        if (product.getQuantity() < transaction.getQtyPurchased()) {
            throw new InsufficientStockException("Insufficient product stock for product ID " + transaction.getProductId());
        }

        // Calculate the total price of the purchase
        double totalPrice = product.getPrice() * transaction.getQtyPurchased();

        // Check if user's voucher balance is sufficient for the purchase
        if (user.getVoucherBal() < totalPrice) {
            throw new InsufficientBalanceException("Insufficient voucher balance for user ID " + transaction.getUserId());
        }

        // Deduct the purchased quantity from the product's stock
        product.bought(transaction.getQtyPurchased());
        productService.updateProductOnPurchase(product);

        // Deduct the total price from the user's voucher balance
        user.deductBal(totalPrice);
        userService.updateUser(user.getUserId(), user);

        transaction.setTransactionId(sequenceGeneratorService.generateId("Transaction"));
        transaction.setTotalPrice(totalPrice);

        // Save the transaction
        return transactionRepository.save(transaction);
    }


    /**
     * Deletes a transaction by its ID.
     * @param transactionId The ID of the transaction to delete.
     * @return True if the transaction was deleted, false otherwise.
     */
    public boolean deleteTransaction(String transactionId) {
        if (transactionRepository.existsById(transactionId)) {
            transactionRepository.deleteById(transactionId);
            return true;
        }
        return false;
    }

    /**
     * Retrieves all transactions within a certain timeframe.
     * @param start The start of the timeframe.
     * @param end The end of the timeframe.
     * @return The list of transactions created in that timeframe
     */
    public List<Transaction> getTransactionsInTimeframe(LocalDateTime start, LocalDateTime end) {
        return transactionRepository.findByDatetimeBetween(start, end);
    }
}
