package main;


import javax.persistence.*;

@Entity
public class Selection {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String original;
    private int original_length;
    private String replacement;
    private int replacement_length;
    private boolean ignored;


    public Selection() {}

    public Selection(String original, int original_length, String replacement, int replacement_length, boolean ignored) {
        this.setOriginal(original);
        this.setOriginal_length(original_length);
        this.setReplacement(replacement);
        this.setReplacement_length(replacement_length);
        this.setIgnored(ignored);
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getOriginal() {
        return original;
    }

    public void setOriginal(String original) {
        this.original = original;
    }

    public int getOriginal_length() {
        return original_length;
    }

    public void setOriginal_length(int original_length) {
        this.original_length = original_length;
    }

    public String getReplacement() {
        return replacement;
    }

    public void setReplacement(String replacement) {
        this.replacement = replacement;
    }

    public int getReplacement_length() {
        return replacement_length;
    }

    public void setReplacement_length(int replacement_length) {
        this.replacement_length = replacement_length;
    }

    public boolean isIgnored() {
        return ignored;
    }

    public void setIgnored(boolean ignored) {
        this.ignored = ignored;
    }
}
