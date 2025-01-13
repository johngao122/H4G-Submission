package h4g.emart.models;

import java.util.Arrays;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "Product")

public class Product {
    private @Getter @Setter String productId;
    private @Getter @Setter String name;
    private @Getter @Setter String category;
    private @Getter @Setter String desc;
    private @Getter @Setter double price;
    private @Getter @Setter long quantity;
    private @Getter @Setter byte[] productPhoto;

    public Product(String productId, String name, String category, String desc, double price, long quantity,
            byte[] productPhoto) {
        this.productId = productId;
        this.name = name;
        this.category = category;
        this.desc = desc;
        this.price = price;
        this.quantity = quantity;
        this.productPhoto = productPhoto;
    }

    // Placeholder Product request
    public Product(String name, String category, String desc, double price, long quantity, byte[] productPhoto) {
        this.name = name;
        this.category = category;
        this.desc = desc;
        this.price = price;
        this.quantity = quantity;
        this.productPhoto = productPhoto;
    }

    public void bought(long amt) {
        this.quantity -= amt;
    }

    @Override
    public String toString() {
        return "Product [productId=" + productId + ", name=" + name + ", category=" + category + ", desc=" + desc
                + ", price=" + price + ", quantity=" + quantity + ", productPhoto=" + Arrays.toString(productPhoto)
                + "]";
    }
    
}
