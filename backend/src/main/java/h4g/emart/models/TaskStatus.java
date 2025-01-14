package h4g.emart.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum TaskStatus {
    @JsonProperty("OPEN")
    OPEN,

    @JsonProperty("CLOSED")
    CLOSED;
}
