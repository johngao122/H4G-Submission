package h4g.emart.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;

@Document(collection = "database_sequences")

public class Sequence {
    @Id
    private @Getter String seqId;
    private @Getter long seq;

    public synchronized long increment() {
        return ++seq;
    }
}
