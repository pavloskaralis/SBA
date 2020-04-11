package main;

import java.util.ArrayList;

public class WordArray {

    private String[] words;

    public WordArray() {}

    public WordArray(String content) {

        this.setWords(content);

    }

    public String[] getWords() {
        return words;
    }

    public String getWord(int i) { return words[i]; }

    public void setWords(String content) {
        String[] words = content.split("\\s+");
        Inflector inflector = new Inflector();
        for (int i = 0; i < words.length; i++) {
            //break content down into words
            if( !words[i].matches("^\\W{1,}") ){
                words[i] = words[i].replaceAll("[^\\w]", "");
            }
            //if plural, replace with singular
            String singular = inflector.singularize(words[i]);
            if(singular.toLowerCase() != words[i].toLowerCase()) {
                words[i] = singular;
            }
        }

        this.words = words;
    }

    @Override
    public String toString() {
        return "WordArray{" +
                "words=" + words +
                "}";
    }
}
