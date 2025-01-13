interface ProductRequest {
    RequestId: string;
    UserId: string;
    ProductName: string;
    ProductDescription: string;
    DateTime: string;
}

interface ProductRequestSubmission {
    UserId: string;
    ProductName: string;
    ProductDescription: string;
    DateTime: string;
}

export type { ProductRequest, ProductRequestSubmission };
