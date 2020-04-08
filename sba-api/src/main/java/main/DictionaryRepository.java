package main;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Repository
public interface DictionaryRepository extends JpaRepository <Entry, Integer>{

    @Async
    CompletableFuture<Entry> findByWordAndWordLength(String word, int wordLength);

    @Async
    @Query("SELECT word FROM Entry WHERE soundex(word) LIKE soundex(:word) AND (wordLength = (:wordLength - 1) OR wordLength = :wordLength OR wordLength = (:wordLength + 1))")
    CompletableFuture<List<Entry>> wordAndWordLength(@Param("word")String word, @Param("wordLength")int wordLength);

}
