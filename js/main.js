(function(){
  'use strict';

  var tags = {};

  var presentArticles = function(data) {

    // Sort all articles by title
    // @TODO: This would be better done server-side when the index is processed
    data.articles.sort(function(a, b){
      var titleA = a.title.toLowerCase().replace(/^(a(n)?|the) /, ''),
          titleB = b.title.toLowerCase().replace(/^(a(n)?|the) /, '');

      if      (titleA > titleB) { return  1 }
      else if (titleA < titleB) { return -1 }
      else    { return 0 }
    });

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

      var elements = document.querySelectorAll('.tags li');
      Array.prototype.forEach.call(elements, function(el, i){
        el.addEventListener('click', function(event) {
          var currentTag = el.getAttribute('data-tag'),
              index = document.getElementById('index');
          index.className = '';
          window.location.hash = (currentTag != 'any') ? currentTag : '';
          if (currentTag != 'any') {
            index.classList.add('js-filtered');
            index.classList.add(currentTag);
          }
        });
      });
    });

    // Render out the filters
    dust.render('form.html', {'tags':tags}, function(err, out) {
      document.getElementById('filters').innerHTML = out;

      document.getElementById('filter').addEventListener('change', function(event) {
        var currentTag = event.target.value,
            index = document.getElementById('index');
        index.className = '';
        window.location.hash = (currentTag != 'any') ? currentTag : '';
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
