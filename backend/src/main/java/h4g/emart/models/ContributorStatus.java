package h4g.emart.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ContributorStatus {
    @JsonProperty("PENDING")
    PENDING,

    @JsonProperty("APPROVED")
    APPROVED,

    @JsonProperty("REJECTED")
    REJECTED,

    @JsonProperty("PROCESSED")
    PROCESSED;
}
