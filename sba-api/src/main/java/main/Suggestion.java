package main;

import java.util.Comparator;

public class Suggestion {

    private String word;
    private int distance;

    public Suggestion() {}

    public Suggestion(String word, int distance) {
        this.setWord(word);
        this.setDistance(distance);
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }

    public static Comparator<Suggestion> CompareDistance = new Comparator<Suggestion>() {

        public int compare(Suggestion s1, Suggestion s2) {

            int distance1 = s1.getDistance();
            int distance2 = s2.getDistance();

            int length1 = s1.getWord().length();
            int length2 = s2.getWord().length();

            //prioritize longer word if match
            return distance1 != distance2? distance1-distance2 : length2-length1;
        }
    };

}
