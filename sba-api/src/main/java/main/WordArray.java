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
        //split into words
        String[] words = content.split("\\s+");
        Inflector inflector = new Inflector();
        for (int i = 0; i < words.length; i++) {
            //if word isn't encased in " ' ( or [
            if(words[i].matches("^[(\\[']\\w{1,}[^)\\]']$|^[^(\\[']\\w{1,}[)\\]']$")) {
                //remove all the following

                words[i] = words[i].replaceAll("(^[^\\w.;:,!?\\-'(\\[@#$%^&*=+\\]){}|/<>_][^\\w)\\]'-@#$%^&*=+\\[({}|/<>_]$)", "");

            } else {
                //same as above but ignore encasement; special case for "
                Boolean quoteFront = false;
                Boolean quoteBack = false;
                if(words[i].charAt(0) == '"'){quoteFront = true;}
                if(words[i].charAt(words[i].length() - 1) == '"'){quoteBack = true;}
                System.out.print(quoteFront);
                System.out.print((quoteBack));
                words[i] = words[i].replaceAll("(^[^\\w.;:,!?\\-@#$%^&*=+\\]){}|/<>_]|[^\\w-@#$%^&*=+\\[({}|/<>_]$)", "");
                if(quoteFront && !quoteBack) words[i] = '"' + words[i];
                if(!quoteFront && quoteBack) words[i] += '"';
                System.out.print(words[i]);
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
