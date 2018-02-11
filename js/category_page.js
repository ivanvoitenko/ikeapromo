/**
 * Name Space - com.ikea.irw.catalog - Name space using for landing page
 * jslint browser: $, $$, document, $namespace, com, jsonPartNumbers, PresentationLayer, Pintip, Template, Event, Element, window, baseUrl, irwstatSetTrailingTag, defaultSortVal, vendor
 **/

$namespace('com.ikea.irw.catalog');

com.ikea.irw.catalog.ProductList = (function() {

  var productList = {};
  /**
   * includeMoreOption function using to include the moreOption button into the GPR enabled product.
   **/
  function includeMoreOption(k, link) {
    var temp, prodId, newProdList, moreOptionEnabled;
    temp = link.id.split('_');
    prodId = temp[1];
    newProdList = true;
    if (typeof(jsonPartNumbers) !== "undefined" && jsonPartNumbers !== null && jsonPartNumbers.length !== 0) {
      moreOptionEnabled = typeof(jsonPartNumbers[k]) !== "undefined" ? true : false;
    }
    if (moreOptionEnabled) {
      if (jsonPartNumbers[k].length > 1) {
        $(link).insert(PresentationLayer.showMoreOption(prodId, newProdList));
      }
    }
  }
  /**
   * init function will be invoked from the dom:loaded event.
   **/
  productList.init = function() {
    productList.eventsOnProducts();
  };
  /**
   * eventsOnProducts function bind mouse over event on each product.
   * invoke pintip class on mouse over event of teh product.
   **/
  productList.eventsOnProducts = function() {
    var increaseHeight = 10,
      k = 0,
      popStr, miniPipPopDimension, elementHeight;
    $$("#productLists .product").each(function(link) {
      includeMoreOption(k, link);
      link.observe('mouseenter', function(evt) {
        PresentationLayer.initialProdId = link.id;
        miniPipPopDimension = $(link).getDimensions();
        elementHeight = miniPipPopDimension.height + increaseHeight;
        popStr = "<div id=\"landingPopup\" class=\"productLists\"><div class=\"product\"></div></div>";
        new Pintip(link, {
          content: popStr,
          id: 'prodInfoLanding',
          categoryPage: 'true',
          moreOption: 'ture',
          landingPage: 'true',
          maxWidth: '268',
          pinY: 'bottom',
          align: 'bottom',
          offsetY: -elementHeight
        });
        // START: 5.18, IKEA00743856, atgar1
        vendor.updateProp44Value("productLists", "product listing", true);
        // END: 5.18, IKEA00743856, atgar1
      });
      k++;
    });
  };

  return productList;
}());

com.ikea.irw.catalog.JsEnabledDropDown = (function() {
  var publicFunctions = {};
  var dropDownTemplate = new Template('<div id="productsFilterSortBy" class="productsFilterSortBy floatRight" style="width:auto%">' +
    '<div class="sortLeft floatLeft"></div>' +
    '<div class="sortMiddle floatLeft">#{defaultVal}</div>' +
    '<div class="sortRight floatLeft"></div>' +
    '</div>');
  /**
   * selectBox function using to get the select element for creating the JS verison of the dropdown.
   **/
  function selectBox() {
    var nonJSVal = $('sortBy').down('select').descendants();
    return nonJSVal;
  }
  /**
   * positionDropdown function using to get the position of the select element .
   **/
  function positionDropdown() {
    var dropDownBar, dropDown, dropDownHeight, pos, dropDownWidth;
    dropDownBar = $('productsFilterSortBy');
    dropDown = $('subContainer');
    dropDownHeight = dropDownBar.getHeight();
    dropDownWidth = dropDownBar.getWidth();
    pos = dropDownBar.cumulativeOffset();
    dropDown.setStyle({
      left: pos.left + 1 + "px",
      top: pos.top + dropDownHeight - 12 + "px",
      width: dropDownWidth - 4 + "px"
    });
  }
  /**
   * getQuerystring function be using to get the selected sort by element .
   **/
  function getQuerystring(key) {
    var regex, qs;
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    qs = regex.exec(window.location.href);
    if (qs === null) {
      return null;
    } else {
      return qs[1];
    }
  }
  /**
   * bindMouseEvent function using to bind the click events on the sort by button.
   **/
  function bindMouseEvent() {
    var checkDisplay, subEl;
    Event.observe($('productsFilterSortBy'), 'mousedown', function(e) {
      subEl = $('subContainer');
      checkDisplay = subEl.getStyle('display');
      if (checkDisplay === 'block') {
        subEl.setStyle({
          display: 'none'
        });
      } else {
        subEl.setStyle({
          display: 'block'
        });
        positionDropdown();
        // START: 5.18, IKEA00743856, atgar1
        vendor.updateProp44Value("subContainer", "sort and filters", true);
        // END: 5.18, IKEA00743856, atgar1
      }
    });
  }
  /**
   * hideDropDown function using to hide the dropdwon when user click on the dom.
   **/
  function hideDropDown() {
    var isFilter = function(ele) {
      if (ele !== null) {
        if (ele.className) {
          if ((ele.className.indexOf("subContainer") >= 0) || (ele.className.indexOf("subContainer") >= 0) || (ele.className.indexOf("sortBy") >= 0)) {
            return true;
          }
        }
        if (ele.tagName) {
          if (ele.tagName.toLowerCase() !== "body") {
            return isFilter(ele.parentNode);
          }
        }
      }
      return false;
    };
    if (isFilter(arguments[0].target)) {
      return;
    }
    $('subContainer').setStyle({
      display: 'none'
    });
  }
  /**
   * init function invoked from the dom:loaded event.
   **/
  publicFunctions.init = function() {
    var optVal = selectBox();
    this.createDropDown(optVal);
    this.clickOnDom();
  };
  /**
   * onClick on dom - clickOnDom function using to hide the dropdown when user click outside teh dropdown .
   **/
  publicFunctions.clickOnDom = function() {
    Event.observe(document, "click", function() {
      hideDropDown.apply(this, arguments);
    });
  };
  /**
   * createDropDown function using to create the dropdwon using the values in the select element which is using for non JS.
   * @param {object} optVal HTML object of the select element.
   **/
  publicFunctions.createDropDown = function(optVal) {
    var obj, subContainer, dropDownBar, baseURL, item, sortingName, className, dropDownTemp, defaultVal, tempContainer;
    tempContainer = new Element('div', {
      'id': 'containerTemp'
    });
    if (baseUrl.indexOf("?") !== -1) {
      baseURL = baseUrl + "&sorting=";
    } else {
      baseURL = baseUrl + "?sorting=";
    }
    sortingName = getQuerystring('sorting');
    optVal.each(function(link) {
      if (sortingName === null) {
        defaultVal = defaultSortVal;
      }
      if (sortingName === link.value) {
        className = "activeLink";
        defaultVal = link.text;
      } else {
        className = "items";
      }

      item = new Element('a', {
        'href': baseURL + link.value,
        'id': link.value,
        'class': className
      }).update(link.text);
      Event.observe(item, 'mousedown', function(e) {
        irwstatSetTrailingTag('IRWStats.sort', this.id);
      });
      tempContainer.insert(item);
    });
    dropDownTemp = '<div id="productsFilterSortBy" class="productsFilterSortBy floatRight" style="width:auto%;display:block">' +
      '<div class="sortLeft floatLeft"></div>' +
      '<div class="sortMiddle floatLeft">' + defaultVal + '</div>' +
      '<div class="sortRight floatLeft"></div>' +
      '</div>';
    $('sortBy').update(dropDownTemp);
    bindMouseEvent();
    subContainer = new Element('div', {
      'class': 'subContainer',
      'id': 'subContainer'
    });
    subContainer.update(tempContainer);
    subContainer.setStyle({
      display: 'none'
    });
    $(document.body).insert({
      top: subContainer
    });

  };
  return publicFunctions;
}());
/**
 * Name Space - com.ikea.irw.catalog.PriceFilter - NameSpace using for validate the price filter
 * jslint browser:  errInvalidPrice, lowerLimit, upperLimit, errPriceRange
 **/
com.ikea.irw.catalog.PriceFilter = (function() {
  var publicFunctions = {};

  function numberCheck() {
    var minVal, maxVal, NUM_PATTERN, minCookie, maxCookie;
    minVal = $('minprice').value;
    maxVal = $('maxprice').value;
    minCookie = getCookie('MiniPriceFilter');
    maxCookie = getCookie('MaxPriceFilter');
    NUM_PATTERN = /^[\d]{1,15}$/;
    if (!NUM_PATTERN.test(Math.round(minVal)) && !NUM_PATTERN.test(Math.round(maxVal))) {
      $('warningMsg').update(errInvalidPrice);
      if (minCookie != null && maxCookie != null) {
        $('minprice').value = minCookie;
        $('maxprice').value = maxCookie;
      } else {
        $('minprice').value = lowerLimit;
        $('maxprice').value = upperLimit;
      }
      $('warningMsg').style.display = "block";
      return 'false';
    }
    if (!NUM_PATTERN.test(Math.round(minVal))) {
      $('warningMsg').update(errInvalidPrice);
      $('warningMsg').style.display = "block";
      if (minCookie != null && maxCookie != null) {
        $('minprice').value = minCookie;
      } else {
        $('minprice').value = lowerLimit;
      }
      return 'false';
    }
    if (!NUM_PATTERN.test(Math.round(maxVal))) {
      $('warningMsg').update(errInvalidPrice);
      $('warningMsg').style.display = "block";
      if (minCookie != null && maxCookie != null) {
        $('maxprice').value = maxCookie;
      } else {
        $('maxprice').value = upperLimit;
      }
      return 'false';
    }
    if (Number(minVal) > Number(maxVal)) {
      $('warningMsg').update(errPriceRange);
      if (minCookie != null && maxCookie != null) {
        $('minprice').value = minCookie;
        $('maxprice').value = maxCookie;
      } else {
        $('minprice').value = lowerLimit;
        $('maxprice').value = upperLimit;
      }
      $('warningMsg').style.display = "block";
      return 'false';
    }
    return 'true';
  }


  publicFunctions.init = function() {
    var val = numberCheck();
    if (val === 'true') {
      return true;
    } else {
      return false;
    }
  };
  return publicFunctions;
}());

document.observe('dom:loaded', function() {
  if ($('productLists') !== null) {
    com.ikea.irw.catalog.ProductList.init();
  }
  if ($('sortBy') !== null) {
    com.ikea.irw.catalog.JsEnabledDropDown.init();
  }
  if ($$(".foregroundContentPosition .selectStore")[0] !== null && typeof($$(".foregroundContentPosition .selectStore")[0]) !== 'undefined') {
    com.ikea.irw.catalog.JsEnabledLocalStoreDropDown.init();
  }
  com.ikea.irw.landing.readMore.eventBinding();
  com.ikea.irw.landing.toolTip.eventBinding();
});

//Namespace starts for service drop down
com.ikea.irw.catalog.JsEnabledLocalStoreDropDown = (function() {
  var JsEnabledLocalStoreDropDown = {};
  var countryCode = irwstats_locale.replace(/^[a-z]{2}_/, '').toLowerCase();
  var languageCode = irwstats_locale.replace(/_[A-Z]+$/, '');
  var defaultStoreVal = "choose";
  if ((typeof js_fn_defaultLocalStore_txt !== 'undefined') && (js_fn_defaultLocalStore_txt !== null)) {
    var defaultStoreText = js_fn_defaultLocalStore_txt;
  }

  /**
   * init function invoked from the dom:loaded event.
   **/

  function selectServiceAdBox(element) {
    var nonJSVal = element.down('select').descendants();
    return nonJSVal;
  }

  function bindMouseEventForStoreSelect(pdivobj, pcount) {
    var checkDisplay, subEl;
    Event.observe(pdivobj, 'mousedown', function(e) {
      subEl = $('subContainerServiceAd' + pcount);
      checkDisplay = subEl.getStyle('display');
      if (checkDisplay === 'block') {
        subEl.setStyle({
          display: 'none'
        });
      } else {
        $$('.subContainerServiceAd').each(function(divobj) {
          divobj.setStyle({
            display: 'none'
          });
        })
        subEl.setStyle({
          display: 'block'
        });

        var slider = new Control.Slider('containerTempscrollerHandle' + pcount, 'containerTempscrollerTrack' + pcount, {
          axis: 'vertical',
          onSlide: function(v) {
            JsEnabledLocalStoreDropDown.scrollVertical(v, $('containerTempServiceAd' + pcount), slider)
          },
          onChange: function(v) {
            JsEnabledLocalStoreDropDown.scrollVertical(v, $('containerTempServiceAd' + pcount), slider)
          }
        });
        positionDropdownForStoreSelect(pdivobj, subEl, slider);
      }
    });
  }

  function positionDropdownForStoreSelect(pdivobj, subEl, slider) {
    var dropDownBar, dropDown, dropDownHeight, pos, dropDownWidth, position, typeName, typePosition = 0,
      singleselectheight = 0,
      handleposition = 0,
      sliderendvalue = 0;
    dropDownBar = pdivobj;
    dropDown = subEl;
    dropDownHeight = dropDownBar.getHeight();
    pos = dropDownBar.cumulativeOffset();
    position = dropDown.id.replace(/\D/g, "");
    typeName = (($$("." + dropDownBar.className + " .productsFilterSortBy .sortMiddle")[position]).innerHTML).split("<")[0];
    var tot = 0;
    $$('#containerTempServiceAd' + position + ' .serviceAdContainerInnerDiv .items').each(function(obj) {
      if (obj.innerHTML === typeName) {
        typePosition = tot;
      }
      if (singleselectheight === 0) {
        singleselectheight = obj.getHeight();
      }
      tot = tot + obj.getHeight();
    });
    handleposition = ((typePosition) * 53) / tot;
    sliderendvalue = handleposition / 53;
    $('containerTempscrollerHandle' + position).setStyle({
      'top': handleposition + "px"
    });
    $('containerTempServiceAd' + position).scrollTop = typePosition;
    if (!Prototype.Browser.IE) {
      dropDown.setStyle({
        left: pos.left + 1 + "px",
        top: pos.top + dropDownHeight - 3 + "px",
        width: "226px"

      });
    } else {
      dropDown.setStyle({
        left: pos.left - 19 + "px",
        top: pos.top + dropDownHeight - 3 + "px",
        width: "226px"

      });
    }
  }

  function hideDropDown() {
    var isFilter = function(ele) {
      if (ele !== null) {
        if (ele.className) {
          if ((ele.className.indexOf("subContainerServiceAd") >= 0) || (ele.className.indexOf("selectStore") >= 0)) {
            return true;
          }
        }
        if (ele.tagName) {
          if (ele.tagName.toLowerCase() !== "body") {
            return isFilter(ele.parentNode);
          }
        }
      }
      return false;
    };
    if (isFilter(arguments[0].target)) {
      return false;
    } else {
      return true;
    }

  }

  JsEnabledLocalStoreDropDown.init = function() {
      var count = 0;
      var optVal;
      var cookieFlag = false;
      var localStoreNameInCookie = "";

      var storeNumCookieName = 'selected_store_num_' + languageCode + '_' + countryCode.toUpperCase();
      if (getCookie(storeNumCookieName) !== null && getCookie(storeNumCookieName) !== "") {
        var storeNum = getCookie(storeNumCookieName);
        var storeName = JsEnabledLocalStoreDropDown.getLocalStoreName(storeNum);
        defaultStoreVal = "/" + countryCode + "/" + languageCode + "/store/" + storeName;
        cookieFlag = true;
      } else {
        var storeCookieName = 'selected_store_' + languageCode + '_' + countryCode.toUpperCase();
        if (getCookie(storeCookieName) !== null && getCookie(storeCookieName) !== "") {
          localStoreNameInCookie = getCookie(storeCookieName);
          defaultStoreVal = "/" + countryCode + "/" + languageCode + "/store/" + localStoreNameInCookie;
          cookieFlag = true;
        }
      }

      $$(".localStoreFormDiv").each(function(divBtnObj) {
        divBtnObj.style.display = "block";
      });
      $$(".foregroundContentPosition .selectStore").each(function(divobj) {
        divobj.style.display = "block";
        optVal = selectServiceAdBox(divobj);
        if (cookieFlag) {
          optVal.each(function(obj) {
            if (obj.value === defaultStoreVal) {
              defaultStoreText = obj.text;
            }
          })
        }
        JsEnabledLocalStoreDropDown.createServiceAdDropDown(optVal, count, divobj, cookieFlag);
        JsEnabledLocalStoreDropDown.clickOnDom(count);
        count++;
      });
    },
    JsEnabledLocalStoreDropDown.createServiceAdDropDown = function(poptVal, pcount, pdivobj, pCookieFlag) {
      var obj, dropDownBar, sortingName, className, defaultText, defaultVal, tempContainer;
      tempContainer = new Element('div', {
        'id': 'containerTempServiceAd' + pcount,
        'class': 'serviceAdContainerDiv'
      });
      JsEnabledLocalStoreDropDown.populateSelectBox(poptVal, pcount, pdivobj, tempContainer, pCookieFlag);
    },
    JsEnabledLocalStoreDropDown.scrollVertical = function(value, element, slider) {
      element.scrollTop = Math.round(value / slider.maximum * (element.scrollHeight - element.offsetHeight));
    },
    JsEnabledLocalStoreDropDown.populateSelectBox = function(poptVal, pcount, pdivobj, tempContainer, pCookieFlag) {
      var defaultVal, defaultText, item, subContainer, dropDownTemp, onclickFunc, handle, track, tempInnerContainer;
      tempInnerContainer = new Element('div', {
        'class': 'serviceAdContainerInnerDiv'
      });
      poptVal.each(function(link) {
        if (link.text === defaultStoreText) {
          defaultVal = defaultStoreVal;
          defaultText = defaultStoreText;
        }
        if (pCookieFlag) {
          if (link.value !== 'choose') {
            item = new Element('div', {
              'class': 'items'
            });
            item.onclick = function() {
              com.ikea.irw.catalog.JsEnabledLocalStoreDropDown.selectStoreFromList(link.value, (link.text).replace(',', '#'), '"containerTempServiceAd' + pcount + '"', pcount);
            };
            item.update(link.text);
            tempInnerContainer.insert(item);
          }
        } else {
          item = new Element('div', {
            'class': 'items'
          });
          item.onclick = function() {
            com.ikea.irw.catalog.JsEnabledLocalStoreDropDown.selectStoreFromList(link.value, (link.text).replace(',', '#'), '"containerTempServiceAd' + pcount + '"', pcount);
          };
          item.update(link.text);
          tempInnerContainer.insert(item);
        }
      });
      tempContainer.insert(tempInnerContainer);
      handle = new Element('div', {
        'id': 'containerTempscrollerHandle' + pcount,
        'class': 'serviceAdscrollerHandle'
      });
      track = new Element('div', {
        'id': 'containerTempscrollerTrack' + pcount,
        'class': 'serviceAdscrollertrack'
      });
      track.insert(handle);
      tempContainer.insert(track);

      dropDownTemp = '<div id="localStoreServiceAd' + pcount + '" class="productsFilterSortBy" style="width:230px;display:block;border:1 px solid black">' +
        '<div class="sortLeft floatLeft"></div>' +
        '<div class="sortMiddle floatLeft">' + defaultText +
        '<input type="hidden" id="localStoreServiceAdval" value="' + defaultVal + '"/>' +
        '</div>' +
        '<div class="sortRight floatLeft"></div>' +
        '</div>';

      pdivobj.update(dropDownTemp);
      bindMouseEventForStoreSelect(pdivobj, pcount);
      subContainer = new Element('div', {
        'class': 'subContainerServiceAd',
        'id': 'subContainerServiceAd' + pcount
      });
      subContainer.update(tempContainer);
      subContainer.setStyle({
        display: 'none'
      });
      $(document.body).insert({
        top: subContainer
      });
      if (defaultVal !== 'choose') {
        Event.observe($$('.serviceAdddropDownButton .blueBtn')[pcount], "click", function() {
          javascript: com.ikea.irw.catalog.JsEnabledLocalStoreDropDown.submitToLocalStorePage(defaultVal);
        });
      }
    },
    JsEnabledLocalStoreDropDown.selectStoreFromList = function(val, text, id, pcount) {
      defaultStoreText = text.replace('#', ',');
      defaultStoreVal = val;
      var containerId = '#localStoreServiceAd' + pcount + ' .sortMiddle';
      var selectedText = $$(containerId)[0].innerHTML;
      var selectedValue = $('localStoreServiceAdval').value;
      $('localStoreServiceAdval').value = defaultStoreVal;
      var innerHTMLToSet = defaultStoreText + '<input type="hidden" id="localStoreServiceAdval" value="' + defaultStoreVal + '"/>';
      $$(containerId)[0].update(innerHTMLToSet);

      if (val !== 'choose') {
        ($$('.serviceAdddropDownButton .blueBtn')[pcount]).stopObserving('click');
        Event.observe($$('.serviceAdddropDownButton .blueBtn')[pcount], "click", function() {
          javascript: com.ikea.irw.catalog.JsEnabledLocalStoreDropDown.submitToLocalStorePage(val);
          // START: 5.18, IKEA00743856, atgar1
          irwstatSetTrailingTag("IRWStats.sitenavigation", "store listing");
          // END: 5.18, IKEA00743856, atgar1
        });
      } else {
        $$('.serviceAdddropDownButton .blueBtn')[pcount].href = "";
      }
      $('subContainerServiceAd' + pcount).setStyle({
        display: 'none'
      });

    },
    JsEnabledLocalStoreDropDown.submitToLocalStorePage = function(localStoreUrl) {
      var currentStoreName = localStoreUrl.substring(localStoreUrl.lastIndexOf("/") + 1);
      var currentStoreId = JsEnabledLocalStoreDropDown.getLocalStoreName(currentStoreName);
      setCookie('selected_store_num_' + languageCode + '_' + countryCode.toUpperCase(), currentStoreId, null, '/');
      setCookie('selected_store_' + languageCode + '_' + countryCode.toUpperCase(), currentStoreName, null, '/');
      window.location = localStoreUrl;
    },
    JsEnabledLocalStoreDropDown.clickOnDom = function(pcount) {
      Event.observe(document, "click", function() {
        if (hideDropDown.apply(this, arguments)) {
          $('subContainerServiceAd' + pcount).setStyle({
            display: 'none'
          });
        }
      });
    },
    JsEnabledLocalStoreDropDown.getLocalStoreName = function(storeIdSelected) {
      var localStoreForm = $('localStoreFormId');
      var localStores = "";
      localStores = localStoreForm.localStoreList.value;
      var storeArray = localStores.split(':');
      var storeArrayLen = storeArray.length;
      if (!isNaN(storeIdSelected)) {
        var localStoreName;
        for (var i = 0; i < storeArrayLen; i++) {
          if (storeArray[i].indexOf(storeIdSelected + "|") !== -1) {
            localStoreName = storeArray[i].substring(storeArray[i].indexOf('|') + 1);
            break;
          }
        }
        return localStoreName;
      } else {
        var localStoreId;
        for (var j = 0; j < storeArrayLen; j++) {
          if (storeArray[j].lastIndexOf("|" + storeIdSelected) !== -1) {
            localStoreId = storeArray[j].replace(/\D/g, "");
            break;
          }
        }
        return localStoreId;
      }
    };

  return JsEnabledLocalStoreDropDown;
}());
//Name space end for service dropDown
$namespace('com.ikea.irw.landing');
com.ikea.irw.landing.toolTip = (function() {
  var toolTip = {};
  /**
   * Public Function .
   **/
  toolTip.eventBinding = function() {
    $$("map.toolTipMapName area").each(function(link) {
      var partNo, type, attr = $(link).readAttribute('tooltiptype');
      if (attr !== null) {
        partNo = attr.substring(attr.indexOf("/") + 1);
        type = attr.substring(0, attr.indexOf("/"));
        toolTip.init(link, type, partNo);
      }
    });
  };
  toolTip.init = function(link, type, partNo) {
    switch (type) {
      case "tooltip_customtext":
        toolTip.custom(link, partNo);
        break;
      case "tooltip_micropip":
        toolTip.light(link, partNo);
        break;
      case "tooltip_bigprice":
        toolTip.bigPrice(link, partNo);
        break;
      default:
    }
  };
  toolTip.custom = function(link, partNo) {
    var customText = $(link).readAttribute('alt');
    new Tooltip(link, {
      maxWidth: '639',
      hideDuration: 1,
      flashHtml: 'true',
      content: "<div id='hotAreaToolTip'>" + customText + "</div>"
    });
  };
  toolTip.light = function(link, partNo) {
    if ($('toolTipLightPrice_' + partNo)) {
      $(link).setAttribute('alt', '');
      var lightPriceText = $('toolTipLightPrice_' + partNo).innerHTML;
      new Tooltip(link, {
        maxWidth: '639',
        hideDuration: 1,
        flashHtml: 'true',
        content: "<div id='hotAreaToolTip'>" + lightPriceText + "</div>"
      });
    }
  };
  toolTip.bigPrice = function(link, partNo) {
    if ($('toolTipBigPrice_' + partNo)) {
      $(link).setAttribute('alt', '');
      var bigPriceText = $('toolTipBigPrice_' + partNo).innerHTML + $('toolTipBigPriceWee_' + partNo).innerHTML;
      new Tooltip(link, {
        maxWidth: '639',
        hideDuration: 1,
        flashHtml: 'true',
        content: "<div class='product' id='hotAreaToolTip'>" + bigPriceText + "</div>"
      });
    }
  };
  return toolTip;
}());

com.ikea.irw.catalog.ChoicePage = (function() {
  var currID, choiceHash = new Hash(),
    choicePage = {},
    nextId, prevId, curSection, lastActiveId, curRow, curContainer = 1,
    count = 1,
    imgLastPos = 0;

  function keyEvent() {
    document.onkeydown = function(evt) {
      var evt = evt || window.event;
      if ($('jsContainer')) {
        switch (evt.keyCode) {
          case 39:
            choicePage.createMainImgContainer(nextId);
            break;
          case 37:
            choicePage.createMainImgContainer(prevId);
            break;
        }
      }
    };
  }

  function scrollToMainImgContainer() {
    if ($('mainImgContainer') !== null) {
      Effect.ScrollTo('mainImgContainer', {
        offset: -30
      });
      var url = document.URL.replace(/\/$/, "");
      lastActiveId = url.substring(url.lastIndexOf("/") + 1);
    }
  }

  function createArray(childEl) {
    var arrayItem = [];
    arrayItem.clear();
    childEl.find(function(el) {
      if (el.hasClassName('item')) {
        var section = el.down(),
          urlLink;
        if (section) {
          urlLink = section.href.substring(section.href.lastIndexOf("/") + 1).slice(1);
          section.href = "javascript:void(0);";
          if (urlLink.length > 2) {
            urlLink = urlLink.slice(6);
          }
          section.observe('click', function(evt) {
            Effect.ScrollTo(urlLink, {
              offset: -30
            });
          });
        }
      }
      if (el.hasClassName('choiceItem')) {
        var url = disableHrefLink(el);
        arrayItem.push(url);
        bindClikOnItems(el);
      }
    });
    return arrayItem;
  }

  function bindClikOnItems(el) {
    el.observe('mousedown', function(evt) {
      var id = el.up('a').id.split('_');
      choicePage.createMainImgContainer(id[1]);
    });
  }

  function disableHrefLink(link) {
    var anchorTag = link.up(),
      url = anchorTag.href,
      choiceId = url.split('/').last();
    anchorTag.href = "javascript:void(0);";
    return choiceId;
  }

  function getSectionArray(id) {
    var arr = id.split(/(?=[A-Z])/);
    curSection = arr[0].replace(/[A-Z]/g, '');
    curRow = arr[1].replace(/[A-Z]/g, '');
    var hashIndex = "choiceGallery" + curSection;
    prodArr = choiceHash.get(hashIndex);
  }

  function removeMainImage(id) {
    $('testContainer').remove();
    choicePage.createMainImgContainer(id);
  }

  function setNextAndPrev(prodArr, id) {
    var index = prodArr.indexOf(id),
      arrLength = prodArr.length - 1;
    nextId = prodArr[index + 1];
    prevId = prodArr[index - 1];
    if (typeof prevId === 'undefined') {
      prevId = prodArr[arrLength];
      imgLastPos = 1;
    }
    if (typeof nextId === 'undefined') {
      nextId = prodArr[0];
      imgLastPos = -1;
    }
  }

  function bindClickOnArrow() {
    var nextObj = $('mainImgContainer').down('.nextArrow'),
      prevObj = $('mainImgContainer').down('.prevArrow');
    nextObj.href = "javascript:void(0);";
    prevObj.href = "javascript:void(0);";
    nextObj.observe('mousedown', function(evt) {
      choicePage.createMainImgContainer(nextId);
    });
    prevObj.observe('mousedown', function(evt) {
      choicePage.createMainImgContainer(prevId);
    });
  }

  function bindClickOnArrow1() {
    var nextObj = $('mainImgContainer').down('.nextArrow'),
      prevObj = $('mainImgContainer').down('.prevArrow');
    nextObj.href = "javascript:void(0);";
    prevObj.href = "javascript:void(0);";
    getSectionArray(lastActiveId);
    setNextAndPrev(prodArr, lastActiveId);
    nextObj.observe('mousedown', function(evt) {
      choicePage.createMainImgContainer(nextId);
    });
    prevObj.observe('mousedown', function(evt) {
      choicePage.createMainImgContainer(prevId);
    });
  }

  function bindClickonSave() {
    if ($('btnChoiceList')) {
      var url = $('btnMainLink').href;
      var params = url.split("?")[1].split("&");
      var storeId = params[0].split("=")[1];
      var langId = params[1].split("=")[1];
      $('btnMainLink').href = "javascript:void(0);";
      $('btnMainLink').observe('mousedown', function(evt) {
        createSaveToListPopup();
        activateShopListPopup("addAll", $('btnChoiceList').down(), storeId, langId, "");
      });
    }
    if ($('buyOnlineProduct')) {
      $('buyOnlineProduct').style.display = 'block';
      $('buyOnlineBtnLnk').href = "javascript:void(0);";
      $('buyOnlineBtnLnk').observe('mousedown', function(evt) {
        com.ikea.iows.shoppingbag.addToCart.init();
      });
    }
  }

  function createSaveToListPopup() {
    var imgLoader = '<img src="/ms/img/loading.gif" id="iconLoad">';
    var poupStr = '<div id="slPopup" class="slPopup choicePage shadow-one" style="width:260px;"><div class="corner-a"></div><div class="corner-b"></div><div class="shadow-two"><div class="shadow-three"><div class="shadow-four">' + imgLoader + '</div></div></div></div>';
    $(document.body).insert({
      top: poupStr
    });
    var elPosition = $('btnChoiceList').cumulativeOffset();
    var leftVal = (elPosition.left + ($('btnChoiceList').getWidth() - 260));
    $('slPopup').setStyle({
      left: (leftVal - 10) + "px",
      top: (elPosition.top - 4) + "px"
    });
  }

  function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
      do {
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return curtop;
    }
  }
  choicePage.init = function() {
    var secIndex, i = 1;
    keyEvent();
    scrollToMainImgContainer();
    bindClickonSave();
    $$(".choiceContainer .choiceGallery").each(function(choiceGallery) {
      var childEl = choiceGallery.descendants(),
        arr = createArray(childEl);
      secIndex = "choiceGallery" + i;
      i += 1;
      choiceHash.set(secIndex, arr);

      if ($('jsContainer') !== null) {
        bindClickOnArrow1();
      }
    });
    if ($('btnChoiceList')) {
      $('btnChoiceList').setStyle({
        'display': 'block'
      });
    }
    if ($('buyOnlineProduct')) {
      $('buyOnlineProduct').setStyle({
        'display': 'block'
      });
    }
  };
  choicePage.createMainImgContainer = function(id) {
    var itemId = "imgId_" + id;
    if (lastActiveId) {
      $("imgId_" + lastActiveId).down('img').removeClassName('activeImgStyle');
    }
    $(itemId).down('img').addClassName('activeImgStyle');
    getSectionArray(id);
    setNextAndPrev(prodArr, id);
    if ($('jsContainer') === null) {
      var mainImgContainer_1 = new Element('div', {
        'id': 'outerContainer_' + curContainer,
        'class': 'outerContainer',
        'style': 'height:490px'
      });
      choicePage.requestForMainImage(id);
      $(itemId).up('ul').up().insert({
        top: mainImgContainer_1
      });
      mainImgContainer_1.insert(new Element('div', {
        'id': 'jsContainer',
        'class': 'jsContainer'
      }));
      $('outerContainer_' + curContainer).show();
    } else {
      var arrC, secC, rowC, arrP, secP, rowP;
      arrC = id.split(/(?=[A-Z])/);
      secC = arrC[0].replace(/[A-Z]/g, '');
      rowC = arrC[1].replace(/[A-Z]/g, '');
      arrP = lastActiveId.split(/(?=[A-Z])/);
      secP = arrP[0].replace(/[A-Z]/g, '');
      rowP = arrP[1].replace(/[A-Z]/g, '');
      if (secC !== secP || rowC !== rowP) {
        if ($('outerContainer_1')) {
          curContainer = 1;
          count = 2;
        } else if ($('outerContainer_2')) {
          curContainer = 2;
          count = 1;
        }

        $('mainImgContainer').fade({
          duration: 1,
          afterFinish: function() {
            Effect.SlideUp('outerContainer_' + curContainer, {
              duration: 0.5,
              afterFinish: function() {
                choicePage.requestForMainImage(id);
                $('outerContainer_' + curContainer).remove();
                setTimeout(function() {
                  $('outerContainer_' + count).show();
                }, 1000 * 10);
              }.bind(this)
            });
          }
        });
        var mainImgContainer = new Element('div', {
          'id': 'outerContainer_' + count,
          'class': 'outerContainer',
          'style': 'height:490px'
        });
        mainImgContainer.insert(new Element('div', {
          'id': 'jsContainer',
          'class': 'jsContainer'
        }));
        $(itemId).up('ul').up().insert({
          top: mainImgContainer
        });
      } else {
        choicePage.requestForMainImage(id);
      }
    }
    lastActiveId = id;
  };
  choicePage.requestForMainImage = function(id) {
    var roomId = id,
      requestUrl, baseURL;
    baseURL = window.location.href;
    requestUrl = baseURL.substring(0, baseURL.indexOf('/choice/')) + '/choice/' + roomId;
    new Ajax.Request(requestUrl, {
      method: 'get',
      cache: false,
      contentType: 'application/xml',
      onSuccess: function(response) {
        choicePage.parseResponse(response.responseText);
      },
      onComplete: function() {
        var metaTags = $A($$('meta'));
        for (var m = 0; m < metaTags.length; m++) {
          if (metaTags[m].getAttribute("property") === "og:url") {
            metaTags[m].setAttribute("content", requestUrl);
          }
        }
        com.ikea.irw.share.Util.init();
        com.ikea.irw.landing.toolTip.eventBinding();
        setTimeout(function() {
          var height = $('mainImgContainer').getHeight();
          $('jsContainer').setStyle({
            height: height + 'px'
          });
        }, 1000 * 2);
      }
    });
  };
  choicePage.parseResponse = function(response) {
    var returnContent, tempDiv, closeButton, curDiv, SupportDiv;
    returnContent = response;
    tempDiv = new Element('div', {
      'id': 'alphaLayer'
    });
    tempDiv.innerHTML = response;
    returnContent = tempDiv.getElementsBySelector('div #mainImgContainer')[0];
    $('jsContainer').update(returnContent);
    closeButton = $('jsContainer').down('.closeButton');
    closeButton.href = "javascript:void(0);";
    closeButton.observe('mousedown', function(evt) {
      if ($('outerContainer_1')) {
        curDiv = 1;
      } else if ($('outerContainer_2')) {
        curDiv = 2;
      }
      $('mainImgContainer').down('.imgShadow').fade({
        duration: 2.0,
        afterFinish: function() {
          Effect.SlideUp('outerContainer_' + curDiv, {
            duration: 1.0,
            afterFinish: function() {
              $('outerContainer_' + curDiv).remove();
            }
          });
        }
      });
      $("imgId_" + lastActiveId).down('img').removeClassName('activeImgStyle');
      lastActiveId = null;
    });
    bindClickOnArrow();
    if ($('outerContainer_1')) {
      curContainer = 1;

    } else if ($('outerContainer_2')) {
      curContainer = 2;

    }
    SupportDiv = document.getElementById('outerContainer_' + curContainer);
    if (imgLastPos == 1) {
      window.scrollTo(0, findPos(SupportDiv));
      imgLastPos = 0;
    } else if (imgLastPos == -1) {
      window.scrollTo(0, findPos(SupportDiv));
      imgLastPos = 0;
    }
    bindClickonSave();
    // START: 5.18, IKEA00743856, atgar1
    vendor.updateProp44Value("toolTipMapName", "choice", false);
    // END: 5.18, IKEA00743856, atgar1
    // START: 5.18, IKEA00743856, fetho
    vendor.updateChoicePageName($('mainImgContainer').down('.imgShadow').src);
    // END: 5.18, IKEA00743856, fetho
  };
  return choicePage;
}());

document.observe('dom:loaded', function() {
  com.ikea.irw.catalog.ChoicePage.init();
});






/**
 * $namespace('com.ikea.irw.shoppinglist') - Name Space for add to cart and save to list form teh new category page.
 * jslint browser: $namespace, com, $, $$, activateShopListPopup, Element, setTimeout, clearTimeout
 **/
$namespace('com.ikea.irw.shoppinglist');
com.ikea.irw.shoppinglist.SaveToList = (function() {
  var publicFunctions = {};
  var prevHeight, poupHeight, delayToHideLayer;
  publicFunctions.baseHeight;
  publicFunctions.landingPage = false;
  /**
   * Function to identify the button that invoke by the user - Save tolist or add to cart.
   **/
  function checkAction(id) {
    var action, checkVar;
    checkVar = id.slice(0, 10);
    checkVar === 'popupAddTo' ? action = 'addToCart' : action = 'add';
    return action;
  }
  /**
   * Function to update the loading icon in the popup.
   **/
  function loadingIcon() {
    var loadIcon = '<img id=\"iconLoad\" src=\"/ms/img/loading.gif\" />';
    return loadIcon;
  }
  /**
   * Function to align the loading icon in the popup.
   **/
  function alignIcon(dimensions) {
    var marginLft, marginRgt;
    marginLft = (dimensions.height / 2) + 'px';
    marginRgt = ((dimensions.width / 2) - 16) + 'px';
    $('iconLoad').setStyle({
      'marginTop': marginLft,
      'marginLeft': marginRgt
    });
  }
  /**
   * Public Function which will be invoked from the onlcick on save to list or add to cart button.
   **/
  publicFunctions.init = function(id) {
    var identify, metatags, metalength, storeId, languageId;
    identify = checkAction(id);
    metatags = document.getElementsByTagName("meta");
    metalength = metatags.length;
    for (var cnt = 0; cnt < metalength; cnt++) {
      if (metatags[cnt].getAttribute("name") === "languageid") {
        languageId = metatags[cnt].getAttribute("content");
      }
      if (metatags[cnt].getAttribute("name") === "store_id") {
        storeId = metatags[cnt].getAttribute("content");
      }
    }
    this.baseLayout();
    var price = $('prodInfoLanding').down('.price,.regularPrice').innerHTML.split('<')[0];
    price = price.replace(/\&nbsp;/g, "");
    activateShopListPopup(identify, $(id), storeId, languageId, price);
    publicFunctions.baseHeight = $('prodInfoLanding').getHeight();
  };
  /**
   * Public Function which will be invoked form the init function create the layout for display saveToList and addToCart.
   **/
  publicFunctions.baseLayout = function() {
    var moreInfo, dimensions, baseLayout;
    moreInfo = $('prodInfoLanding').down('.moreInfo');
    dimensions = moreInfo.getDimensions();
    if ($('baseLayout') !== null) {
      $('baseLayout').remove();
    }
    baseLayout = new Element('div', {
      'class': 'baseLayout',
      'id': 'baseLayout'
    }).update(loadingIcon());
    baseLayout.style.height = (dimensions.height + 13) + 'px';
    prevHeight = dimensions.height + 13;
    moreInfo.insert(baseLayout);
    alignIcon(dimensions);
  };
  /**
   * Public Function to remove the content after 3 seconds.
   **/
  publicFunctions.removeConfirmation = function() {
    delayToHideLayer = setTimeout(
      function() {
        if ($('baseLayout') !== null) {
          $('baseLayout').fade();
          $('landingPopup').morph('height:' + (publicFunctions.baseHeight - 34) + 'px', {
            duration: 0.4
          });
        }
      },
      4000
    );
  };
  /**
   * Public Function to remove the error message.
   **/
  publicFunctions.removeErrorMessage = function() {

    if ($('baseLayout') !== null) {
      $('baseLayout').fade();
    }
    $('landingPopup').setStyle({
      'height': 'auto'
    });
  };
  /**
   * Public Function to clear the timer if user moves out before remove the confirmation using the timer.
   **/
  publicFunctions.clearTimer = function() {
    clearTimeout(delayToHideLayer);
  };
  /**
   * Public Function to set the content inside the layout.
   * Content will be generated by the existing shopping list functions.
   **/
  publicFunctions.setContent = function(content, action, type) {
    var newContent, dimensions, curHeight, diffHeight, margin, contentHolder;
    if ($('iconLoad') !== null) {
      $('iconLoad').remove();
    }
    $('baseLayout').innerHTML = "";
    $('baseLayout').insert(content);
    if (type == "addToShoppingList") {
      $('baseLayout').addClassName('saveToListContent');
    }
    if (action === 'remove') {
      $('shoppingListClose').remove();
    }
    newContent = $('baseLayout').down();
    dimensions = newContent.getDimensions();
    curHeight = dimensions.height;
    poupHeight = $('prodInfoLanding').getHeight();
    if (curHeight > prevHeight) {
      diffHeight = curHeight - prevHeight;
      $('landingPopup').morph('height:' + ((poupHeight + diffHeight) - 34) + 'px;', {
        duration: 0.2
      });
      $('baseLayout').morph('height:' + (dimensions.height) + 'px', {
        duration: 0.2
      });
    } else {
      diffHeight = prevHeight - curHeight;
      margin = diffHeight / 2;
      if (typeof $('baseLayout').down('.contentDialogue') !== 'undefined') {
        contentHolder = $('baseLayout').down('.contentDialogue');
      } else {
        contentHolder = $('baseLayout').down('.content');
      }
      contentHolder.style.marginTop = margin + 'px';
    }
    if (action === 'remove') {
      publicFunctions.removeConfirmation();
    } else {
      prevHeight = curHeight;
    }
  };
  return publicFunctions;
}());
/**
 * Name Space - com.ikea.irw.roomsettings - Name space using for roomsettings page
 * jslint browser: $, $$, document, $namespace, com, jsonPartNumbers, PresentationLayer, Pintip, Template, Event, Element, window, baseUrl, irwstatSetTrailingTag, defaultSortVal, roompage
 **/




$namespace('com.ikea.irw.roomsettings');
com.ikea.irw.roomsettings.roompage = (function() {
  var roompage = {};
  /**
   * init function will be invoked from the dom:loaded event.
   **/
  roompage.init = function() {
    roompage.showHideonJs();
    roompage.onpageload();
  };

  roompage.onpageload = function() {
    var nextLinkPosition = 0,
      previousLinkPosition = 0,
      nextLink, nextLinkHrefVal, nextLinkTitle, nextLinkHref, nextLinkimg, previousLink, previousLinkHrefVal, previousLinkTitle, previousLinkHref, previousLinkimg;
    if ($('roomSettingLeftArrow') !== null && typeof($('roomSettingLeftArrow')) !== 'undefined') {
      $('roomSettingLeftArrow').remove();
    }
    if ($('roomSettingRightArrow') !== null && typeof($('roomSettingRightArrow')) !== 'undefined') {
      $('roomSettingRightArrow').remove();
    }
    if ($('allContent') !== null && typeof($('allContent')) !== "undefined" && $('allContent').offsetLeft > 57) {
      previousLinkPosition = "left:" + ($('allContent').offsetLeft - 53) + "px";
      nextLinkPosition = "left:" + ($('allContent').offsetLeft + 1078) + "px";
    }
    if ($$('.jsroomnextlink .nonjsroomnextlinkhref')[0] !== null && typeof($$('.jsroomnextlink .nonjsroomnextlinkhref')[0]) !== "undefined") {
      if (nextLinkPosition !== 0) {
        nextLink = new Element('div', {
          'class': 'roomsettingnavigatingarrow',
          'id': 'roomSettingRightArrow',
          'style': nextLinkPosition
        });
      } else {
        nextLink = new Element('div', {
          'class': 'roomsettingnavigatingarrow',
          'id': 'roomSettingRightArrow',
          'style': 'left:93%;z-index:100px'
        });
      }
      nextLinkHrefVal = $$('.jsroomnextlink .nonjsroomnextlinkhref')[0].getAttribute('href');
      nextLinkTitle = $$('.jsroomnextlink .nonjsroomnextlinkhref')[0].getAttribute('title');
      nextLinkHref = new Element('a', {
        'href': nextLinkHrefVal,
        'title': nextLinkTitle
      });
      nextLinkimg = new Element('img', {
        'src': '/ms/img/RoomsettingsArrows/_0002_Hover---right.png',
        'title': nextLinkTitle
      });
      nextLinkHref.appendChild(nextLinkimg);
      nextLink.appendChild(nextLinkHref);
      if ($$('.jsroomnextlink')[0] !== null && typeof($$('.jsroomnextlink')[0]) !== "undefined") {
        $$('.jsroomnextlink')[0].appendChild(nextLink);
      }

    } else {
      if (nextLinkPosition !== 0) {
        nextLink = new Element('div', {
          'class': 'roomsettingnavigatingarrowinactive',
          'id': 'roomSettingRightArrow',
          'style': nextLinkPosition
        });
      } else {
        nextLink = new Element('div', {
          'class': 'roomsettingnavigatingarrowinactive',
          'id': 'roomSettingRightArrow',
          'style': 'left:93%;z-index:100px'
        });
      }
      nextLinkimg = new Element('img', {
        'src': '/ms/img/RoomsettingsArrows/_0000_Inactive---right.png'
      });
      nextLink.appendChild(nextLinkimg);
      if ($$('.jsroomnextlink')[0] !== null && typeof($$('.jsroomnextlink')[0]) !== "undefined") {
        $$('.jsroomnextlink')[0].appendChild(nextLink);

      }

    }
    if ($$('.jsroompreviouslink .nonjsroompreviouslinkhref')[0] !== null && typeof($$('.jsroompreviouslink .nonjsroompreviouslinkhref')[0]) !== "undefined") {
      if (previousLinkPosition !== 0) {
        previousLink = new Element('div', {
          'class': 'roomsettingnavigatingarrow',
          'id': 'roomSettingLeftArrow',
          'style': previousLinkPosition
        });
      } else {
        previousLink = new Element('div', {
          'class': 'roomsettingnavigatingarrow',
          'id': 'roomSettingLeftArrow',
          'style': 'right:93%;z-index:100px'
        });
      }
      previousLinkHrefVal = $$('.jsroompreviouslink .nonjsroompreviouslinkhref')[0].getAttribute('href');
      previousLinkTitle = $$('.jsroompreviouslink .nonjsroompreviouslinkhref')[0].getAttribute('title');
      previousLinkHref = new Element('a', {
        'href': previousLinkHrefVal,
        'title': previousLinkTitle
      });
      previousLinkimg = new Element('img', {
        'src': '/ms/img/RoomsettingsArrows/_0006_Hover---left.png',
        'title': previousLinkTitle
      });
      previousLinkHref.appendChild(previousLinkimg);
      previousLink.appendChild(previousLinkHref);
      if ($$('.jsroompreviouslink')[0] !== null && typeof($$('.jsroompreviouslink')[0]) !== "undefined") {
        $$('.jsroompreviouslink')[0].appendChild(previousLink);
      }
    } else {
      if (previousLinkPosition !== 0) {
        previousLink = new Element('div', {
          'class': 'roomsettingnavigatingarrowinactive',
          'id': 'roomSettingLeftArrow',
          'style': previousLinkPosition
        });
      } else {
        previousLink = new Element('div', {
          'class': 'roomsettingnavigatingarrowinactive',
          'id': 'roomSettingLeftArrow',
          'style': 'right:93%;z-index:100px'
        });
      }
      previousLinkimg = new Element('img', {
        'src': '/ms/img/RoomsettingsArrows/_0004_Inactive---left.png'
      });
      previousLink.appendChild(previousLinkimg);

      if ($$('.jsroompreviouslink')[0] !== null && typeof($$('.jsroompreviouslink')[0]) !== "undefined") {
        $$('.jsroompreviouslink')[0].appendChild(previousLink);

      }
    }
  };
  roompage.showHideonJs = function() {
    if ($$('.roomsettingdetailsjsdisabled')[0] !== null && typeof($$('.roomsettingdetailsjsdisabled')[0]) !== "undefined") {
      $$('.roomsettingdetailsjsdisabled')[0].hide();
    }
    if ($('roomsettingdetailsjsenabledDiv') !== null && typeof($('roomsettingdetailsjsenabledDiv')) !== "undefined") {
      $('roomsettingdetailsjsenabledDiv').show();
    }
  }
  roompage.expandPriceDetails = function() {
    $('roomfloorplanexpandeddivId').hide();
    if ($$('.roomsettingdetailsjsenabled .roompriceexpandeddiv')[0].style.display !== 'block' && $$('.roomsettingdetailsjsenabled .roompriceexpandeddiv')[0].style.display !== '') {
      Effect.SlideDown('roompriceexpandeddivId');
    } else {
      roompage.hidePriceDetails();
    }

  };
  roompage.expandfloorplanDetails = function() {
    $('roompriceexpandeddivId').hide();
    if ($$('.roomsettingdetailsjsenabled .roomfloorplanexpandeddiv')[0].style.display !== 'block' && $$('.roomsettingdetailsjsenabled .roomfloorplanexpandeddiv')[0].style.display !== '') {
      $$("#roomfloorplanexpandeddivId img").each(function(elem) {
        // alert(elem.src);
      });
      Effect.SlideDown('roomfloorplanexpandeddivId');
    } else {
      roompage.hidefloorplanDetails();
    }

  };
  roompage.hidefloorplanDetails = function() {
    Effect.SlideUp('roomfloorplanexpandeddivId');
  };
  roompage.hidePriceDetails = function() {

    Effect.SlideUp('roompriceexpandeddivId');
  };
  roompage.togglePriceDetails = function() {
    $('roomfloorplanexpandeddivId').hide();
    $('roompriceexpandeddivId').show();

  };
  roompage.togglefloorplanDetails = function() {
    $('roompriceexpandeddivId').hide();
    $('roomfloorplanexpandeddivId').show();

  };
  roompage.movestoproductpart = function() {
    Effect.ScrollTo('roomsetproductsComponentId');
  };
  return roompage;
}());

document.observe('dom:loaded', function() {
  com.ikea.irw.roomsettings.roompage.init();
  if ($('roomsetMainContent') !== null && typeof($('roomsetMainContent')) !== 'undefined') {
    window.onresize = function() {
      if ($('roomSettingLeftArrow') !== null && typeof($('roomSettingLeftArrow')) !== 'undefined') {
        $('roomSettingLeftArrow').remove();
      }
      if ($('roomSettingRightArrow') !== null && typeof($('roomSettingRightArrow')) !== 'undefined') {
        $('roomSettingRightArrow').remove();
      }
      com.ikea.irw.roomsettings.roompage.onpageload();
    };
  }
});
$namespace('com.ikea.irw.landing');
com.ikea.irw.landing.readMore = (function() {
  var readMore = {},
    urlForLocale, readLessText, hideText;
  /**
   * Public Function .
   **/
  readMore.eventBinding = function() {
    $$(".readmoreAnchorTag").each(function(link) {
      readMore.init(link.id);
    });
  };
  readMore.localeTransfer = function(arg, mode) {
    if (mode === "hidden") {
      hideText = arg;
    } else if (mode === "short") {
      readLessText = arg;
    }
  };
  readMore.init = function(arg) {
    var readMoreopton = arg.substring(0, arg.indexOf("_"));
    switch (readMoreopton) {
      case "short":
        readMore.shortMessage(arg);
        break;
      case "lightbox":
        readMore.mediumMessage(arg);
        break;
      case "page":
        readMore.longMessage(arg);
        break;
      case "hidden":
        readMore.hiddenMessage(arg);
        break;
      default:
    }
  };
  readMore.shortMessage = function(arg) {
    var shortSpan = "shortSpan" + arg.substring(arg.indexOf("_")),
      shortLess = "shortLess" + arg.substring(arg.indexOf("_")),
      component, componentHeight, heightArray = 0,
      heightImg = 0,
      heightComponent;
    if (!$(shortSpan)) {
      return;
    }
    $(shortSpan).innerHTML = $(shortSpan).innerHTML + '<a href = "javascript:void(0)" id = "' + shortLess + '" style = "display:none">' + readLessText + '</a>';
    $(shortSpan).setStyle({
      display: 'none'
    });
    component = arg.substring((arg.indexOf("_") + 1), arg.lastIndexOf("_"));
    componentHeight = $(component).getHeight();
    $(arg).setStyle({
      display: 'block'
    });
    $$("#" + component + " div.gridComponent div").each(function(divTag, index) {
      if (divTag.getHeight() > heightArray) {
        heightArray = divTag.getHeight();
      }
    });
    $$("#" + component + " div.gridComponent img").each(function(divTag, index) {
      if (divTag.getHeight() > heightImg) {
        heightImg = divTag.getHeight();
      }
    });
    heightComponent = (heightImg > heightArray) ? heightImg : heightArray;
    $(component).style.height = heightComponent + 'px';
    Event.observe(arg, "click", function() {
      $(arg).setStyle({
        display: 'none'
      });
      $(shortSpan).setStyle({
        display: 'inline'
      });
      Effect.SlideDown(shortSpan, {
        duration: 1,
        afterSetup: function() {
          $(shortLess).setStyle({
            display: 'block'
          });
        }
      });
      $(component).style.height = componentHeight + 'px';
    });
    Event.observe(shortLess, "click", function() {
      $(shortLess).setStyle({
        display: 'none'
      });
      Effect.SlideUp(shortSpan, {
        duration: 0.1,
        afterSetup: function() {
          $(arg).setStyle({
            display: 'block'
          });
          $(component).style.height = heightComponent + 'px';
        }
      });
    });
  };
  readMore.mediumMessage = function(arg) {
    var loadingImg, url, ajaxParams, liteBox, gridId = $(arg).href.substring($(arg).href.lastIndexOf("/") + 1);
    $(arg).href = "javascript:void(0);";
    $(arg).target = "";
    $(arg).setStyle({
      display: 'block'
    });
    readMore.getReadMoreLocale();
    Event.observe(arg, "click", function() {
      if (!Prototype.Browser.IE) {
        document.body.style.overflowY = 'hidden';
      } else {
        document.documentElement.style.overflowY = 'hidden';
      }
      url = urlForLocale + "readmore/" + gridId + "/";
      ajaxParams = {
        "url": url,
        "contentType": 'application/xml',
        "asyncFlag": true,
        "singletonFlag": false
      };
      loadingImg = '<img src="/ms/img/loading.gif" class="localPriceLoader" >';
      liteBox = new Litebox({
        id: 'readMorDiv',
        newScroll: 'true',
        fullScreen: 'true',
        content: loadingImg
      });
      readMore.centerWindow('readMorDiv');
      $('lbCloseBtn').update('CLOSE');
      if (!Prototype.Browser.IE) {
        Event.observe('lbCloseBtn', "click", function() {
          document.body.style.overflowY = 'auto';
        });
      } else {
        Event.observe('lbCloseBtn', "click", function() {
          document.documentElement.style.overflowY = 'auto';
        });
      }
      new Ajax.Request(ajaxParams.url, {
        asynchronous: ajaxParams.asyncFlag,
        contentType: ajaxParams.contentType,
        method: 'get',
        onSuccess: function(response) {
          tempDiv = new Element('div', {
            'id': 'alphaLayer'
          });
          tempDiv.innerHTML = response.responseText;
          returnContent = tempDiv.getElementsBySelector('div #readMoreMainImgContainer')[0];
          $('lbContainer').update(returnContent);
        },
        onFailure: function() {},
        onComplete: function() {
          $('readMorDiv').down('.lbBorderFullScrn').style.height = (document.viewport.getHeight() - 200) + 'px';
          $('readMoreMainImgContainer').style.height = (document.viewport.getHeight() - 250) + 'px';
          $('track').style.height = (document.viewport.getHeight() - 200) + 'px';
          var slider = new Control.Slider('handle', 'track', {
            axis: 'vertical',
            onSlide: function(v) {
              readMore.scrollVertical(v, $('readMoreMainImgContainer'), slider);
            },
            onChange: function(v) {
              readMore.scrollVertical(v, $('readMoreMainImgContainer'), slider);
            }
          });
          $$("#readMorDiv .readmoreAnchorTag").each(function(link) {
            var arg = link.id;
            if (arg.substring(0, arg.indexOf("_")) === "lightbox") {
              $(arg).id = arg.replace("lightbox", "page");
              arg = arg.replace("lightbox", "page");
            }
            com.ikea.irw.landing.readMore.init(arg);
          });
        }
      });
    });
  };
  readMore.longMessage = function(arg) {
    var gridId = $(arg).href.substring($(arg).href.lastIndexOf("/") + 1),
      url;
    $(arg).setStyle({
      display: 'block'
    });
    $(arg).href = "javascript:void(0);";
    $(arg).target = "";
    readMore.getReadMoreLocale();
    url = urlForLocale + "readmore/" + gridId;
    Event.observe(arg, "click", function() {
      window.open(url, '_blank', 'location=yes,resizable=yes,menubar=yes,toolbar=yes,scrollbars=yes');
    });
  };
  readMore.hiddenMessage = function(arg) {
    var componentId = $(arg).href.substring($(arg).href.lastIndexOf("/") + 1);
    $(arg).setStyle({
      display: 'block'
    });
    $(arg).href = "javascript:void(0);";
    if (!$(componentId)) {
      return;
    }
    $(componentId).hide();
    $(componentId).innerHTML = $(componentId).innerHTML + '<div class="bottomView floatLeft"><div class="leftLine floatLeft"></div><div id="hideButton_' + arg + '" class="hide-btn">' + hideText + '</div><div class="rightLine floatRight"></div></div>';
    $$('#' + componentId + ' img').each(function(im) {
      $(im).fade({
        duration: 2
      });
    });
    Event.observe(arg, "click", function() {
      $(componentId).addClassName('hideBtnContent');
      $$('#' + componentId + ' img').each(function(im) {
        Effect.Appear(im, {
          duration: 2
        });
      });
      Effect.Appear(componentId, {
        duration: 2
      });
      $(arg).setStyle({
        display: 'none'
      });
    });
    Event.observe('hideButton_' + arg, "click", function() {
      $$('#' + componentId + ' img').each(function(im) {
        $(im).fade({
          duration: 2
        });
      });
      $(componentId).fade({
        duration: 2
      });
      $(arg).setStyle({
        display: 'block'
      });
    });
  };
  readMore.getReadMoreLocale = function() {
    var baseUrl = window.location.href;
    var url = baseUrl.substring(baseUrl.indexOf('//') + 2, baseUrl.length);
    urlForLocale = url.substring(url.indexOf('/'), url.length);
  };
  readMore.centerWindow = function(element) {
    var lftPos, topPos;
    lftPos = Math.round(document.viewport.getScrollOffsets().left + ((document.viewport.getWidth() - $(element).getWidth())) / 2);
    topPos = Math.round(document.viewport.getScrollOffsets().top + ((document.viewport.getHeight() - $(element).getHeight())) / 2);
    lftPos = lftPos + 9;
    topPos = topPos - 150;
    $(element).style.left = lftPos + 'px';
    $(element).style.top = topPos + 'px';
  };
  readMore.scrollVertical = function(value, element, slider) {
    element.scrollTop = Math.round(value / slider.maximum * (element.scrollHeight - element.offsetHeight));
    if (Prototype.Browser.IE) {
      var elementVal = element.innerHTML;
      element.update();
      element.update(elementVal);
    }
  };
  return readMore;
}());
$namespace('com.ikea.irw.homepage');
com.ikea.irw.homepage.carousel = Class.create();
com.ikea.irw.homepage.carousel.prototype = {
  initialize: function(components, mainContainer, options) {
    var optionsSize = 0,
      i = 0,
      j = 0,
      conatinerinnerdiv, conatinerinnerdiv2, innercontainer, arrayCount = 0,
      node, curtop, curtopscroll;
    this.components = components;
    this.mainContainer = mainContainer;
    this.options = Object.extend(options || {}, {
      totalSizes: components.length,
      currentSlide: 1,
      timeoutEvent: null,
      slide: true,
      speed: 5,
      containerHeights: 0,
      arrowHeight: 0,
      validContents: [],
      direction: 'NX',
      heightFromTop: 0,
      cancontinue: true
    });
    if (typeof(corousel_speed) !== "undefined" && corousel_speed !== null) {
      this.options.speed = corousel_speed;
    }
    innercontainer = new Element('div', {
      'id': 'innerContainer',
      'style': 'overflow:hidden;width:1060px;position:relative;'
    });
    this.container = innercontainer;
    this.mainContainer.insert({
      top: this.container
    });
    conatinerinnerdiv = new Element('div', {
      'id': 'innerCorrosilDiv',
      'style': 'position:relative;left:0px;'
    });
    conatinerinnerdiv2 = new Element('div', {
      'id': 'innerCorrosilDiv2',
      'style': 'display:none;position:relative;left:1070px;'
    });
    j = 0;
    for (i = 0; i < this.options.totalSizes; i = i + 1) {
      if (typeof(this.components[i].childElements()[0].childElements()[1]) !== 'undefined' && !this.components[i].childElements()[0].childElements()[0].hasClassName('gridRow')) {
        this.options.validContents[j] = this.components[i];
        j = j + 1;
      } else if (typeof(this.components[i].childElements()[0].childElements()[0]) !== 'undefined' && this.components[i].childElements()[0].childElements()[0].hasClassName('gridRow')) {
        this.options.validContents[j] = this.components[i];
        j = j + 1;
      }
    }
    this.options.totalSizes = this.options.validContents.length;

    if (typeof(this.options.validContents[0].childElements()[0].childElements()[1]) !== 'undefined' && !this.options.validContents[0].childElements()[0].childElements()[0].hasClassName('gridRow')) {
      if (this.container.innerHTML === "") {
        if (this.options.totalSizes > 1) {
          conatinerinnerdiv2.update(this.options.validContents[this.options.totalSizes - 1].childElements()[0].childElements()[1].innerHTML);
          conatinerinnerdiv.update(this.options.validContents[0].childElements()[0].childElements()[1].innerHTML);
          this.container.appendChild(conatinerinnerdiv2);
          this.container.appendChild(conatinerinnerdiv);
        } else {
          conatinerinnerdiv.update(this.options.validContents[0].childElements()[0].childElements()[1].innerHTML);
          this.container.appendChild(conatinerinnerdiv);
        }
      }

    } else if (typeof(this.options.validContents[0].childElements()[0].childElements()[0]) !== 'undefined' && this.options.validContents[0].childElements()[0].childElements()[0].hasClassName('gridRow')) {

      if (this.container.innerHTML === "") {

        if (this.options.totalSizes > 1) {
          conatinerinnerdiv2.update(this.options.validContents[this.options.totalSizes - 1].childElements()[0].innerHTML);
          conatinerinnerdiv.update(this.options.validContents[0].childElements()[0].innerHTML);
          this.container.appendChild(conatinerinnerdiv2);
          this.container.appendChild(conatinerinnerdiv);
        } else {
          conatinerinnerdiv.update(this.options.validContents[0].childElements()[0].innerHTML);
          this.container.appendChild(conatinerinnerdiv);
        }
      }

    }
    this.mainContainer.setStyle({
      'display': 'block'
    });
    this.options.validContents.each(function(obj) {
      if (obj.getHeight() > this.options.containerHeights) {
        this.options.containerHeights = obj.getHeight();
      }
    }.bind(this));
    this.container.setStyle({
      height: this.options.containerHeights + "px"
    });
    this.options.arrowHeight = (this.options.containerHeights / 2) - 27;
    node = this.mainContainer;
    curtop = 0;
    curtopscroll = 0;
    if (node.offsetParent) {
      do {
        curtop += node.offsetTop;
        curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
      } while (node = node.offsetParent);
      this.options.heightFromTop = curtop - curtopscroll;
    }
    $(this.components[0].parentNode.id).setStyle({
      'display': 'none'
    });
    if (this.options.totalSizes > 1) {
      this.insertArrow(this.options.totalSizes, 2);
      this.insertSlideBar();
      this.options.timeoutEvent = setTimeout(this.callOnintervals.bind(this), (this.options.speed * 1000));
      Event.observe(window, "resize", function(obj) {
        this.positionArrowOnResize();
      }.bind(this));
      if ($('corrosilNextArrowId') !== null) {
        Event.observe($('corrosilNextArrowId'), 'click', function() {
          com.ikea.irw.stat.General.setCorrosilAction();
        });
      }
      if ($('corrosilPreviousArrowId') !== null) {
        Event.observe($('corrosilPreviousArrowId'), 'click', function() {
          com.ikea.irw.stat.General.setCorrosilAction();
        });
      }
    } else {
      com.ikea.irw.landing.readMore.eventBinding();
      com.ikea.irw.landing.toolTip.eventBinding();
    }
  },
  animateSlide: function(conatinerinnerdiv, containertempdiv) {
    var time, containerHeight, amountToMove, newparrellelstyle;
    if (this.options.direction === 'NX') {
      amountToMove = -1070;
    } else {
      amountToMove = 1070;
    }
    if (this.options.slide) {
      time = this.options.speed / 4;
    } else {
      time = 2;
    }
    if (time > 2) {
      time = 2;
    } else if (time < 0.5) {
      time = 0.5;
    }
    if (!com.ikea.irw.helper.touchdevices.isTouchdevice()) {
      newparrellelstyle = new Effect.Parallel([
        new Effect.Move(conatinerinnerdiv, {
          sync: true,
          x: amountToMove,
          mode: 'relative'
        }),
        new Effect.Move(containertempdiv, {
          sync: true,
          x: amountToMove,
          mode: 'relative'
        })
      ], {
        duration: time,
        delay: 0,
        beforeStart: function() {
          this.options.cancontinue = false;
          containertempdiv.setStyle({
            display: 'block'
          });
          if (typeof($('SlideIndiacator')) !== 'undefined' && $('SlideIndiacator') !== null) {
            $('SlideIndiacator').setStyle({
              position: 'relative',
              top: '0px'
            });
          }
        }.bind(this),
        afterFinish: function() {
          this.options.cancontinue = true;
          conatinerinnerdiv.setStyle({
            left: '1070px',
            top: '0px',
            display: 'none'
          });
          containertempdiv.setStyle({
            left: '0px',
            top: '0px',
            display: 'block'
          });
          if (typeof($('SlideIndiacator')) !== 'undefined' && $('SlideIndiacator') !== null) {
            $('SlideIndiacator').setStyle({
              top: '0px'
            });
          }
          conatinerinnerdiv.update(containertempdiv.innerHTML);
        }.bind(this)
      });
    } else {
      containertempdiv.setStyle({
        left: '0px',
        top: '0px'
      });
      conatinerinnerdiv.setStyle({
        left: '0px',
        top: '0px',
        display: 'none'
      });
      containertempdiv.appear({
        duration: time
      });
    }
  },
  callOnintervals: function() {
    if (this.options.slide) {
      this.moveNext();
      this.options.timeoutEvent = setTimeout(this.callOnintervals.bind(this), this.options.speed * 1000);
    }
  },
  positionArrowOnResize: function() {
    var previousLinkPosition = 0,
      nextLinkPosition = 0,
      node, curtop, curtopscroll, heightFromTop;
    if (!Prototype.Browser.IE) {
      if ($('allContent') !== null && typeof($('allContent')) !== "undefined" && $('allContent').offsetLeft > 46) {
        previousLinkPosition = ($('allContent').offsetLeft - 45) + "px";
        nextLinkPosition = ($('allContent').offsetLeft + $('allContent').getWidth() - 14) + "px";
      }
    } else {
      if ($('allContent') !== null && typeof($('allContent')) !== "undefined" && $('allContent').offsetLeft > 46) {
        previousLinkPosition = ($('allContent').offsetLeft - 46) + "px";
        nextLinkPosition = ($('allContent').offsetLeft + $('allContent').getWidth() - 9) + "px";
      }
    }
    node = this.mainContainer;
    curtop = 0;
    curtopscroll = 0;
    if (node.offsetParent) {
      do {
        curtop += node.offsetTop;
        curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
      } while (node = node.offsetParent);
      if (navigator.userAgent.indexOf('Chrome') > -1) {
        this.options.heightFromTop = curtop;
      } else {
        this.options.heightFromTop = curtop - curtopscroll;
      }
    }
    if (this.mainContainer !== null && typeof(this.mainContainer) !== "undefined") {
      if (previousLinkPosition === 0) {
        previousLinkPosition = "93%";
        nextLinkPosition = "93%";
      }
      if ($('corrosilRightArrow') !== null && typeof($('corrosilRightArrow')) !== "undefined") {
        $('corrosilRightArrow').style.left = nextLinkPosition;
        $('corrosilRightArrow').style.top = (this.options.heightFromTop + this.options.arrowHeight) + "px";
      }
      if ($('corrosilLeftArrow') !== null && typeof($('corrosilLeftArrow')) !== "undefined") {
        if (previousLinkPosition === "93%") {
          $('corrosilLeftArrow').style.right = previousLinkPosition;
        } else {
          $('corrosilLeftArrow').style.left = previousLinkPosition;
        }
        $('corrosilLeftArrow').style.top = (this.options.heightFromTop + this.options.arrowHeight) + "px";
      }
    }
  },
  setControlOnReadMore: function() {
    var containerId, pageVariables;
    containerId = this.container.id;
    $$('#' + containerId + ' a.readmoreAnchorTag').each(function(obj) {
      obj.observe('click', this.intrupter.bind(this));
    }.bind(this));
  },
  intrupter: function() {
    this.options.slide = false;
    clearTimeout(this.options.timeoutEvent);
  },
  insertArrow: function(vPreviousPosition, vNextPosition) {
    var previousLinkPosition = 0,
      nextLinkPosition = 0,
      imgHeight, nextLink, nextLinkTitle, nextLinkHref, nextLinkimg, previousLink, previousLinkTitle, previousLinkHref, previousLinkimg;
    if (!Prototype.Browser.IE) {
      if ($('allContent') !== null && typeof($('allContent')) !== "undefined" && $('allContent').offsetLeft > 46) {

        previousLinkPosition = "left:" + ($('allContent').offsetLeft - 45) + "px";
        nextLinkPosition = "left:" + ($('allContent').offsetLeft + $('allContent').getWidth() - 14) + "px";
      }
    } else {
      if ($('allContent') !== null && typeof($('allContent')) !== "undefined" && $('allContent').offsetLeft > 46) {

        previousLinkPosition = "left:" + ($('allContent').offsetLeft - 46) + "px";
        nextLinkPosition = "left:" + ($('allContent').offsetLeft + $('allContent').getWidth() - 9) + "px";
      }
    }
    if (this.mainContainer !== null && typeof(this.mainContainer) !== "undefined") {
      if (previousLinkPosition === 0) {
        previousLinkPosition = "right:93%;";
        nextLinkPosition = "left:93%;";
      } else {
        previousLinkPosition = previousLinkPosition + ";";
        nextLinkPosition = nextLinkPosition + ";";
      }
      previousLinkPosition = previousLinkPosition + "top:" + (this.options.heightFromTop + this.options.arrowHeight) + "px";
      nextLinkPosition = nextLinkPosition + "top:" + (this.options.heightFromTop + this.options.arrowHeight) + "px";
    }
    if ($('corrosilRightArrow') !== null && typeof($('corrosilRightArrow')) !== "undefined") {
      $('corrosilRightArrow').remove();
    }
    if ($('corrosilLeftArrow') !== null && typeof($('corrosilLeftArrow')) !== "undefined") {
      $('corrosilLeftArrow').remove();
    }
    if (nextLinkPosition !== 0) {
      nextLink = new Element('div', {
        'class': 'corrosilnavigatingarrow',
        'id': 'corrosilRightArrow',
        'style': nextLinkPosition
      });
    } else {
      nextLink = new Element('div', {
        'class': 'corrosilnavigatingarrow',
        'id': 'corrosilRightArrow',
        'style': 'left:93%;z-index:100px'
      });
    }
    nextLinkTitle = this.options.nextLabel + " (" + vNextPosition + "/" + this.options.totalSizes + ")";
    nextLinkHref = new Element('a', {
      'title': nextLinkTitle,
      'id': 'corrosilNextArrowId'
    });
    nextLinkimg = new Element('img', {
      'src': '/ms/img/RoomsettingsArrows/_0001_Default---right.png',
      'title': nextLinkTitle
    });
    nextLinkimg.observe("mouseover", function() {
      this.src = "/ms/img/RoomsettingsArrows/_0002_Hover---right.png";
    });
    nextLinkimg.observe("mouseleave", function() {
      this.src = "/ms/img/RoomsettingsArrows/_0001_Default---right.png";
    });
    nextLinkHref.appendChild(nextLinkimg);
    nextLink.appendChild(nextLinkHref);
    $(document.body).insert({
      bottom: nextLink
    });
    nextLinkHref.observe('click', this.moveNextClick.bind(this));
    if (previousLinkPosition !== 0) {
      previousLink = new Element('div', {
        'class': 'corrosilnavigatingarrow',
        'id': 'corrosilLeftArrow',
        'style': previousLinkPosition
      });
    } else {
      previousLink = new Element('div', {
        'class': 'corrosilnavigatingarrow',
        'id': 'corrosilLeftArrow',
        'style': 'right:93%;z-index:100px'
      });
    }
    previousLinkTitle = this.options.previousLabel + " (" + vPreviousPosition + "/" + this.options.totalSizes + ")";
    previousLinkHref = new Element('a', {
      'title': previousLinkTitle,
      'id': 'corrosilPreviousArrowId'
    });
    previousLinkimg = new Element('img', {
      'src': '/ms/img/RoomsettingsArrows/_0005_Default---left.png',
      'title': previousLinkTitle
    });
    previousLinkimg.observe("mouseover", function() {
      this.src = "/ms/img/RoomsettingsArrows/_0006_Hover---left.png";
    });
    previousLinkimg.observe("mouseleave", function() {
      this.src = "/ms/img/RoomsettingsArrows/_0005_Default---left.png";
    });
    previousLinkHref.appendChild(previousLinkimg);
    previousLink.appendChild(previousLinkHref);
    $(document.body).insert({
      bottom: previousLink
    });
    previousLinkHref.observe('click', this.movePreviousClick.bind(this));
  },
  updateArrow: function() {
    if (this.options.currentSlide + 1 > this.options.totalSizes) {
      this.insertArrow(this.options.currentSlide - 1, 1);
    } else if (this.options.currentSlide === 1) {
      this.insertArrow(this.options.totalSizes, 2);
    } else {
      this.insertArrow(this.options.currentSlide - 1, this.options.currentSlide + 1);
    }
  },
  insertSlideBar: function() {
    var slideShowImage, i, slideIndiacator;
    if (typeof($('SlideIndiacator')) !== 'undefined' && $('SlideIndiacator') !== null) {
      $('SlideIndiacator').remove();
    }
    slideIndiacator = new Element('div', {
      'id': 'SlideIndiacator',
      'style': 'top:0px'
    });
    for (i = 1; i <= this.options.totalSizes; i = i + 1) {
      if (i === this.options.currentSlide) {
        slideShowImage = new Element('img', {
          'src': '/ms/img/_0001_Indicator_Active.png',
          'class': 'activeSlideIndiacator'
        });
      } else {
        slideShowImage = new Element('img', {
          'src': '/ms/img/_0000_Indicator_Inactive.png',
          'class': 'activeSlideIndiacator'
        });
      }
      slideIndiacator.insert({
        bottom: slideShowImage
      });
    }
    this.mainContainer.insert({
      bottom: slideIndiacator
    });
    this.setControlOnReadMore();
    this.container.childElements()[0].childElements()[0].setStyle({
      height: this.options.containerHeights + 'px'
    });
    this.container.childElements()[1].childElements()[0].setStyle({
      height: this.options.containerHeights + 'px'
    });
    com.ikea.irw.landing.readMore.eventBinding();
    com.ikea.irw.landing.toolTip.eventBinding();
    if ($('corrosilNextArrowId') !== null) {
      Event.observe($('corrosilNextArrowId'), 'click', function() {
        com.ikea.irw.stat.General.setCorrosilAction();
      });
    }
    if ($('corrosilPreviousArrowId') !== null) {
      Event.observe($('corrosilPreviousArrowId'), 'click', function() {
        com.ikea.irw.stat.General.setCorrosilAction();
      });
    }
  },
  moveNextClick: function() {
    this.options.slide = false;
    this.moveNext();
  },
  movePreviousClick: function() {
    this.options.slide = false;
    this.movePrevious();
  },
  moveNext: function() {
    if (this.options.cancontinue === true) {
      this.options.direction = 'NX';
      var i = 0,
        breakslides, validSlide = 0,
        conatinerinnerdiv, conatinerinnerdiv2, containerHeight;
      if (!this.options.slide) {
        clearTimeout(this.options.timeoutEvent);
      }
      containerHeight = this.options.containerHeights + 10;
      if ($('innerCorrosilDiv').getStyle('display') !== 'none') {
        conatinerinnerdiv2 = $('innerCorrosilDiv2');
        conatinerinnerdiv = $('innerCorrosilDiv');
        conatinerinnerdiv.setStyle({
          top: '-' + containerHeight + 'px'
        });
      } else {
        conatinerinnerdiv2 = $('innerCorrosilDiv');
        conatinerinnerdiv = $('innerCorrosilDiv2');
        conatinerinnerdiv2.setStyle({
          top: '-' + containerHeight + 'px'
        });
      }
      conatinerinnerdiv2.setStyle({
        left: '1070px'
      });
      conatinerinnerdiv.setStyle({
        left: '0px'
      });
      if (this.options.currentSlide === this.options.totalSizes) {
        this.options.currentSlide = 1;
        if (typeof(this.options.validContents[0].childElements()[0].childElements()[1]) !== 'undefined' && !this.options.validContents[0].childElements()[0].childElements()[0].hasClassName('gridRow')) {
          conatinerinnerdiv2.update(this.options.validContents[0].childElements()[0].childElements()[1].innerHTML);
          this.animateSlide(conatinerinnerdiv, conatinerinnerdiv2);
        } else if (typeof(this.options.validContents[0].childElements()[0].childElements()[0]) !== 'undefined' && this.options.validContents[0].childElements()[0].childElements()[0].hasClassName('gridRow')) {
          conatinerinnerdiv2.update(this.options.validContents[0].childElements()[0].innerHTML);
          this.animateSlide(conatinerinnerdiv, conatinerinnerdiv2);
        }
      } else {
        this.options.currentSlide = this.options.currentSlide + 1;
        if (typeof(this.options.validContents[this.options.currentSlide - 1].childElements()[0].childElements()[1]) !== 'undefined' && !this.options.validContents[this.options.currentSlide - 1].childElements()[0].childElements()[0].hasClassName('gridRow')) {
          if (this.options.currentSlide === this.options.totalSizes) {
            conatinerinnerdiv2.update(this.options.validContents[this.options.totalSizes - 1].childElements()[0].childElements()[1].innerHTML);
          } else {
            conatinerinnerdiv2.update(this.options.validContents[this.options.currentSlide - 1].childElements()[0].childElements()[1].innerHTML);
          }
          this.animateSlide(conatinerinnerdiv, conatinerinnerdiv2);
        } else if (typeof(this.options.validContents[this.options.currentSlide - 1].childElements()[0].childElements()[0]) !== 'undefined' && this.options.validContents[this.options.currentSlide - 1].childElements()[0].childElements()[0].hasClassName('gridRow')) {
          if (this.options.currentSlide === this.options.totalSizes) {
            conatinerinnerdiv2.update(this.options.validContents[this.options.totalSizes - 1].childElements()[0].innerHTML);
          } else {
            conatinerinnerdiv2.update(this.options.validContents[this.options.currentSlide - 1].childElements()[0].innerHTML);
          }
          this.animateSlide(conatinerinnerdiv, conatinerinnerdiv2);
        }
      }
      this.updateArrow();
      this.insertSlideBar();
    }
  },
  movePrevious: function() {
    if (this.options.cancontinue === true) {
      this.options.direction = 'PV';
      var i = 0,
        breakslides, validSlide = 0,
        conatinerinnerdiv, conatinerinnerdiv2, containerHeight;
      clearTimeout(this.options.timeoutEvent);
      containerHeight = this.options.containerHeights + 10;
      if ($('innerCorrosilDiv').getStyle('display') !== 'none') {
        conatinerinnerdiv2 = $('innerCorrosilDiv2');
        conatinerinnerdiv = $('innerCorrosilDiv');
        conatinerinnerdiv.setStyle({
          top: '-' + containerHeight + 'px'
        });
      } else {
        conatinerinnerdiv2 = $('innerCorrosilDiv');
        conatinerinnerdiv = $('innerCorrosilDiv2');
        conatinerinnerdiv2.setStyle({
          top: '-' + containerHeight + 'px'
        });
      }
      conatinerinnerdiv2.setStyle({
        left: '-1070px'
      });
      conatinerinnerdiv.setStyle({
        left: '0px'
      });
      if (this.options.currentSlide === 1) {
        this.options.currentSlide = this.options.totalSizes;
        if (typeof(this.options.validContents[this.options.currentSlide - 1].childElements()[0].childElements()[1]) !== 'undefined' && !this.options.validContents[this.options.currentSlide - 1].childElements()[0].childElements()[0].hasClassName('gridRow')) {
          conatinerinnerdiv2.update(this.options.validContents[this.options.currentSlide - 1].childElements()[0].childElements()[1].innerHTML);
          this.animateSlide(conatinerinnerdiv, conatinerinnerdiv2);
        } else if (typeof(this.options.validContents[this.options.currentSlide - 1].childElements()[0].childElements()[0]) !== 'undefined' && this.options.validContents[this.options.currentSlide - 1].childElements()[0].childElements()[0].hasClassName('gridRow')) {
          conatinerinnerdiv2.update(this.options.validContents[this.options.currentSlide - 1].childElements()[0].innerHTML);
          this.animateSlide(conatinerinnerdiv, conatinerinnerdiv2);
        }
      } else {
        this.options.currentSlide = this.options.currentSlide - 1;
        if (typeof(this.options.validContents[this.options.currentSlide].childElements()[0].childElements()[1]) !== 'undefined' && !this.options.validContents[this.options.currentSlide].childElements()[0].childElements()[0].hasClassName('gridRow')) {
          if ((this.options.currentSlide) === 1) {
            conatinerinnerdiv2.update(this.options.validContents[0].childElements()[0].childElements()[1].innerHTML);
          } else {
            conatinerinnerdiv2.update(this.options.validContents[this.options.currentSlide - 1].childElements()[0].childElements()[1].innerHTML);
          }
          this.animateSlide(conatinerinnerdiv, conatinerinnerdiv2);
        } else if (typeof(this.options.validContents[this.options.currentSlide].childElements()[0].childElements()[0]) !== 'undefined' && this.options.validContents[this.options.currentSlide].childElements()[0].childElements()[0].hasClassName('gridRow')) {
          if ((this.options.currentSlide) === 1) {
            conatinerinnerdiv2.update(this.options.validContents[0].childElements()[0].innerHTML);
          } else {
            conatinerinnerdiv2.update(this.options.validContents[this.options.currentSlide - 1].childElements()[0].innerHTML);
          }
          this.animateSlide(conatinerinnerdiv, conatinerinnerdiv2);
        }
      }
      this.updateArrow();
      this.insertSlideBar();
    }
  }
};
com.ikea.irw.homepage.newsticker = Class.create();
com.ikea.irw.homepage.newsticker.prototype = {
  initialize: function() {
    this.interval = 0;
    if (typeof(changespeed) !== "undefined" && changespeed !== null) {
      this.interval = changespeed;
    }
    this.container = $("newsticker");
    if (this.container === null || this.container === undefined) {
      return;
    }
    this.newslist = $("newslist");
    if (this.newslist !== null || this.newslist !== undefined) {
      this.newslist.setStyle({
        'maxHeight': '14px'
      });
    }
    this.container.addClassName('newsTickerBottomBorder');
    this.controlsContainer = $("controlsContainer");
    this.messages = $A(this.container.getElementsByTagName("SPAN"));
    this.number_of_messages = this.messages.length;
    if (this.number_of_messages === 0) {
      this.showError();
      return false;
    }
    if (this.number_of_messages > 1) {
      this.current_message = 0;
      this.previous_message = null;

      // Add events for paly, pause, next and prev ---------------------------
      this.playDiv = this.appendButton("button", "play", "Play", this.startPlay);
      this.pauseDiv = this.appendButton("button", "pause", "Pause", this.pausePlay);
      this.prevDiv = this.appendButton("button", "prev", "Previous", this.showPrev, this.keyBoardPress);
      this.nextDiv = this.appendButton("button", "next", "Next", this.showNext);

      // Add events on mouseover and mouseleave ------------------------------
      Event.observe("newslist", "mouseover", this.pausePlay.bindAsEventListener(this));
      Event.observe("newslist", "mouseleave", this.startPlay.bindAsEventListener(this));

      //this.startPlay();
      this.hideMessages();
      this.showMessage();
      this.showPause();
      // Install timer
      this.timer = setInterval(this.showMessage.bind(this), this.interval);
    }
  },
  showMessage: function() {
    Effect.Appear(this.messages[this.current_message]);
    this.timeout = setTimeout(this.fadeMessage.bind(this), this.interval - 1000);

    if (this.current_message < this.number_of_messages - 1) {
      this.previous_message = this.current_message;
      this.current_message = this.current_message + 1;
    } else {
      this.current_message = 0;
      this.previous_message = this.number_of_messages - 1;
    }
  },
  fadeMessage: function() {
    Effect.Fade(this.messages[this.previous_message]);
  },
  hideMessages: function() {
    this.messages.each(function(message) {
      Element.hide(message);
    });
  },
  // Custom code for play pause
  appendButton: function(type, id, alt, func) {
    div = new Element(type, {
      'id': id,
      'alt': alt,
      'title': alt
    });
    Event.observe(div, "click", func.bindAsEventListener(this));
    this.controlsContainer.appendChild(div);
    return div;
  },
  showNext: function() {
    // Pause the ticker and hide the current message
    this.pausePlay();
    this.hideMessages();
    //Effect.Appear(this.messages[this.current_message]);
    this.messages[this.current_message].style.display = '';
    // Set the current_message with new number
    if (this.current_message < this.number_of_messages - 1) {
      this.current_message = this.current_message + 1;
    } else {
      this.current_message = 0;
    }
  },
  startPlay: function() {
    clearTimeout(this.timeout);
    this.hideMessages();
    this.current_message = this.current_message - 1;
    if (this.current_message < 0) {
      this.current_message = this.number_of_messages - 1;
    }
    this.messages[this.current_message].style.display = '';
    this.showMessage();
    this.timer = setInterval(this.showMessage.bind(this), this.interval);
    this.showPause();
  },
  pausePlay: function() {
    // Clear the timer and timeout
    clearTimeout(this.timeout);
    clearInterval(this.timer);
    this.showPlay();
  },
  showPlay: function() {
    this.playDiv.style.display = '';
    this.pauseDiv.style.display = 'none';
  },
  showPause: function() {
    this.playDiv.style.display = 'none';
    this.pauseDiv.style.display = '';
  },
  showPrev: function() {
    // Pause the ticker and hide the current message
    this.pausePlay();
    this.hideMessages();
    this.current_message = this.current_message - 1;
    if (this.current_message < 0) {
      this.current_message = this.number_of_messages - 1;
      this.messages[this.current_message - 1].style.display = '';
    } else if (this.current_message === 0) {
      this.messages[this.number_of_messages - 1].style.display = '';
    } else {
      this.messages[this.current_message - 1].style.display = '';
    }
  },

  showError: function() {
    this.list = $("newslist");
    this.UL = document.createElement("ul");
    this.list.appendChild(this.UL);
    this.errorMessage = document.createElement("li");
    this.errorMessage.className = "error";
    this.errorMessage.innerHTML = "Could not retrieve data";
    this.list.appendChild(this.errorMessage);
  }
};

function irwstatSendHomePageTag() {
  if ($('newslist') !== null) {
    Event.observe($('newslist'), 'click', function() {
      irwstatSetTrailingTag("IRWStats.pageFunctionality", "modules>news ticker");
      irwstatSetTrailingTag("IRWStats.sitenavigation", "news ticker");
    });
  }
  if ($('impInfoLink') !== null) {
    Event.observe($('impInfoLink'), 'click', function() {
      irwstatSetTrailingTag("IRWStats.pageFunctionality", "modules>important information");
      irwstatSetTrailingTag("IRWStats.sitenavigation", "important information module");
    });
  }
  if ($('whatsection') !== null) {
    Event.observe($('whatsection'), 'click', function() {
      irwstatSetTrailingTag("IRWStats.sitenavigation", "homepage what module");
    });
  }
  if ($('whysection') !== null) {
    Event.observe($('whysection'), 'click', function() {
      irwstatSetTrailingTag("IRWStats.sitenavigation", "homepage why module");
    });
  }
  if ($('howsection') !== null) {
    Event.observe($('howsection'), 'click', function() {
      irwstatSetTrailingTag("IRWStats.sitenavigation", "homepage how module");
    });
  }
}
com.ikea.irw.homepage.productrecall = Class.create();
com.ikea.irw.homepage.productrecall.prototype = {
  initialize: function(images, container, speed, options) {
    var interval, numercConverter = 1;
    this.speed = speed;
    this.images = images;
    this.container = container;
    this.options = Object.extend(options || {}, {
      frequency: 2000,
      current: 0,
      totalSizes: images.length,
      vitemPosition: 0,
      fadeduartion: 0.5,
      fadetimeout: 1500
    });
    if (typeof(this.speed * numercConverter) === "number") {
      this.options.frequency = this.speed;
      this.options.fadeduartion = this.speed / 4000;
      this.options.fadetimeout = (this.speed * 3) / 4;
    }
    if (this.images.length > 1) {
      interval = setInterval(this.startShow.bind(this), this.options.frequency);
    }
  },
  startShow: function() {
    var count = 0,
      gotItem = false,
      vTotalSize = this.options.totalSizes,
      vitemPositions = 0,
      containerDiv, numercConverter = 1;
    containerDiv = $$('#productrecallslideShow .productsDisc .recallproductDetails .recallProductName');
    this.images.each(function(item) {
      if (!gotItem && containerDiv[count].className.indexOf('selected') > -1) {
        if (vTotalSize === ((count * numercConverter) + 1)) {
          vitemPositions = 0;
        } else {
          vitemPositions = (count * numercConverter) + 1;
        }
        gotItem = true;
        containerDiv[count].className = 'recallProductName';
        item.parentNode.className = 'productsDisc';
      }
      count = count + 1;
    });
    this.options.vitemPosition = vitemPositions;
    containerDiv[vitemPositions].className = 'recallProductName selected';
    this.changeImage();
  },

  changeImage: function() {
    var obj, t;
    $(this.container.parentNode.id).fade({
      duration: this.options.fadeduartion,
      from: 0,
      to: 1,
      beforeStart: function() {
        this.container.parentNode.setStyle({
          'opacity': '0',
          'display': 'block'
        });
        this.container.src = this.images[this.options.vitemPosition].value;
      }.bind(this),
      afterFinish: function() {
        obj = this.container.parentNode;
        t = setTimeout(function() {
          obj.setStyle({
            'opacity': '0'
          });
        }, this.options.fadetimeout);
      }.bind(this)
    });
  }
};
