(function(){
  'use strict';

  var presentArticles = function(data) {
    data.articles.forEach(function(item, i){
      item.id = i;
    });
    console.log(data);
    dust.render('article.html', data, function(err, out) {
      document.getElementById('index').innerHTML = out;
    });
  }

  // Load the Articles
  var request = new XMLHttpRequest();
  request.open('GET', '/js/articles.json', true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      var data = JSON.parse(this.response);
      presentArticles(data);
    } else {
      console.log('Response Error ' + this.status);
    }
  };

  request.onerror = function() {
    console.log('Request Error');
  };

  request.send();
})();
