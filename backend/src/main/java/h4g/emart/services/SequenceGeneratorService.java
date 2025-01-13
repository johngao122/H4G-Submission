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
    private MongoOperations mongoOperations;

    public long generateId(String seqName) {
        Query query = new Query(Criteria.where("_id").is(seqName));
        Update update = new Update().inc("seq", 1);
        Sequence counter = mongoOperations.findAndModify(query, update, 
            FindAndModifyOptions.options().returnNew(true).upsert(true),
            Sequence.class);
        return !Objects.isNull(counter) ? counter.getSeq() : 1;
    }
}