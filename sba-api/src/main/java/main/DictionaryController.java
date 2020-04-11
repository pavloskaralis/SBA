package main;

import com.fasterxml.jackson.core.JsonProcessingException;

import com.google.gson.Gson;

import org.json.simple.JSONArray;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;


@CrossOrigin(origins = "*")
@RestController
public class DictionaryController {

    @Autowired
    DictionaryRepository dictionaryRepository;

    @PutMapping("/")
    public String index(@RequestBody Map<String, String> body) throws InterruptedException, ExecutionException, TimeoutException, JsonProcessingException {
        //later converted to JSON as final return
        Response results = new Response();

        //retrieve spell checker content and create array of words
        String content = body.get("content");
        WordArray words = new WordArray(content);

        String test = new Gson().toJson(words);
        System.out.print(test);
        //for each word
        String[] allContentWords = words.getWords();
        for (String currentWord: allContentWords) {

            //check if word matches a dictionary word and length (more time efficient)
            CompletableFuture<Entry> future = dictionaryRepository.findByWordAndWordLength(currentWord, currentWord.length());
            Entry entry = future.get();
            //if a match is found create a result with no suggestions
            if(entry != null) {
                ArrayList<String> empty = new ArrayList<String>();
                Result result = new Result(currentWord,empty,false);
                //add the result to the response object
                results.addResult(result);
                //otherwise if no match is found
            } else {
                //find the all matches by sound(more time efficient)
                CompletableFuture<List<Entry>> futureTwo = dictionaryRepository.wordAndWordLength(currentWord, currentWord.length());
                List<Entry> entries = futureTwo.get();
                //if matches found
                if(entries != null) {

                    //apply Levenshtein distance to each map and store all with a distance of 3 or less
                    ArrayList<Suggestion> suggestions = new ArrayList();
                    for ( Object currentEntry : entries.toArray()) {
                        int distance = Levenshtein.calculate(currentWord, currentEntry.toString());


                        if(distance < 4) {
                            Suggestion suggestion = new Suggestion(currentEntry.toString(),distance);
                            suggestions.add(suggestion);
                        }
                    }
                    //sort remaining matches by Levenshtein distance in ascending order
                    Collections.sort(suggestions,Suggestion.CompareDistance);
                    //extract up to 5 suggestions
                    ArrayList<String> topSuggestions = new ArrayList<String>();
                    for (int i = 0; i < suggestions.size(); i++) {
                        String suggestion = suggestions.get(i).getWord();
                        // if misspelled word is lowercase, make suggestion lowercase
                        if(currentWord.toLowerCase() == currentWord) {
                            suggestion = suggestion.toLowerCase();
                        }

                        topSuggestions.add(suggestion);

                        if(i == 4) { break; }
                    }
                    //create a result with the extracted suggestions
                    Result result = new Result(currentWord,topSuggestions,true);
                    //add the result to the response object
                    results.addResult(result);
                //if no suggestions are found for the misspelled word
                } else {
                    //create a result with a suggestions property, but specifying none found
                    ArrayList<String> empty = new ArrayList<String>();
                    Result result = new Result(currentWord,empty,true);
                    //add the result to the response object
                    results.addResult(result);
                }
            }

        }
        //convert response object to json
        String jsonResponse = new Gson().toJson(results);
        return jsonResponse;
    }

}
