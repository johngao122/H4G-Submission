package h4g.emart.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum PreorderStatus {
    @JsonProperty("PENDING")
    PENDING,

    @JsonProperty("FULFILLED")
    FULFILLED,

    @JsonProperty("CANCELLED")
    CANCELLED;
}
