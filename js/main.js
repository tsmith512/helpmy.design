(function(){
  'use strict';

  var presentArticles = function(data) {

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
    dust.render('form.html', {'tags':data.tags, 'types': data.types}, function(err, out) {
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
