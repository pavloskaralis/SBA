package main;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.ArrayList;

public class Result {

    private String word;
    private ArrayList<String> suggestions;

    private Boolean misspelled;

    public Result() {}

    public Result(String word, ArrayList<String> suggestions, Boolean misspelled) {
        this.setWord(word);
        this.setSuggestions(suggestions);
        this.setMisspelled(misspelled);
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

    public Boolean getMisspelled() {
        return misspelled;
    }

    public void setMisspelled(Boolean misspelled) {
        this.misspelled = misspelled;
    }
//


}
