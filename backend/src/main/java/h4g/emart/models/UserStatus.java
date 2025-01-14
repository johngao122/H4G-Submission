package h4g.emart.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum UserStatus {
    @JsonProperty("ACTIVE")
    ACTIVE, // regular active User

    @JsonProperty("INACTIVE")
    INACTIVE, // short-term inactive User

    @JsonProperty("SUSPENDED")
    SUSPENDED, // suspended from app usage

    @JsonProperty("ARCHIVED")
    ARCHIVED; // long-term inactive User, data archived for audit purposes
}
