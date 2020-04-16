Live Link: https://sba-spell-checker.herokuapp.com/

Purpose: 
SBA Spell Check is created to serve as a phonetically oriented spell-checking API, which can be later morphed into a typo frequency spell checker as user input grows. In respect to the client, it is modeled after other online spell checkers, rather than the auto-correct implemented in document writing programs. 

Technologies: Angular, Spring Boot, MySQL, Regex, SCSS

Backend Overview: 
The app’s backend is written in Java using the Spring Boot framework, and connects to a MySQL database via two routes. The first route begins by receiving a body of text from the client, which it dissects into an array of words via regex expressions. Given the database only has singular versions of words, the backend relies on a third-party inflector to transform any pluralities. Once this process completes, each word is first queried for an exact match and word length within the MySQL database. The indexed word length column is of specific importance as it improves the API’s overall time efficiency by reducing the number of potential matches. If a match exists, a result object is created and pushed into the return array, signaling the word’s correct spelling. However, if no match is found, a second query is enacted using Soundex to retrieve phonetic similarities.  The server then applies the Levensthein algorithm to sequence these results by match distance, selecting the top five to return as suggestions within the word’s result object. Finally, to summarize the second route, it is simply a post route triggered by a user’s replacement selection – or decision to ignore the perceived misspelling – in order to create an additional database of common typos for later implementation. While doing away with the Soundex query would improve the accuracy of the API’s suggestions, the Levensthein algorithm on its own produces incredibly poor time efficiency. 


Frontend Overview: The spell checker’s client is built using Angular and comprises of 6 components, the two most crucial being Suggestion and Content. After the API delivers a response, the Suggestion Component is used to encompass a misspelled word. More specifically, it gives the user the ability to click on that word and toggle a dropdown menu which displays spelling suggestions, a custom input, and an ignore option. Should the user make a selection, the misspelling is re-rendered within the Content Component’s text body. In regards to this structure, it functions beyond what browsers traditionally support in that text fields and html elements become mixed together via the contenteditable attribute. While the interaction may appear seamless, contenteditable is prone to bugs, and thus prompted the implementation of several methods to create an illusion over normal browser behavior. The most dishearten of these errors was contenteditable’s deletion of inner elements when a user over-pressed backspace/delete. To fix this, an event listener was deployed to disable the delete button when content length equated to 1 character, and replaced functionality with the client’s own erase method. This same event listener was also tasked with tracking whether “control/command” + “a” + “delete” were pressed in that specific order, and implemented an identical response. 

