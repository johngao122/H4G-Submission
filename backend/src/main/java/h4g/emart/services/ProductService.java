package h4g.emart.services;

import h4g.emart.models.Product;
import h4g.emart.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // 1. Get all Products (Read)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 2. Get Product by Product ID
    public Product getProductById(String productId) {
        Optional<Product> product = productRepository.findById(productId);
        return product.orElse(null);
    }

    // 3. Create a Product (Create)
    public Product createProduct(Product product) {
        product.setProductId(SequenceGeneratorService.generateId("Product"));
        return productRepository.save(product);
    }

    // 4. Update a Product (Update)
    public Product updateProduct(String productId, Product updatedProduct) {
        Optional<Product> existingProductOptional = productRepository.findById(productId);
        if (existingProductOptional.isPresent()) {
            Product existingProduct = existingProductOptional.get();
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setDesc(updatedProduct.getDesc());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setQuantity(updatedProduct.getQuantity());
            existingProduct.setProductPhoto(updatedProduct.getProductPhoto());
            return productRepository.save(existingProduct);
        }
        return null;
    }

    // 5. Delete a Product (Delete)
    public boolean deleteProduct(String productId) {
        if (productRepository.existsById(productId)) {
            productRepository.deleteById(productId);
            return true;
        }
        return false;
    }

    // 6. Get Products by Category (Example: If you want to implement filtering by category)
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category); // Assuming there's a category field in your Product model
    }
}
