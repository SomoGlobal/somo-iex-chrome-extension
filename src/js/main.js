// =====================================================================
// START 'READY' BLOCK =================================================
// =====================================================================

// Extension 'ready' check [use for dist] ------------------------------
// chrome.extension.sendMessage({}, function(response) {
//   var readyStateCheckInterval = setInterval(function() {
//     if (document.readyState === "complete") {
//       clearInterval(readyStateCheckInterval);
//       ready();
//     }
//   }, 50);
// });

// Document 'ready' check [localhost/dev only] -------------------------
$(function() {
  ready();
});

// Start app -----------------------------------------------------------
function ready() {
  Somo.Views.init();
  Somo.UI.init();
}

// =====================================================================
// END 'READY' BLOCK ===================================================
// =====================================================================


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// FOREWORD
// This app makes heavy use of Underscore and Backbone to make
// structuring the more familiar jQuery behaviours. More info here:
// http://www.codemag.com/Article/1312061
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


var Somo = {};


// VIEWS ===============================================================

Somo.Views = (function() {
  
  function init() {
    
    Somo.Views.PostForm = Backbone.View.extend({
      
      render: function() {
        var rawTemplate = $('#post-form').html(),
            compiledTemplate = _.template(rawTemplate),
            renderedTemplate = compiledTemplate();
        this.$el.html(renderedTemplate);
        return this;
      }
      
    });
    
  }
  
  return {
    init: init
  };
  
})();


// USER INTERFACE BINDINGS =============================================

Somo.UI = (function() {
  
  var $postFormWrapper = $('#post-form-wrapper'),
      $postFormTrigger = $('#post-form-trigger'),
      postFormShown = false;
  
  function init() {
    
    $postFormTrigger.on('click', function(e) {
      e.preventDefault();
      if (!postFormShown) {
        var postForm = new Somo.Views.PostForm();
        postForm.render();
        $postFormWrapper.append(postForm.$el);
        postFormShown = true;
      }
    });
    
  }
  
  return {
    init: init
  };
  
})();
