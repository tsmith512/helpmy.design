(function(){
  'use strict';

  var tags = {};

  var presentArticles = function(data) {
    // Process each article
    data.articles.forEach(function(item, i){

      // Add an ID to each
      item.id = i;

      // Aggregate tags across all articles so we have a count of each
      item.tags.forEach(function(tag, x){
        if (tag in tags) {
          tags[tag]++
        } else {
          tags[tag] = 1;
        }
      });
    });

    var filterStylesheet = document.createElement('style'),
        cssRules = ['.js-filtered article { display: none; }'];

    for (var tag in tags) {
      if (tags.hasOwnProperty(tag)) {
        cssRules.push('.js-filtered.tag-' + tag + ' .tag-' + tag + ' { display: block; }');
      }
    }
    filterStylesheet.type = 'text/css';
    filterStylesheet.innerHTML = cssRules.join(' ');
    document.getElementsByTagName('head')[0].appendChild(filterStylesheet);

    // @TODO: Remove debug code
    console.log(data);
    console.log(tags);

    // Render out all article teasers
    dust.render('article.html', data, function(err, out) {
      document.getElementById('index').innerHTML = out;
    });

    // Render out the filters
    dust.render('form.html', {'tags':tags}, function(err, out) {
      document.getElementById('filters').innerHTML = out;

      document.getElementById('filter').addEventListener('change', function(event) {
        var currentTag = event.target.value,
            index = document.getElementById('index');
        index.className = '';
        if (currentTag != 'any') {
          index.classList.add('js-filtered');
          index.classList.add(currentTag);
        }
      });
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
