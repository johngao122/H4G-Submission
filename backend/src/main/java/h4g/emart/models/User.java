package h4g.emart.models;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "Users")

public class User {
    private @Getter String userId;
    private @Getter @Setter String name;
    private @Getter @Setter Role role;
    private @Getter long voucherBal;
    private @Getter @Setter UserStatus userStatus;

    public User(String userId) {
        this.userId = userId;
    }

    public User(String userId, String name, Role role, long voucherBal, UserStatus userStatus) {
        this.userId = userId;
        this.name = name;
        this.role = role;
        this.voucherBal = voucherBal;
        this.userStatus = userStatus;
    }

    public void addBal(long amount) {
        this.voucherBal += amount;
    }

    public void deductBal(long amount) {
        this.voucherBal -= amount;
    }

    @Override
    public String toString() {
        return "User [userId=" + userId + ", name=" + name + ", role=" + role + ", voucherBal=" + voucherBal
                + ", UserStatus=" + userStatus + "]";
    }
}

