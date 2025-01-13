package h4g.emart.models;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "User")

public class User {
    private @Getter @Setter String userId;
    private @Getter @Setter String name;
    private @Getter @Setter Role role;
    private @Getter double voucherBal;
    private @Getter @Setter UserStatus status;

    public User(String userId, String name, Role role, double voucherBal, UserStatus userStatus) {
        this.userId = userId;
        this.name = name;
        this.role = role;
        this.voucherBal = voucherBal;
        this.status = userStatus;
    }

    public User(String name, Role role, double voucherBal, UserStatus userStatus) {
        this.name = name;
        this.role = role;
        this.voucherBal = voucherBal;
        this.status = userStatus;
    }

    public void addBal(double amount) {
        this.voucherBal += amount;
    }

    public void deductBal(double amount) {
        this.voucherBal -= amount;
    }

    @Override
    public String toString() {
        return "User [userId=" + userId + ", name=" + name + ", role=" + role + ", voucherBal=" + voucherBal
                + ", UserStatus=" + status + "]";
    }
}
