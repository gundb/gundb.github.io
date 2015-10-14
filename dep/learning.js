// Acronyms
// KSA = Knowledge, Skills, and Abilities
// RLO = Reusable Learning Object

var learning = {};
  
(function onLoad() { setRanges(); showRLOs() })();
  
/*****************************************************************************
   range object
   ---------------------------------------------------------------------------
   keys are the input range's number value; keys must be 0 or higher
   field value is the corresponding label
*/
learning.ksaRange =  
  {  "0": "No experience"
    , "1": "Novice dev"
    , "2": "Junior dev"
    , "3": "Intermediate dev"
    , "4": "Senior dev"
  };

  
/*****************************************************************************
   meta array
   ---------------------------------------------------------------------------
   [ short name, display name, input range object 
*/
learning.meta = [
    ['html', 'HTML', learning.ksaRange],
    ['js', 'JavaScript', learning.ksaRange],
    ['jq', 'jQuery', learning.ksaRange],
    ['node', 'node.js', learning.ksaRange],
    ['gun', 'gun', learning.ksaRange]
  ];


function setRanges() {
  /*****************************************************************************
   setRange function
   -----------------------------------------------------------------------------
   clones the `model` `li` and customizes based on:
    - fsLabel - the visible label name 
                (also used to uniquely identify fieldset attributes)
    - rangeObject - an object representing the valid range of values; 
                    must be 0 or higher
    - defaultValue (optional) - a default value (key) from the rangeObject
  */
  var setRange = function(ksaType, fsLabel, rangeObject, defaultValue) {
    // started from: http://stackoverflow.com/a/15249490/4285306
    
    // clone and append the fieldset model
    var e = $( ".model .range" ).clone(true).appendTo( ".ranges" );
    
    // setup the .range html
    var rangeKeys = Object.keys(rangeObject);
    var rangeMin = parseInt(rangeKeys[0]);
    var rangeMax = parseInt(rangeKeys[rangeKeys.length-1]);
    
    // if a defaultValue is not provided, use the median value rounded down
    var defVal = defaultValue = defaultValue || Math.floor((rangeMin + rangeMax)/2);
    
    // if values are skipped, move to the next value below
    while (rangeObject[defVal] === undefined && defVal >= 0) { defVal--; }
    
    // update the cloned fieldset
    e.find('input').attr('id', 'input-' + ksaType)
                   .attr('min', rangeKeys[0])
                   .attr('max', rangeMax)
                   .attr('value', defaultValue)
                   .change(changeKSA);
    e.find('.fsLabel').text(fsLabel).attr('for', 'input-' + ksaType);
    e.find('#resultId').attr('id', 'result-' + ksaType)
                       .text(rangeObject[defVal]);
    
    // on page load, set the text of the result label 
    // based on the value of the range
    $('#' + ksaType).text(rangeObject[$('li.range input').val()]);
  
    // setup an event handler to set the text when the range value is dragged 
    // (see event for input) or changed (see event for change)
    $('#input-' + ksaType).on('input change', function () {
        $('#result-' + ksaType).text(rangeObject[$('#input-' + ksaType).val()]);
    });
  };
  
  
  /*****************************************************************************
  **********************  EXAMPLE RANGE OBJECTS AND IIFE  **********************
  *****************************************************************************/
  
  
  /*****************************************************************************
     IIFE
     ---------------------------------------------------------------------------
     order that `setRange` is called is the order they will be displayed
  */
  $(function setupRanges() {
    // generate KSA Range html
    _.forEach(learning.meta, function(meta) {
      setRange(meta[0], meta[1], meta[2]/* , TODO: localStorage val*/);
    })
  })
}

function changeKSA () {
  showRLOs();
}

function changeRLOtype () {
  showRLOs();
    
  // TODO: verify redirect to anchored list works outside of Plunker
  var url = "http://"+window.location.host+"/RLO_list";
  window.location = url;
}

function showRLOs() {
  var rloList = [];
  
  // get the filters on which to filter the RLOs
  function getFilters () {
    var filters = {};
    
    // KSA filters
    var ksas = $('.ranges :input');
    _.forEach(ksas, function(ksa) {
      filters[ksa.id.slice(6)] = parseInt(ksa.value);
    });
    
    // RLO type/s filter
    var rlos = $('.RLO-Types input:checked');
    var types = [];
    _.forEach(rlos, function(rlo) { types.push(rlo.id); });
    filters.types = types;
    
    return (filters);
  }
  
  // determine whether to show a specific RLO
  function showRLO (rlo, filters) {
    var flag = true
    _.each(filters, function(learnerKSA, KSAname) {
      var rloLevel = parseInt(rlo.KSAs[KSAname]);
      // Filter on learner's KSAs   
      if ((typeof learnerKSA === "number") && (rlo.KSAs[KSAname] > learnerKSA)) {
        flag = false; return false;
      } 
      // Filter on learner's preferred RLO type
      else if (Array.isArray(learnerKSA)) { 
        var typeMatch = _.some(learnerKSA, function(ksa) {
            return ksa === rlo.type;
        })
        if (!typeMatch) { 
          flag = false; return false; }
      }
    });
    if (flag) { return rlo } else { return false }
  }
  
  // sort the list of RLOs to be display
  function sortRLOs (rloList) {
    // TODO
    return rloList;
  }
  
  // generate RLOs html and show to learner
  function displayRLOs (rloList) {
    
    // clear existing RLOs
    $( ".rlos" ).empty();
    
    _.forEach(rloList, function(rlo) {
      // clone and append the fieldset model
      var e = $( ".model .rlo" ).clone(true).appendTo( ".rlos" );
      
      // populate the actual view
      e.find('.rlo-title').text(rlo.name)
      e.find('.rlo-description').text(rlo.description)
//      e.find('.rlo-url').href(rlo.url);
      e.find('.rlo-source').html("<a href='" + rlo.urlCode + "'>source code</a>");
      e.find('.rlo-demo').html("<a href='" + rlo.urlDemo + "'>demonstration</a>");
      
    })
  }
  
  
  $.get('dep/RLOs.json', function(data){
    
    var filters = getFilters();
    
    // determine whether to show specific RLOs
    _.forEach(data.rlos, function(rlo) {
      var showIt = showRLO (rlo, filters);
      if (showIt && showIt !== undefined) { rloList.push(showIt) }
    })
    
    rloList = sortRLOs(rloList);
    displayRLOs(rloList);
  });
}