package h4g.emart.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Objects;
import h4g.emart.models.Sequence;

@Service
public class SequenceGeneratorService {

    @Autowired
    private static MongoOperations mongoOperations;

    public static String generateId(String seqName) {
        long seq = generateSequence(seqName);
        String prefix = "";
        switch (seqName) {
            case "Preorder":
                prefix = "PO";
                break;
            case "ProductLog":
                prefix = "L";
                break;
            case "ProductRequest":
                prefix = "R";
                break;
            case "Product":
                prefix = "P";
                break;
            case "Task":
                prefix = "T";
                break;
            case "Transaction":
                prefix = "TX";
                break;
            case "User":
                prefix = "U";
                break;
        }
        return prefix + seq;
    }

    public static long generateSequence(String seqName) {
        Query query = new Query(Criteria.where("_id").is(seqName));
        Update update = new Update().inc("seq", 1);
        Sequence counter = mongoOperations.findAndModify(query, update, 
            FindAndModifyOptions.options().returnNew(true).upsert(true),
            Sequence.class);
        return !Objects.isNull(counter) ? counter.increment() : 1;
    }
}