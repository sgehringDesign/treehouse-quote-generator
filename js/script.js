// event listener to respond to "Show another quote" button clicks
// when user clicks anywhere on the button, the "printQuote" function is called

(function () {

  var quotes;
  var current = 0;

  var loadQuotes = function () {

    $.ajaxSetup({ 
      cache: false 
    });

    $.getJSON("http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=30x&callback=",
      function(response) {
        quotes = response;

          $(document).ready(function(){ 
            $("#quote").html(quotes[current].content);
            $("#source").html('<a href="'+quotes[current].link+'" class="source" target="_blank" >'+quotes[0].title+'</a>');
          });

      }
    );

  }

  var printQuote = function () {
    current = current + 1; 
    if(current >= quotes.length) {
      current = 0;
    }
    $("#quote").html(quotes[current].content);
    $("#source").html('<a href="'+quotes[current].link+'" class="source" target="_blank" >'+quotes[current].title+'</a>');
    console.log(current);
  }

  document.getElementById('loadQuote').addEventListener("click", printQuote, false);

  var quote = loadQuotes();

}());

