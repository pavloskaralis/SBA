package main;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.ArrayList;

public class Result {

    private String word;
    private ArrayList<String> suggestions;

    public Result() {}

    public Result(String word, ArrayList<String> suggestions) {
        this.setWord(word);
        this.setSuggestions(suggestions);
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public ArrayList<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(ArrayList<String> suggestions) {
        this.suggestions = suggestions;
    }
//


}
