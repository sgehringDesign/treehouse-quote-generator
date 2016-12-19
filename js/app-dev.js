
  
(function () {

  // QUOTES ====================================================================================
  //-- DESCRIPTION: QUOTE ROTATION FUNCTIONALITY
  
  //-- NOTES: I still need to add error handling for if the API call returns bad

  //-- PROPERTIES:
  //---- url (string) : url to get the quote from quotesondesign.com
  //---- total (int) : total quotes to get from the api
  //---- order (string) : order of quotes returned
  //---- current (int) : current quote
  //---- sizes (object) : quote sizes for responsive presentation

  //-- PRIVATE METHODS:
  //----- quoteIndex() : checks quote incriments. If it hits max length then reset to zero
  //----- colorIndex() : get random color index the change color.  The do while loop ensure colors are not repeated.
  //----- printQuote() : Prints quote on the screen with jquery 
  //----- validateQuotes() : Santize and validate each quote in the returned quote data
  //----- changeQuotes() : this fucntion fades in and out the quote and changes the quote content
  //----- loadQuote() : valifates and loads quotes into the DOM after the API data has been returned 
  //----- getQuotes() : get quotes from the rest API
  //----- getTextarea() : get textarea and return as jquery object

  //-- PUBLIC METHODS:
  //----- set() : set tagName, attributes, and options
  //----- get() : get tagName, options attributes, or full object


  var quotesMaker = function (total, order) {

    if (typeof(total)==='undefined') {
      total = 30;
    }

    if (typeof(order)==='undefined') {
      order = 'rand';
    }

    // SET PROPERTIES (PRIVATE) __________________________________________________________________________
    var Quotes = {},
        current = 0,
        length = 0;
        api = {
          url: 'https://quotesondesign.com/wp-json/posts',
          total: 30, 
          order: 'rand',
          querystring: '?filter[orderby]=' + order + '&filter[posts_per_page]=' + total + 'x&callback=',
        },
        sizes = {
          large:  { 
            size: 200,
            name: 'large'  
          },
          medium: { 
            size: 100,
            name: 'medium' 
          },
          small: { 
            size: 50,
            name: 'small'
          },
          tiny: {
            size: 0,
            name: 'small'
          }
        },
        color = 0,
        colors = [
          "orange",
          "yellow",
          "green",
          "blue",
          "purple",
          "red"
        ],
        elements = {
          container: '#quote-box',
          quote: '#quote',
          source: '#source',
          button: '#loadQuote'
        };

    $.ajaxSetup({ cache: false });


    // quoteIndex() : PRIVATE ------------------------------------------
    //-- DESCRIPTION:    
    //----- checks quote incriments. If it hits max length then reset to zero
    var quoteIndex = function (current) {

      if(current < length) {
        return current ++
      } else {
        current = 0;
        return 0;
      }

    }


    // colorIndex() : PRIVATE ------------------------------------------
    //-- DESCRIPTION:    
    //----- get random color index the change color.  The do while loop ensure colors are not repeated.
    
    var colorIndex = function () {

      do {
        newcolor = Math.floor( ( Math.random() * colors.length ) + 0 );
      } while(color === newcolor);

      color = newcolor;
      return color;

    }


    // SET METHODS (PRIVATE) _____________________________________________________________________________
    // printQuote() : PRIVATE ---------------------------------------------

    //-- PARAMETERS:    
    //----- quote (object) : a single quote object from quotes array object returned results from the API

    var printQuote = function (quote) {
      
      $('body').removeClass();
      $('body').addClass( colors[ colorIndex() ] );
      
      $(elements.quote).removeClass(); //- remove all previous size classes 
      $(elements.quote).addClass(quote.size); //- add the new class to determine quote size
      $(elements.quote).html(quote.content); //- inject new quote content
      
      $(elements.source).html( '&ndash; <a href="' + quote.link + '" class="source" target="_blank" >' + quote.title + '</a>' ); //- inject new quote source
    } 


    // validateQuotes() : PRIVATE ------------------------------------------
    //-- PARAMETERS:    
    //----- quotes (object) : object contianting a collection of the returned results from the API

    //-- RETURNS: 
    //----- quotes (object) : results in the collect are cleaned of unnesscary HTML and checked for size

    validateQuotes = function (quotes) {

      var i = quotes.length;

      while (i--) {

        //- remove extra space and br tags in the api content returned
        quotes[i].content = quotes[i].content.replace( '</p>' , '</p>' ); // remove p tags
        quotes[i].content = quotes[i].content.replace( '<br />' , '' ); // remove br tags
        quotes[i].content = quotes[i].content.replace( '<ul>' , '' ); // remove ul tags
        quotes[i].content = quotes[i].content.replace( '</ul>' , '' ); // remove ul tags
        quotes[i].content = quotes[i].content.replace( '</li>' , ', ' ); // remove li tags
        quotes[i].content = quotes[i].content.replace( '<li>' , '' ); // remove li tags
        quotes[i].content = $.trim(quotes[i].content);
        quotes[i].content = quotes[i].content.replace( '. </p>' , '.</p>' ); // extra space after sentance
        quotes[i].content = quotes[i].content.replace( '.  </p>' , '.</p>' );  // extra space after sentance
        quotes[i].content = quotes[i].content.replace(/ (?=[^ ]*$)/i, "&nbsp;");  // &nbsp; to fix orphans in responsive

        //- remove quotes over 300 charecters
        if(quotes[i].content.length > 300) {
          quotes.splice(i, 1);
          continue;
        }

        //- add a size property to each quote
        if(quotes[i].content.length > 200) {
          quotes[i].size = 'large';
        } else if(quotes[i].content.length > 100) {
          quotes[i].size = 'medium';
        } else if(quotes[i].content.length > 50) {
          quotes[i].size = 'small';
        } else {
          quotes[i].size = 'tiny';
        }

      }

      length = quotes.length; // reset global length

      return quotes;

    }

    // changeQuotes() : PRIVATE ------------------------------------------
    //-- DESCRIPTION:    
    //----- this fucntion fades in and out the quote and changes the quote content
    changeQuotes = function () {
      var $quoteBox = $(elements.container);
      current ++;

      $quoteBox.fadeOut(function(){ 

        if(current > (length - 1)) {
          current = 0;
        }

        printQuote(quotes[ quoteIndex( current ) ]);
        $quoteBox.fadeIn(); 

      });

    }


    // loadQuote() : PRIVATE ------------------------------------------
    //-- PARAMETERS:    
    //----- response (object) : raw data returned from the API
    loadQuotes = function (response) {

      quotes = validateQuotes(response);

      $(document).ready(
        function(){ 

          printQuote(quotes[current]); 
          $(elements.button).fadeIn();
          $(elements.button).click(changeQuotes);

        }
      );
    }

    // getQuotes() : PRIVATE ------------------------------------------
    //-- PARAMETERS:    
    //----- response (object) : raw data returned from the API
    getQuotes = function (response) {
      $.getJSON( (api.url + api.querystring) , function( response ) { loadQuotes(response) }  );
    }

    getQuotes();

    // SET METHODS (PUBLIC) ___________________________________________

/* TO BE ADDED FOR ERROR HANDLING -------------------------------------
    // Quotes.isLoaded() : PUBLIC -------------------------------------
    //-- RETURNS: protected "loaded"
    Quotes.isLoaded = function() {
      return loaded;
    };  

    // Quotes.isCompleted() : PUBLIC -----------------------------------
    //-- RETURNS: protected "completed" property
    Quotes.isCompleted = function() {
      return completed;
    };
*/

    return Quotes;

  }

  var quotesModule = quotesMaker();

}());

