var seasonalStyleArray = new Array();
seasonalStyleArray.push({
  'seasonalName': "summer",
  'color': "df6a03"
});

function getProducts() {

  document.write('<div id="moreRoomsMenuWrapper">');
  document.write('<div class="moreRoomsMenu" id="moreRoomsMenu" style="display:none;">');
  document.write('    <div class="border" onmouseover="tagVisibility(\'SELECT\',\'hide\');" onmouseout="tagVisibility(\'SELECT\',\'show\');">');
  document.write('        <table cellspacing="0" id="table">');


  document.write('            <tr>');
  document.write('                <td>');
  document.write('                    <div class="contentLeft">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/outdoor"><img src="http://www.ikea.com/ms/img/menu/products/25x25/outdoor_25x25.gif" alt="" border="0" /><span>Balkon i ogrÃ³d</span></a>');
  document.write('                    </div>');
  document.write('                </td>');


  document.write('                <td>');
  document.write('                    <div class="contentRight">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/secondary_storage"><div class="productImage" style="background-position:-225px 0;"></div><span>Przechowywanie</span></a>');
  document.write('                    </div>');
  document.write('                </td>');
  document.write('            </tr>');


  document.write('            <tr>');
  document.write('                <td>');
  document.write('                    <div class="contentLeft">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/decoration"><div class="productImage" style="background-position:-450px 0;"></div><span>Dekoracje</span></a>');
  document.write('                    </div>');
  document.write('                </td>');


  document.write('                <td>');
  document.write('                    <div class="contentRight">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/hallway"><div class="productImage" style="background-position:-375px 0;"></div><span>PrzedpokÃ³j</span></a>');
  document.write('                    </div>');
  document.write('                </td>');
  document.write('            </tr>');


  document.write('            <tr>');
  document.write('                <td>');
  document.write('                    <div class="contentLeft">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/workspaces"><div class="productImage" style="background-position:-100px 0;"></div><span>Domowe biuro</span></a>');
  document.write('                    </div>');
  document.write('                </td>');


  document.write('                <td>');
  document.write('                    <div class="contentRight">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/bedroom"><div class="productImage" style="background-position:-25px 0;"></div><span>Sypialnia</span></a>');
  document.write('                    </div>');
  document.write('                </td>');
  document.write('            </tr>');


  document.write('            <tr>');
  document.write('                <td>');
  document.write('                    <div class="contentLeft">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/cooking"><div class="productImage" style="background-position:-125px 0;"></div><span>Gotowanie</span></a>');
  document.write('                    </div>');
  document.write('                </td>');


  document.write('                <td>');
  document.write('                    <div class="contentRight">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/food"><img src="http://www.ikea.com/ms/img/menu/products/32x32/food_32x32.gif" alt="" border="0" /><span>Szwedzka Å¼ywnoÅ›Ä‡</span></a>');
  document.write('                    </div>');
  document.write('                </td>');
  document.write('            </tr>');


  document.write('            <tr>');
  document.write('                <td>');
  document.write('                    <div class="contentLeft">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/dining"><div class="productImage" style="background-position:-150px 0;"></div><span>Jadalnia</span></a>');
  document.write('                    </div>');
  document.write('                </td>');


  document.write('                <td>');
  document.write('                    <div class="contentRight">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/Textiles"><div class="productImage" style="background-position:-325px 0;"></div><span>Tekstylia</span></a>');
  document.write('                    </div>');
  document.write('                </td>');
  document.write('            </tr>');


  document.write('            <tr>');
  document.write('                <td>');
  document.write('                    <div class="contentLeft">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/eating"><div class="productImage" style="background-position:-350px 0;"></div><span>Jedzenie</span></a>');
  document.write('                    </div>');
  document.write('                </td>');


  document.write('                <td>');
  document.write('                    <div class="contentRight">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/indoor_gardening"><img src="http://www.ikea.com/ms/img/menu/products/32x32/pots_plants_32x32.gif" alt="" border="0" /><span>Uprawy domowe</span></a>');
  document.write('                    </div>');
  document.write('                </td>');
  document.write('            </tr>');


  document.write('            <tr>');
  document.write('                <td>');
  document.write('                    <div class="contentLeft">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/kitchen"><div class="productImage" style="background-position:-0px 0;"></div><span>Meble kuchenne i sprzÄ™t AGD</span></a>');
  document.write('                    </div>');
  document.write('                </td>');


  document.write('                <td>');
  document.write('                    <div class="contentRight">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/wireless_charging"><img src="http://www.ikea.com/ms/img/menu/products/32x32/wireless_charging_32x32.gif" alt="" border="0" /><span>Åadowanie bezprzewodowe</span></a>');
  document.write('                    </div>');
  document.write('                </td>');
  document.write('            </tr>');


  document.write('            <tr>');
  document.write('                <td>');
  document.write('                    <div class="contentLeft">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/lighting"><div class="productImage" style="background-position:-425px 0;"></div><span>OÅ›wietlenie</span></a>');
  document.write('                    </div>');
  document.write('                </td>');


  document.write('                <td>');
  document.write('                    <div class="contentRight">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/bathroom"><div class="productImage" style="background-position:-75px 0;"></div><span>Åazienka</span></a>');
  document.write('                    </div>');
  document.write('                </td>');
  document.write('            </tr>');


  document.write('            <tr>');
  document.write('                <td>');
  document.write('                    <div class="contentLeft">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/childrens_ikea"><div class="productImage" style="background-position:-300px 0;"></div><span>PokÃ³j dzieciÄ™cy</span></a>');
  document.write('                    </div>');
  document.write('                </td>');


  document.write('                <td>');
  document.write('                    <div class="contentRight">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/ikea_family_products"><div class="productImage" style="background-position:-250px 0;"></div><span>Produkty IKEA FAMILY</span></a>');
  document.write('                    </div>');
  document.write('                </td>');
  document.write('            </tr>');


  document.write('            <tr>');
  document.write('                <td>');
  document.write('                    <div class="contentLeft">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/living_room"><div class="productImage" style="background-position:-200px 0;"></div><span>PokÃ³j dzienny</span></a>');
  document.write('                    </div>');
  document.write('                </td>');


  document.write('                <td>');
  document.write('                    <div class="contentRight">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/business"><img src="http://www.ikea.com/ms/img/menu/products/32x32/business_32x32.gif" alt="" border="0" /><span>Dla biznesu</span></a>');
  document.write('                    </div>');
  document.write('                </td>');
  document.write('            </tr>');


  document.write('            <tr>');
  document.write('                <td>');
  document.write('                    <div class="contentLeft">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/laundry"><div class="productImage" style="background-position:-275px 0;"></div><span>Pomieszczenie gospodarcze</span></a>');
  document.write('                    </div>');
  document.write('                </td>');


  document.write('                <td>');
  document.write('                    <div class="contentRight">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/seasonal/winter_holidays"><img src="http://www.ikea.com/ms/img/menu/products/32x32/winter_collections_32x32.gif" alt="" border="0" /><span class="seasonal" style="color:#444444">Kolekcja ÅšwiÄ…teczna</span></a>');
  document.write('                    </div>');
  document.write('                </td>');
  document.write('            </tr>');


  document.write('            <tr>');
  document.write('                <td>');
  document.write('                    <div class="contentLeft noBorder">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/departments/small_storage"><div class="productImage" style="background-position:-50px 0;"></div><span>Przechowywanie drobne</span></a>');
  document.write('                    </div>');
  document.write('                </td>');


  document.write('                <td>');
  document.write('                    <div class="contentRight noBorder">');
  document.write('                        <a href="http://www.ikea.com/pl/pl/catalog/categories/seasonal/back_to_college"><img src="http://www.ikea.com/ms/img/menu/products/32x32/back_to_collage_32x32.gif" alt="" border="0" /><span class="seasonal" style="color:#444444">PowrÃ³t do szkoÅ‚y</span></a>');
  document.write('                    </div>');
  document.write('                </td>');
  document.write('            </tr>');


  document.write('        </table>');
  document.write('    </div>');
  document.write('    <div class="endLeft"></div>');
  document.write('    <div class="endCenter"></div>');
  document.write('    <div class="endRight"></div>');
  document.write('</div>');
  document.write('</div>');
}
var js_lightbox_error_text = "sorry but we did not find any information";
var js_lightbox_close_button_alt_text = "Close";
var corousel_speed = "5";

IRW.search.localConfig = {
  maxEntries: 10,
  isEnabled: true,
  enableDirectLinks: true,
  charAmountActive: -1,
  labels: {
    "system": "entire system",
    "series": "whole series",
    "collection": "whole collection",
    "local_store": "Store"
  }
};


neroTrackingLocal = {
  isEnabled: false,
  labels: [{
    category: " ",
    value: "Tracking"
  }]
};


$namespace('com.ikea.irw.flash.Translations');
com.ikea.irw.flash.Translations = {
  downloadClickText: 'click here',
  downloadText: 'to use all content'

};


$namespace('com.ikea.irw.GUI');
com.ikea.irw.GUI.Tran = {
  linkText: "Returns",
  altText: "Back to top"
};


$namespace('com.ikea.irw.GUI.cookie');
com.ikea.irw.GUI.cookie.Translations = {
  inclStgs: "true",
  ckSettings: "true",
  cookieMsg: "We use cookies on IKEA. If you do not agree, please leave us",
  xx: "en_EN",
  pvclnkTxt: "Privacy policy",
  pvclnkPath: "http://www.ikea.com/ms/pl_PL/privacy_policy/privacy_policy.html",
  coklnkTxt: "More information about cookies",
  coklnkPath: "http://www.ikea.com/ms/pl_PL/privacy_policy/cookie_policy.html"
};

document.observe("dom:loaded", function() {
  com.ikea.irw.GUI.cookies.cookiesLegislation.init();
  var mobileBannerFix = {
    getParameterByName: function(name) {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    applyChanges: function() {
      if (mobileBannerFix.getParameterByName("m") === "true" &&
        (window.location.pathname.split("/")[4] === "privacy_policy.html" ||
          window.location.pathname.split("/")[4] === "cookie_policy.html")) {
        var el = document.getElementById("topMsgBlock");
        if (el) {
          el.className = "mobile";
          $('allContent').insert({
            top: $('cookieMsgBlock')
          })
        }
      }
    }
  }
  mobileBannerFix.applyChanges();
});
