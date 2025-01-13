package h4g.emart.controllers;

import h4g.emart.models.Product;
import h4g.emart.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // 1. Create a Product
    /**
     * Creates a new product in the system.
     * @param product The product object to be created.
     * @return A ResponseEntity containing the created product and HTTP status 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    // 2. Get a Product by ID (Read)
    /**
     * Retrieves a product by its unique product ID.
     * @param productId The unique ID of the product to be retrieved.
     * @return A ResponseEntity containing the product and HTTP status 200 (OK) if found,
     *         or HTTP status 404 (Not Found) if the product doesn't exist.
     */
    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable String productId) {
        Product product = productService.getProductById(productId);
        if (product != null) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 3. Get All Products (Read)
    /**
     * Retrieves all products in the system.
     * @return A ResponseEntity containing a list of all products and HTTP status 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // 4. Update a Product
    /**
     * Updates an existing product based on the provided product data.
     * @param productId The ID of the product to be updated.
     * @param updatedProduct The updated product object.
     * @return A ResponseEntity containing the updated product and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if the product does not exist.
     */
    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable String productId, @RequestBody Product updatedProduct) {
        Product product = productService.updateProduct(productId, updatedProduct);
        if (product != null) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 5. Delete a Product
    /**
     * Deletes a product from the system based on the provided product ID.
     * @param productId The ID of the product to be deleted.
     * @return A ResponseEntity with HTTP status 204 (No Content) if the deletion is successful,
     *         or HTTP status 404 (Not Found) if the product does not exist.
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String productId) {
        boolean deleted = productService.deleteProduct(productId);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 6. Update Product Quantity
    /**
     * Updates the quantity of an existing product.
     * @param productId The ID of the product whose quantity is to be updated.
     * @param quantity The new quantity of the product.
     * @return A ResponseEntity containing the updated product and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if the product does not exist.
     */
    @PatchMapping("/{productId}/quantity")
    public ResponseEntity<Product> updateProductQuantity(@PathVariable String productId, @RequestParam int quantity) {
        Product product = productService.updateProductQuantity(productId, quantity);
        if (product != null) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 7. Upload Product Photo
    /**
     * Uploads a photo for a product.
     * @param productId The ID of the product for which the photo is being uploaded.
     * @param productPhoto The photo file for the product.
     * @return A ResponseEntity containing the updated product and HTTP status 200 (OK),
     *         or HTTP status 404 (Not Found) if the product does not exist.
     */
    @PostMapping("/{productId}/photo")
    public ResponseEntity<Product> uploadProductPhoto(@PathVariable String productId, @RequestParam byte[] productPhoto) {
        Product product = productService.uploadProductPhoto(productId, productPhoto);
        if (product != null) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Endpoint to get Products by category
     * 
     * @param category The category to filter products by
     * @return List of products that belong to the specified category or HTTP 404 if none found
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        if (products.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
