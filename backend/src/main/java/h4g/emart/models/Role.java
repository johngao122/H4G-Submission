package h4g.emart.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    RESIDENT("RESIDENT"),
    ADMIN("ADMIN");

    private final String role;

    // Constructor that assigns the string value to the enum constant
    Role(String role) {
        this.role = role;
    }

    // This method tells Jackson how to serialize the enum as a string
    @JsonValue
    public String getRole() {
        return role;
    }

    // This method tells Jackson how to deserialize a string into an enum constant
    @JsonCreator
    public static Role fromString(String role) {
        for (Role r : Role.values()) {
            if (r.role.equalsIgnoreCase(role)) {
                return r;
            }
        }
        throw new IllegalArgumentException("Unknown role: " + role);
    }
}
