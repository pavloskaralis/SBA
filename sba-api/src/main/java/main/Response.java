package main;

import java.util.ArrayList;

public class Response {


    private ArrayList<Result>  results = new ArrayList<Result>();

    public Response() {}

    public void addResult (Result result) {

        this.results.add(result);
    }

    public ArrayList<Result> getResults() {
        return results;
    }

    public void setResults(ArrayList<Result> results) {
        this.results = results;
    }


}
