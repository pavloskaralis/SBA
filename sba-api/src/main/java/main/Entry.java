package main;

import javax.persistence.*;


@Entity
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String word;
    private int wordLength;


    public Entry() {}

    public Entry(String word) {
        this.setWord(word);
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

}
