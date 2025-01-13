package h4g.emart.models;

public enum UserStatus {
    ACTIVE, // regular active User
    INACTIVE, // short-term inactive User
    SUSPENDED, // suspended from app usage
    ARCHIVED // long-term inactive User, data archived for audit purposes
}