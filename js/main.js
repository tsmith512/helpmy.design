(function(){
  'use strict';

  var tags = {},
      types = {};

  var presentArticles = function(data) {

    // Process each article
    data.links.forEach(function(item, i){

      // Add an ID to each
      item.id = i;

      // Aggregate tags across all links so we have a count of each
      item.tags.forEach(function(tag, x){
        if (tag in tags) {
          tags[tag]++
        } else {
          tags[tag] = 1;
        }
      });

      // Aggregate types  across all links so we have a count of each
      if (item.type in types) {
        types[item.type]++
      } else {
        types[item.type] = 1;
      }
    });

    var filterStylesheet = document.createElement('style'),
        cssRules = ['.js-filtered article { display: none; }'];

    for (var tag in tags) {
      if (tags.hasOwnProperty(tag)) {
        cssRules.push('.js-filtered.tag-' + tag + ' .tag-' + tag + ' { display: block; }');
        cssRules.push('.js-filtered.tag-' + tag + ' li[data-tag="tag-' + tag + '"] { color: white; }');
      }
    }
    for (var type in types) {
      if (types.hasOwnProperty(type)) {
        cssRules.push('.js-filtered.type-' + type + ' .type-' + type + ' { display: block; }');
      }
    }
    filterStylesheet.type = 'text/css';
    filterStylesheet.innerHTML = cssRules.join(' ');
    document.getElementsByTagName('head')[0].appendChild(filterStylesheet);

    // @TODO: Remove debug code
    console.log(data);
    console.log(tags);
    console.log(types);

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
    dust.render('form.html', {'tags':tags, 'types': types}, function(err, out) {
      document.getElementById('filters').innerHTML = out;

      var filters = document.querySelectorAll('button');
      Array.prototype.forEach.call(filters, function(el, i){
        el.addEventListener('click', function(event) {
          var currentFilter = event.target.getAttribute('data-filter'),
              index = document.getElementById('index');
          index.className = '';
          window.location.hash = (currentFilter != 'any') ? currentFilter : '';
          if (currentFilter != 'any') {
            index.classList.add('js-filtered');
            index.classList.add(currentFilter);
          }
        });
      });
    });
  }

  // Load the Articles
  var request = new XMLHttpRequest();
  request.open('GET', '/js/links.json', true);

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
