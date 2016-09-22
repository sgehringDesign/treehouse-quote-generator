// event listener to respond to "Show another quote" button clicks
// when user clicks anywhere on the button, the "printQuote" function is called
var q = new Array();

function printQuote() {
  console.log('1 -----------------');
  $.ajaxSetup({ cache: false });
  
  $.getJSON("http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=", function(a) {
    console.log(a);
    q.push(a);
    console.log(q);
    console.log('2 -----------------');
    
    $('.quote').text( $(a[0].content ).text());
    $('.source').html(a[0].title);
    
  });
  
  console.log('3 -----------------');
}

document.getElementById('loadQuote').addEventListener("click", printQuote, false);

