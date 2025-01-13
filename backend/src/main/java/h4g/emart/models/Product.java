package h4g.emart.models;

import java.util.Arrays;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "Products")

public class Product {
    private @Getter String productId;
    private @Getter @Setter String name;
    private @Getter @Setter String desc;
    private @Getter @Setter long price;
    private @Getter @Setter int quantity;
    private @Getter @Setter byte[] productPhoto;

    public Product(String productId) {
        this.productId = productId;
    }

    public Product(String productId, String name, String desc, long price, int quantity, byte[] productPhoto) {
        this.productId = productId;
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.quantity = quantity;
        this.productPhoto = productPhoto;
    }

    @Override
    public String toString() {
        return "Product [productId=" + productId + ", name=" + name + ", desc=" + desc + ", price=" + price
                + ", quantity=" + quantity + ", productPhoto=" + Arrays.toString(productPhoto) + "]";
    }
}
