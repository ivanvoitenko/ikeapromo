(function(window, document, undefined) {

  function documentready(fn) {
    if (document.readyState != 'loading') {
      fn();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState != 'loading')
          fn();
      });
    }
  };

  window.replaceMenu = function() {
    var _this = this;
    this.listIndex = 0;
    /** Variable to store product list number **/
    _this.main = $('mainPadding');
    _this.topMenu = $('topMenu');
    _this.insertStyles();
    _this.removeOldMenu();

  };

  //add header CSS
  replaceMenu.prototype.insertStyles = function() {
    var head = document.getElementsByTagName('head')[0];
    var styles = '<link rel="stylesheet" href="//ivanvoitenko.github.io/ikeapromo/style/header-styles.css">' +
      '<link rel="stylesheet" href="//ivanvoitenko.github.io/ikeapromo/style/menu-styles.css">';

    head.insertAdjacentHTML('beforeend', styles);
  };

  replaceMenu.prototype.removeOldMenu = function() {
    var _this = this,
      logonFormEl = $('myAccount'),
      searchFormEl = jQuery('.searchForm'),
      wrapper = document.createElement('div');

    wrapper.className = 'main-header';
    searchFormEl.find('.formInput').addClass('form-control');
    searchFormEl.find('.formBtn').addClass('search-button');

    //move search & logon forms
    _this.logonForm = _this.topMenu.removeChild(logonFormEl);
    _this.searchForm = searchFormEl.clone(true);

    //remove old menu
    _this.main.removeChild($('menu'));
    _this.main.replaceChild(wrapper, _this.topMenu);
    wrapper.appendChild(_this.logonForm);

    _this.insertTopBar();
  };

  replaceMenu.prototype.insertTopBar = function() {
    var _this = this,
      headerBrand = '<div class="header-brand">' +
      '<a href="//ivanvoitenko.github.io/ikeapromo/" id="lnkIKEALogoHeader" class="logoLink">' +
      '<img src="//www.ikea.com/ms/pl_PL/img/header/logo.png" alt="Ty tu urzÄdzisz" class="logo" id="imgIKEALogoHeader"/>' +
      '</a></div>',
      banner = '<div class="top-banner banner-transport">' +
      '<div class="top-banner-ico"><svg width="24" height="24" viewBox="0 0 16 16">' +
      '<path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>' +
      '</svg></div>' +
      '<p class="top-banner-text"><span class="top-banner-caption">IMPORTANT! </span><strong> This page was built with IKEA Poland template.</strong> It takes time to adapt all the code. Sorry for mistakes. It was prepared in a short time.</p>' +
      '</div>';

    _this.mainHeader = jQuery('.main-header');
    _this.mainHeader.wrap('<div class="main-header-wrap"></div>');
    _this.mainHeader.parent().after(banner);

    _this.mainHeader.append('<div class="header-gray-stripe"><ul class="pull-left"></ul><ul class="pull-right"></ul></div>');
    _this.mainHeader.append('<div class="header-links">' + headerBrand +
      '<div class="header-nav"><ul class="header-nav-list clean-list"></ul></div>' +
      '<div class="header-search"></div>' +
      '<div class="header-cart expandable" id="header-cart"><a href="/webapp/wcs/stores/servlet/InterestItemDisplay?storeId=19&langId=-27">' +
      '<img class="header-cart-ico" src="//www.ikea.com/ms/pl_PL/img/ecommerce/cart_big.png">' +
      '<span class="cart-quantity"></span></a></div>' +
      '</div></div>');
    _this.mainHeader.find('.header-search').append(_this.searchForm);
    _this.insertHeaderScripts();
    _this.createNewMenu();
  };

  replaceMenu.prototype.createNewMenu = function() {
    var _this = this,
      quickLinks = _this.mainHeader.find('.header-gray-stripe'),
      quickLinksListLeft = quickLinks.find('ul.pull-left'),
      quickLinksListRight = quickLinks.find('ul.pull-right'),
      navList = _this.mainHeader.find('.header-nav-list'),
      quickLinksTmpl = new Template('<li><a href="#{url}" id="#{id}" class="#{class}">#{label}</a></li>'),
      navLinksTmpl = new Template('<li class="header-nav-item #{class}" id="#{id}"><a href=#{url} class="#{linkClass}" #{target}>#{label}</a></li>'),
      roomsTmpl = new Template('<div class="col-4"><ul class="pictures">' +
        '<li><a href="#{firstroomUrl}">#{firstroomLabel}<img src="#{firstroomImg}" alt="#{firstroomLabel}" /></a>' +
        '<li><a href="#{secondroomUrl}">#{secondroomLabel}<img src="#{secondroomImg}" alt="#{secondroomLabel}" /></a>' +
        '</ul></div>'),
      productsTmpl = new Template('<li><a class="item-#{id}" href="#{url}">#{label}</a></li>'),
      productsCategoriesTmpl = new Template('<li class="header-nav-sublist-title"><a href="#" class="non-active-link">#{label} <em></em></a>' +
        '<div class="header-nav-group"><div class="row list-container">#{products}</div>#{banner}</div></li>'),
      bannerTmpl = new Template('<div class="img-container"><a href="#{link}">' +
        '<div class="price-tag #{color} #{position}"><img class="badge-nnc" style="display:#{nnc}" src="//www.ikea.com/ms/img/nlp/pl_PL/nlp_02.png" alt="Nowa NiĹźsza Cena">' +
        '<span class="product-name">#{name}</span>' +
        '<span class="product-category">#{category}</span>' +
        '<span class="product-price">#{price}</span>' +
        '<span class="product-price-previous">#{previousPrice}</span>' +
        '</div>' +
        '<img class="header-banner" src="#{image}" />' +
        '</a></div>');

    var quickLinksLeft = [{
        url: '//www.ikea.com/ms/pl_PL/customer-service/about-shopping/catalogue-and-brochures/',
        id: 'lnkIcon1Header',
        class: 'link-catalogue',
        label: 'Сatalog 2018'
      },
      {
        url: '//www.ikeafamily.eu/',
        id: 'lnkIcon2Header',
        label: 'IKEA family'
      },
      {
        url: '//www.facebook.com/ivoitenko',
        id: 'lnkIcon3Header',
        class: 'link-if',
        label: 'Ivan Voitenko'
      },
      {
        url: '//rabota.ua/company839/vacancy7058186',
        id: 'lnkIcon4Header',
        class: 'link-ib',
        label: 'Web Editor Vacancy in Ukraine'
      }
    ];
    var quickLinksRight = [{
        url: '//www.ikea.com/pl/pl/#twoja-ikea',
        id: 'link_header_ikny_splash',
        label: 'Online store'
      },
      {
        url: '//www.ikea.com/webapp/wcs/stores/servlet/InterestItemDisplay?storeId=19&langId=-27',
        id: 'link_header_shopping_list',
        rel: 'nofollow',
        label: 'Shopping list'
      },
      {
        url: '//www.ikea.com/ms/pl_PL/customer_service/kontakt.html',
        id: 'link_header_help',
        label: 'Help'
      },
      {
        url: '//www.ikea.com/ms/pl_PL/this-is-ikea/working-at-the-ikea-group/index.html',
        label: 'Vacancies'
      },
      {
        url: '//www.ikea.com/ms/pl_PL/activities/logowanie.html',
        id: 'link_header_logowanie',
        label: 'Sign In'
      }
    ];

    var navLinks = [{
        class: 'header-nav-sub-block-cnt',
        id: 'products-acc',
        url: '#',
        linkClass: 'menu-link arrow',
        label: 'PRODUCTS'
      },
      {
        class: 'header-nav-sub-block-cnt menu-rooms',
        id: 'rooms-acc',
        url: '#',
        linkClass: 'menu-link arrow',
        label: 'ROOMS'
      },
      {
        url: '//youtu.be/qZMMJo7jOTQ',
        linkClass: 'menu-link',
        label: 'WELCOME TO UKRAINE'
      }
    ];

    var roomsLinks = [{
        firstroomUrl: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom?icid=itl|pl|menu|201712131549414989_197',
        firstroomLabel: 'BEDROOM',
        firstroomImg: '//www.ikea.com/ms/pl_PL/img/header/bedroom.jpg',
        secondroomUrl: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/?icid=itl|pl|menu|201712131549414989_202',
        secondroomLabel: 'WORK SPACE',
        secondroomImg: '//www.ikea.com/ms/pl_PL/img/header/office.jpg'
      },
      {
        firstroomUrl: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room?icid=itl|pl|menu|201712131549414989_198',
        firstroomLabel: 'LIVING ROOM',
        firstroomImg: '//www.ikea.com/ms/pl_PL/img/header/livingroom.jpg',
        secondroomUrl: '//www.ikea.com/pl/pl/catalog/categories/departments/bathroom?icid=itl|pl|menu|201712131549414989_203',
        secondroomLabel: 'BATHROOM',
        secondroomImg: '//www.ikea.com/ms/pl_PL/img/header/bathroom.jpg'
      },
      {
        firstroomUrl: '//www.ikea.com/pl/pl/catalog/categories/departments/childrens_ikea/?icid=itl|pl|menu|201712131549414989_199',
        firstroomLabel: 'CHILDREN\'S',
        firstroomImg: '//www.ikea.com/ms/pl_PL/img/header/children.jpg',
        secondroomUrl: '//www.ikea.com/pl/pl/catalog/categories/departments/laundry?icid=itl|pl|menu|201712131549414989_204',
        secondroomLabel: 'LAUNDRY',
        secondroomImg: '//www.ikea.com/ms/pl_PL/img/header/laundry.jpg'
      },
      {
        firstroomUrl: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen?icid=itl|pl|menu|201712131549414989_200',
        firstroomLabel: 'KITCHEN',
        firstroomImg: '//www.ikea.com/ms/pl_PL/img/header/kitchen.jpg',
        secondroomUrl: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway?icid=itl|pl|menu|201712131549414989_205',
        secondroomLabel: 'HALLWAY',
        secondroomImg: '//www.ikea.com/ms/pl_PL/img/header/hallway.jpg'
      },
      {
        firstroomUrl: '//www.ikea.com/pl/pl/catalog/categories/departments/dining?icid=itl|pl|menu|201712131549414989_201',
        firstroomLabel: 'DINNING',
        firstroomImg: '//www.ikea.com/ms/pl_PL/img/header/dinningroom.jpg',
        secondroomUrl: '//www.ikea.com/pl/pl/catalog/categories/departments/outdoor?icid=itl|pl|menu|201712131549414989_206',
        secondroomLabel: 'OUTDOOR',
        secondroomImg: '//www.ikea.com/ms/pl_PL/img/header/garden.jpg'
      }
    ];

    var sofas = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/39130/?icid=itl|pl|menu|201712131549414940_10',
          label: 'All models of sofas'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10661/?icid=itl|pl|menu|201712131549414940_11',
          label: 'Unheated sofas'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10662/?icid=itl|pl|menu|201712131549414940_12',
          label: 'Leather sofas and artificial leather'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10663/?icid=itl|pl|menu|201712131549414940_13',
          label: 'Unfolded sofas'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/16238/?icid=itl|pl|menu|201712131549414940_14',
          label: 'Modular sofas'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/20926/?icid=itl|pl|menu|201712131549414940_15',
          label: 'Stools and footstools'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/16239/?icid=itl|pl|menu|201712131549414940_16',
          label: 'Armchairs'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10664/?icid=itl|pl|menu|201712131549414940_17',
          label: 'Additional covers'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10705/?icid=itl|pl|menu|201712131549414940_18',
          label: 'Coffee and night tables'
        }
      ]
    ];
    var shelves = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10475/?icid=itl|pl|menu|201712131549414940_19',
          label: 'RTV cabinets'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/29882/?icid=itl|pl|menu|201712131549414940_20',
          label: 'BESTA module system'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/11465/?icid=itl|pl|menu|201712131549414940_21',
          label: 'Shelves'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10550/?icid=itl|pl|menu|201712131549414940_22',
          label: 'Boxes for shelves'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10382/?icid=itl|pl|menu|201712131549414940_23',
          label: 'Bookcases'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10384/?icid=itl|pl|menu|201712131549414940_24',
          label: 'Sites'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/10451/?icid=itl|pl|menu|201712131549414940_25',
          label: 'Chests'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10398/?icid=itl|pl|menu|201712131549414940_26',
          label: 'Shelves wall'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10550/?icid=itl|pl|menu|201712131549414940_27',
          label: 'Box, baskets and cartons'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/16200/?icid=itl|pl|menu|201712131549414940_28',
          label: 'Racks for the pantry'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/laundry/11751/?icid=itl|pl|menu|201712131549414940_29',
          label: 'ALGOT module system'
        }
      ]
    ];
    var tables = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10705/?icid=itl|pl|menu|201712131549414940_30',
          label: 'Stoliki kawowe i nocne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/dining/21825/?icid=itl|pl|menu|201712131549414940_31',
          label: 'StoĹy jadalniane'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/dining/21829/?icid=itl|pl|menu|201712131549414940_32',
          label: 'StoĹy rozkĹadane'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/dining/25219/?icid=itl|pl|menu|201712131549414940_33',
          label: 'KrzesĹa jadalniane'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/dining/25222/?icid=itl|pl|menu|201712131549414940_34',
          label: 'KrzesĹa skĹadane'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/dining/19145/?icid=itl|pl|menu|201712131549414940_35',
          label: 'Zestawy do jadalni'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/dining/16244/?icid=itl|pl|menu|201712131549414940_36',
          label: 'KrzesĹa i stoĹy barowe'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/dining/dining_storage/?icid=itl|pl|menu|201712131549414940_37',
          label: 'Bufety, kredensy i witryny'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/dining/10728/?icid=itl|pl|menu|201712131549414940_38',
          label: 'StoĹki i Ĺawy'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/dining/18733/?icid=itl|pl|menu|201712131549414940_39',
          label: 'KrzesĹa dla dzieci'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/dining/18715/?icid=itl|pl|menu|201712131549414940_40',
          label: 'KrzesĹa do karmienia dla dzieci'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/20657/?icid=itl|pl|menu|201712131549414940_41',
          label: 'Toaletki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/22659/?icid=itl|pl|menu|201712131549414940_42',
          label: 'StoĹki i Ĺawy'
        }
      ]
    ];
    var textiles = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/10654/?icid=itl|pl|menu|201712131549414940_43',
          label: 'ZasĹony i rolety'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/18891/?icid=itl|pl|menu|201712131549414940_44',
          label: 'DrÄĹźki i szyny do zasĹon'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/bedroom_rugs/?icid=itl|pl|menu|201712131549414940_45',
          label: 'Dywany'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/10659/?icid=itl|pl|menu|201712131549414940_46',
          label: 'Poduszki i poszewki dekoracyjne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/Textiles/18850/?icid=itl|pl|menu|201712131549414940_47',
          label: 'Tekstylia kuchenne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/Textiles/18850/?icid=itl|pl|menu|201712131549414940_48',
          label: 'Tekstylia stoĹowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/Textiles/18730/?icid=itl|pl|menu|201712131549414940_49',
          label: 'Tekstylia i poĹciel dla dzieci'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/Textiles/18690/?icid=itl|pl|menu|201712131549414940_50',
          label: 'Tekstylia i poĹciel dla niemowlÄt'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/10651/?icid=itl|pl|menu|201712131549414940_51',
          label: 'PoĹciel'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/20529/?icid=itl|pl|menu|201712131549414940_52',
          label: 'KoĹdry'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/20533/?icid=itl|pl|menu|201712131549414940_53',
          label: 'Poduszki do spania'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/20528/?icid=itl|pl|menu|201712131549414940_54',
          label: 'Pledy i koce'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/Textiles/20520/?icid=itl|pl|menu|201712131549414940_55',
          label: 'RÄczniki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/Textiles/22659/?icid=itl|pl|menu|201712131549414940_56',
          label: 'Dywaniki Ĺazienkowe'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/Textiles/18908/?icid=itl|pl|menu|201712131549414940_57',
          label: 'ZasĹony prysznicowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/Textiles/10655/?icid=itl|pl|menu|201712131549414940_58',
          label: 'Tkaniny i akcesoria do szycia'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/20527/?icid=itl|pl|menu|201712131549414940_59',
          label: 'Narzuty i kapy'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/Textiles/10698/?icid=itl|pl|menu|201801161224131179_1',
          label: 'Wycieraczki'
        }
      ]
    ];
    var lightning = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/18750/?icid=itl|pl|menu|201712131549414940_60',
          label: 'Lampy sufitowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/10732/?icid=itl|pl|menu|201712131549414940_61',
          label: 'Lampy stoĹowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/10731/?icid=itl|pl|menu|201712131549414940_62',
          label: 'Lampy podĹogowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/20503/?icid=itl|pl|menu|201712131549414940_63',
          label: 'Lampy Ĺcienne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/20502/?icid=itl|pl|menu|201712131549414940_64',
          label: 'Lampy do pracy'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/20506/?icid=itl|pl|menu|201712131549414940_65',
          label: 'Reflektory i ĹwiatĹo punktowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/16282/?icid=itl|pl|menu|201712131549414940_66',
          label: 'OĹwietlenie kuchenne'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/16283/?icid=itl|pl|menu|201712131549414940_67',
          label: 'OĹwietlenie do szaf'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/10736/?icid=itl|pl|menu|201712131549414940_68',
          label: 'OĹwietlenie Ĺazienkowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/18773/?icid=itl|pl|menu|201712131549414940_69',
          label: 'OĹwietlenie dla dzieci'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/smart_lighting/?icid=itl|pl|menu|201712131549414940_70',
          label: 'Inteligentne oĹwietlenie'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/35165/?icid=itl|pl|menu|201712131549414940_71',
          label: 'OĹwietlenie zewnÄtrzne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/10744/?icid=itl|pl|menu|201712131549414940_72',
          label: 'ĹťarĂłwki i akcesoria'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/lighting/35165/?icid=itl|pl|menu|201712131549414940_73',
          label: 'Baterie i Ĺadowarki'
        }
      ]
    ];
    var decoration = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/decoration/20489/?icid=itl|pl|menu|201712131549414940_74',
          label: 'Lustra'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/decoration/10757/?icid=itl|pl|menu|201712131549414959_75',
          label: 'Ramy i ramki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/decoration/10789/?icid=itl|pl|menu|201712131549414959_76',
          label: 'Ramy Ĺcienne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/decoration/18746/?icid=itl|pl|menu|201712131549414959_77',
          label: 'Ramki na zdjÄcia'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/decoration/10788/?icid=itl|pl|menu|201712131549414959_78',
          label: 'Obrazy'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/decoration/10760/?icid=itl|pl|menu|201712131549414959_79',
          label: 'Ĺwieczniki i Ĺwiece'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/decoration/10760/?icid=itl|pl|menu|201712131549414959_80',
          label: 'Akcesoria do Ĺwiec'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/decoration/10768/?icid=itl|pl|menu|201712131549414959_81',
          label: 'RoĹliny, doniczki i stojaki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/decoration/10769/?icid=itl|pl|menu|201712131549414959_82',
          label: 'Wazony i miski'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/decoration/10759/?icid=itl|pl|menu|201712131549414959_83',
          label: 'Zegary'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/decoration/24924/?icid=itl|pl|menu|201712131549414959_84',
          label: 'Akcesoria dekoracyjne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/decoration/25227/?icid=itl|pl|menu|201712131549414959_85',
          label: 'ArtykuĹy papiernicze'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/outdoor/14972/?icid=itl|pl|menu|201712131549414959_86',
          label: 'OĹwietlenie zewnÄtrzne'
        }
      ]
    ];
    var study = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/20652/?icid=itl|pl|menu|201712131549414959_87',
          label: 'KrzesĹa biurowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/20649/?icid=itl|pl|menu|201712131549414959_88',
          label: 'Biurka'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/10712/?icid=itl|pl|menu|201712131549414959_89',
          label: 'Biurka - kombinacje blatĂłw i nĂłg'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/10711/?icid=itl|pl|menu|201712131549414959_90',
          label: 'Irish Scotch'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/20502/?icid=itl|pl|menu|201712131549414959_91',
          label: 'Ukrainian vodka'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/10398/?icid=itl|pl|menu|201712131549414959_92',
          label: 'Russian vodka'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/11465/?icid=itl|pl|menu|201712131549414959_93',
          label: 'Finlandian vodka'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/10382/?icid=itl|pl|menu|201712131549414959_94',
          label: 'Biblioteczki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/10385/?icid=itl|pl|menu|201712131549414959_95',
          label: 'Szafki biurowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/10551/?icid=itl|pl|menu|201712131549414959_96',
          label: 'Organizatory i pudeĹka'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/16215/?icid=itl|pl|menu|201712131549414959_97',
          label: 'Kosze na Ĺmieci'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/workspaces/16195-2/?icid=itl|pl|menu|201712131549414959_98',
          label: 'Okablowanie i organizacja'
        }
      ]
    ];
    var children = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/childrens_ikea/baby/?icid=itl|pl|menu|201712131549414959_99',
          label: 'Dzieci 0+'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/childrens_ikea/children/?icid=itl|pl|menu|201712131549414959_100',
          label: 'Dzieci 3+'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/childrens_ikea/children_8_12/?icid=itl|pl|menu|201712131549414959_101',
          label: 'Dzieci 8+'
        },
        {
          url: '//www.ikea.com/ms/pl_PL/nastolatki/itl|pl|menu|201712131549414959_102',
          label: 'Nastolatki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/childrens_ikea/18836/?icid=itl|pl|menu|201712131549414969_103',
          label: 'System przechowywania STUVA'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/childrens_ikea/19027/?icid=itl|pl|menu|201712131549414969_104',
          label: 'System przechowywania TROFAST'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/childrens_ikea/08265/?icid=itl|pl|menu|201712131549414969_105',
          label: 'BezpieczeĹstwo w domu PATRULL'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/childrens_ikea/18716/?icid=itl|pl|menu|201712131549414969_106',
          label: 'Zabawki dla dzieci 0+'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/childrens_ikea/18734/?icid=itl|pl|menu|201712131549414969_107',
          label: 'Zabawki dla dzieci 3+'
        }
      ]
    ];
    var wardrobes = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/29879/?icid=itl|pl|menu|201712131549414969_108',
          label: 'Szafy moduĹoweÂ PAX'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/19053/?icid=itl|pl|menu|201712131549414969_109',
          label: 'Szafy wolnostojÄce'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/10451/?icid=itl|pl|menu|201712131549414969_110',
          label: 'Komody'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/11466/?icid=itl|pl|menu|201712131549414969_111',
          label: 'System moduĹowy ALGOT'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/10456/?icid=itl|pl|menu|201712131549414969_112',
          label: 'Szafki na buty'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/10454/?icid=itl|pl|menu|201712131549414969_113',
          label: 'Wieszaki i pĂłĹki na buty'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/10455/?icid=itl|pl|menu|201712131549414969_114',
          label: 'Stojaki i wieszaki na ubrania'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/16274/?icid=itl|pl|menu|201712131549414969_115',
          label: 'Haczyki i wieszaki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/10452/?icid=itl|pl|menu|201712131549414969_116',
          label: 'Akcesoria do szaf'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/19059/?icid=itl|pl|menu|201712131549414969_117',
          label: 'Przechowywanie pod ĹĂłĹźkiem'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/10398/?icid=itl|pl|menu|201712131549414969_118',
          label: 'PĂłĹki Ĺcienne'
        }
      ]
    ];
    var beds = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/16284/?icid=itl|pl|menu|201712131549414969_119',
          label: 'ĹĂłĹźka podwĂłjne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/16285/?icid=itl|pl|menu|201712131549414969_120',
          label: 'ĹĂłĹźka pojedyncze'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/19037/?icid=itl|pl|menu|201712131549414969_121',
          label: 'LeĹźanki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/19039/?icid=itl|pl|menu|201712131549414969_122',
          label: 'ĹĂłĹźka na antresoli i piÄtrowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/Mattresses/?icid=itl|pl|menu|201712131549414969_123',
          label: 'Materace'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/19059/?icid=itl|pl|menu|201712131549414969_124',
          label: 'Przechowywanie pod ĹĂłĹźkiem'
        }
      ]
    ];
    var bathroom = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bathroom/20802/?icid=itl|pl|menu|201712131549414969_125',
          label: 'Meble Ĺazienkowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bathroom/20719/?icid=itl|pl|menu|201712131549414969_126',
          label: 'Szafki pod umywalkÄ'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bathroom/20723/?icid=itl|pl|menu|201712131549414969_127',
          label: 'Umywalki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bathroom/20724/?icid=itl|pl|menu|201712131549414969_128',
          label: 'Baterie do umywalek'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bathroom/20490/?icid=itl|pl|menu|201712131549414969_129',
          label: 'Lustra Ĺazienkowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bathroom/10736/?icid=itl|pl|menu|201712131549414969_130',
          label: 'OĹwietlenie Ĺazienkowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bathroom/10555/?icid=itl|pl|menu|201712131549414969_131',
          label: 'Akcesoria Ĺazienkowe'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bathroom/10650/?icid=itl|pl|menu|201712131549414969_132',
          label: 'Haki i uchwyty'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/Textiles/20520/?icid=itl|pl|menu|201712131549414969_133',
          label: 'RÄczniki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/Textiles/20519/?icid=itl|pl|menu|201712131549414969_134',
          label: 'Dywaniki Ĺazienkowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/Textiles/18908/?icid=itl|pl|menu|201712131549414969_135',
          label: 'ZasĹony prysznicowe'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/laundry/20601/?icid=itl|pl|menu|201712131549414969_136',
          label: 'Kosze na pranie'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/laundry/20602/?icid=itl|pl|menu|201712131549414969_137',
          label: 'Suszarki do prania'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/products/90312709/?icid=itl|pl|menu|201712131549414979_138',
          label: 'Pralka do zabudowy'
        }
      ]
    ];
    var cleaning = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/10456/?icid=itl|pl|menu|201712131549414979_139',
          label: 'Szafki na buty'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/10454/?icid=itl|pl|menu|201712131549414979_140',
          label: 'Wieszaki i pĂłĹki na buty'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/10455/?icid=itl|pl|menu|201712131549414979_141',
          label: 'Stojaki i wieszaki na ubrania'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/16274/?icid=itl|pl|menu|201712131549414979_142',
          label: 'Haczyki i wieszaki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/11466/?icid=itl|pl|menu|201712131549414979_143',
          label: 'System moduĹowy ALGOT'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/19053/?icid=itl|pl|menu|201712131549414979_144',
          label: 'Szafy do przedpokoju'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/20489/?icid=itl|pl|menu|201712131549414979_145',
          label: 'Lustra do przedpokoju'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/10398/?icid=itl|pl|menu|201712131549414979_146',
          label: 'PĂłĹki Ĺcienne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/hallway/22659/?icid=itl|pl|menu|201712131549414979_147',
          label: 'StoĹki do przedpokoju'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/bedroom/10451/?icid=itl|pl|menu|201712131549414979_148',
          label: 'Komody'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/laundry/20602/?icid=itl|pl|menu|201712131549414979_149',
          label: 'Suszarki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/laundry/20601/?icid=itl|pl|menu|201712131549414979_150',
          label: 'Kosze na pranie'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/laundry/20608/?icid=itl|pl|menu|201712131549414979_151',
          label: 'Deski do prasowania'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/living_room/10550/?icid=itl|pl|menu|201712131549414979_152',
          label: 'PudĹa, kosze i kartony'
        }
      ]
    ];
    var kitchen = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/series/36836/?icid=itl|pl|menu|201712131549414979_153',
          label: 'Gotowe kuchnie KNOXHULT'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/24254/?icid=itl|pl|menu|201712131549414979_154',
          label: 'Fronty kuchenne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/16298/?icid=itl|pl|menu|201712131549414979_155',
          label: 'GaĹki i uchwyty'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/19121/?icid=itl|pl|menu|201712131549414979_156',
          label: 'Panele Ĺcienne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/24264/?icid=itl|pl|menu|201712131549414979_157',
          label: 'Blaty kuchenne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/kitchen_int_lighting/?icid=itl|pl|menu|201712131549414979_158',
          label: 'OĹwietlenie kuchenne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/10471/?icid=itl|pl|menu|201712131549414979_159',
          label: 'Barki i wĂłzki kuchenne'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/24261/?icid=itl|pl|menu|201712131549414979_160',
          label: 'Baterie i zlewy kuchenne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/20810/?icid=itl|pl|menu|201712131549414979_161',
          label: 'Piekarniki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/20822/?icid=itl|pl|menu|201712131549414979_162',
          label: 'LodĂłwki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/20812/?icid=itl|pl|menu|201712131549414979_163',
          label: 'PĹyty grzewcze'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/20825/?icid=itl|pl|menu|201712131549414979_164',
          label: 'Zmywarki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/20815/?icid=itl|pl|menu|201712131549414979_165',
          label: 'Mikrofale'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/20819/?icid=itl|pl|menu|201712131549414979_166',
          label: 'Okapy'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/24257/?icid=itl|pl|menu|201712131549414979_167',
          label: 'WyposaĹźenie wewnÄtrzne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/20676/?icid=itl|pl|menu|201712131549414979_168',
          label: 'Przechowywanie na Ĺcianie'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/24259/?icid=itl|pl|menu|201712131549414979_169',
          label: 'Kosze na Ĺmieci'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/20611/?icid=itl|pl|menu|201712131549414979_170',
          label: 'Taborety i schodki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/16200/?icid=itl|pl|menu|201712131549414979_171',
          label: 'RegaĹy do spiĹźarni'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/?icid=itl|pl|menu|201712131549414979_172',
          label: 'Jak kupowaÄ kuchniÄ IKEA?'
        }
      ]
    ];

    var cooking = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/cooking/20633/?icid=itl|pl|menu|201712131549414979_173',
          label: 'Garnki i rondle'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/cooking/20624/?icid=itl|pl|menu|201712131549414989_174',
          label: 'Patelnie i woki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/cooking/31774/?icid=itl|pl|menu|201712131549414989_175',
          label: 'Zestawy naczyĹ kuchennych'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/cooking/20636/?icid=itl|pl|menu|201712131549414989_176',
          label: 'Przybory do pieczenia'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/cooking/22668/?icid=itl|pl|menu|201712131549414989_177',
          label: 'Naczynia Ĺźaroodporne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/cooking/20647/?icid=itl|pl|menu|201712131549414989_178',
          label: 'Przybory kuchenne'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/cooking/15934/?icid=itl|pl|menu|201712131549414989_179',
          label: 'NoĹźe i deski do krojenia'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/cooking/15937/?icid=itl|pl|menu|201712131549414989_180',
          label: 'Pojemniki na ĹźywnoĹÄ'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/cooking/15938/?icid=itl|pl|menu|201712131549414989_181',
          label: 'Akcesoria do mycia naczyĹ'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/cooking/18850/?icid=itl|pl|menu|201712131549414989_182',
          label: 'Ĺcierki kuchenne i fartuchy'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/eating/16043/?icid=itl|pl|menu|201712131549414989_183',
          label: 'Naczynia do serwowania potraw'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/eating/18860/?icid=itl|pl|menu|201712131549414989_184',
          label: 'Zastawa stoĹowa'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/eating/18865/?icid=itl|pl|menu|201712131549414989_185',
          label: 'SztuÄce'
        }
      ]
    ];

    var eating = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/eating/16043/?icid=itl|pl|menu|201712131549414989_186',
          label: 'Naczynia do serwowania potraw'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/eating/18860/?icid=itl|pl|menu|201712131549414989_187',
          label: 'Zastawa stoĹowa'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/eating/31781/?icid=itl|pl|menu|201712131549414989_188',
          label: 'Serwisy'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/eating/18865/?icid=itl|pl|menu|201712131549414989_189',
          label: 'SztuÄce'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/eating/16044/?icid=itl|pl|menu|201712131549414989_190',
          label: 'Kubki i filiĹźanki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/eating/18868/?icid=itl|pl|menu|201712131549414989_191',
          label: 'SzkĹo i dzbanki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/eating/20538/?icid=itl|pl|menu|201712131549414989_192',
          label: 'Obrusy, podkĹadki i bieĹźniki'
        }
      ],
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/eating/20560/?icid=itl|pl|menu|201712131549414989_193',
          label: 'Serwetniki i serwetki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/eating/20542/?icid=itl|pl|menu|201712131549414989_194',
          label: 'PodkĹadki na krzesĹa'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/food/?icid=itl|pl|menu|201712131549414989_195',
          label: 'Szwedzka ĹźywnoĹÄ'
        }
      ]
    ];

    var homeElectronics = [
      [{
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/home_electronics/36812/?icid=itl|pl|menu|201801231700087388_2',
          label: 'Inteligentne oĹwietlenie'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/home_electronics/40843/?icid=itl|pl|menu|201801231700087388_3',
          label: 'Akcesoria do telefonĂłw i tabletĂłw'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/home_electronics/40845/?icid=itl|pl|menu|201801231700087388_4',
          label: 'Przewody i Ĺadowarki'
        },
        {
          url: '//www.ikea.com/pl/pl/catalog/categories/departments/home_electronics/16292/?icid=itl|pl|menu|201801231700087388_5',
          label: 'NarzÄdzie i akcesoria do montaĹźu'
        }
      ]
    ];

    var banners = {
      textiles: {
        "color": "text-white",
        "link": "//www.ikea.com/pl/pl/catalog/products/50163773/?cid=iba|pl|menu_banners|201709131724447946_1",
        "image": "//www.ikea.com/ms/pl_PL/img/header/banner_dywany.jpg",
        "name": "IKEA HAND MADE",
        "category": "Very cool sofa",
        "price": "1899 UAH",
        "previousPrice": "2249 UAH",
        "nnc": "block"
      },
      beds: {
        "link": "//www.ikea.com/pl/pl/catalog/products/00318881/?cid=iba|pl|menu_banners|201709131725073963_1",
        "image": "//www.ikea.com/ms/pl_PL/img/header/banner_lozka.jpg",
        "name": "FYRESDAL",
        "category": "This is something...",
        "price": "3599 UAH",
        "previousPrice": "4649 UAH",
        "nnc": "block"
      },
      kitchen: {
        "link": "//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/?cid=iba|pl|menu_banners|201711071433246905_1",
        "image": "//www.ikea.com/ms/pl_PL/img/header/banner_raty_kuchnia_v3.jpg",
        "nnc": "none"
      },
      lightning: {
        "link": "//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/16282/",
        "image": "//api-ikea.pl/img/banners/baner_oswietlenie.jpg",
        "nnc": "none"
      },
      lightning: {
        "link": "//www.ikea.com/pl/pl/catalog/categories/departments/kitchen/16282/",
        "image": "//api-ikea.pl/img/banners/baner_oswietlenie.jpg",
        "nnc": "none"
      },
      sofas: {
        "link": "//www.ikea.com/pl/pl/zrob_miejsce_na_radosc/?cid=iba|pl|menu_banners|201711071433295819_2",
        "image": "//www.ikea.com/ms/pl_PL/img/header/IKEA_Fotele_banner_menu_promo_666x239.jpg",
        "nnc": "none"
      }
    };

    _this.insertLinks(quickLinksLeft, quickLinksListLeft, quickLinksTmpl);
    _this.insertLinks(quickLinksRight, quickLinksListRight, quickLinksTmpl);
    _this.insertLinks(navLinks, navList, navLinksTmpl);
    _this.mainHeader.find('#rooms-acc').append('<div class="acc-container"><div class="header-nav-sub-block acc-content"></div></div>');
    _this.mainHeader.find('#products-acc').append('<div class="acc-container"><div class="header-nav-sub-block acc-content">' +
      '<div class="row"></div><div class="left-side">' +
      '<ul class="header-nav-sublist"></ul>' +
      '<ul class="header-nav-additional"></ul>' +
      '</div>' +
      '</div></div>');

    var roomsList = _this.mainHeader.find('#rooms-acc .acc-content');
    _this.insertLinks(roomsLinks, roomsList, roomsTmpl);
    _this.generateBanners(banners, bannerTmpl);

    sofas = _this.generateProductList(sofas, productsTmpl);
    shelves = _this.generateProductList(shelves, productsTmpl);
    tables = _this.generateProductList(tables, productsTmpl);
    textiles = _this.generateProductList(textiles, productsTmpl);
    lightning = _this.generateProductList(lightning, productsTmpl);
    decoration = _this.generateProductList(decoration, productsTmpl);
    study = _this.generateProductList(study, productsTmpl);
    children = _this.generateProductList(children, productsTmpl);
    wardrobes = _this.generateProductList(wardrobes, productsTmpl);
    beds = _this.generateProductList(beds, productsTmpl);
    bathroom = _this.generateProductList(bathroom, productsTmpl);
    cleaning = _this.generateProductList(cleaning, productsTmpl);
    kitchen = _this.generateProductList(kitchen, productsTmpl);
    cooking = _this.generateProductList(cooking, productsTmpl);
    eating = _this.generateProductList(eating, productsTmpl);
    homeElectronics = _this.generateProductList(homeElectronics, productsTmpl);

    var productsCategories = [{
        label: 'Sofas',
        products: sofas,
        banner: banners.sofas
      },
      {
        label: 'Shelves',
        products: shelves
      },
      {
        label: 'Tables',
        products: tables,
        banner: banners.tables
      },
      {
        label: 'Textiles',
        products: textiles,
        banner: banners.textiles
      },
      {
        label: 'Lightning',
        products: lightning,
        banner: banners.lightning
      },
      {
        label: 'Decoration',
        products: decoration
      },
      {
        label: 'Study',
        products: study
      },
      {
        label: 'IKEA for children',
        products: children
      },
      {
        label: 'Wardrobes',
        products: wardrobes
      },
      {
        label: 'Beds',
        products: beds,
        banner: banners.beds
      },
      {
        label: 'Bathroom',
        products: bathroom
      },
      {
        label: 'Cleaning',
        products: cleaning
      },
      {
        label: 'Kitchen',
        products: kitchen
      },
      {
        label: 'Cooking',
        products: cooking
      },
      {
        label: 'Eating',
        products: eating
      },
      {
        label: 'Home electronics',
        products: homeElectronics
      },
      {
        label: 'Any questions else?',
        url: '//www.ikea.com/pl/pl/energia-sloneczna-dla-domu/index.html?icid=itl|pl|menu|201712131549414989_196'
      }
    ];

    var additional = [{
        url: '//www.ikea.com/ms/pl_PL/nnc/',
        label: 'HOT PRICES'
      },
      {
        url: '//www.ikea.com/pl/pl/catalog/news/departments/',
        label: 'NEWS'
      },
      {
        url: '//www.ikea.com/pl/pl/ofertylokalne/index.html',
        label: 'SOMETHING INTERESTING'
      }
    ];

    _this.insertLinks(productsCategories, _this.mainHeader.find('.header-nav-sublist'), productsCategoriesTmpl);
    _this.insertLinks(additional, _this.mainHeader.find('.header-nav-additional'), productsTmpl);
  };

  replaceMenu.prototype.insertLinks = function(links, list, template) {
    links.each(function(el) {
      list.append(template.evaluate(el));
    });
  };

  replaceMenu.prototype.generateProductList = function(links, template) {
    var productListHTML = '',
      _this = this;

    links.each(function(el) {
      var productList = [];
      _this.listIndex += 1;

      el.each(function(single, item) {
        single.id = item + 1;
        productList.push(template.evaluate(single));
      });
      productListHTML += '<div class="col-3"><ul class="product-list-' + _this.listIndex + '">' + productList.join('') + '</ul></div>';
    });

    return productListHTML;
  };

  replaceMenu.prototype.generateBanners = function(banners, template) {
    for (let banner in banners) {
      if (banners.hasOwnProperty(banner)) {
        banners[banner] = template.evaluate(banners[banner]);
      }
    }
  };

  replaceMenu.prototype.insertHeaderScripts = function() {
    $$('body')[0].insert({
      bottom: new Element('script', {
        type: 'text/javascript',
        src: '//www.ikea.com/ms/pl_PL/js/homepage-scripts27.js'
      })
    });
    $$('body')[0].insert({
      bottom: new Element('script', {
        type: 'text/javascript',
        src: '//www.ikea.com/ms/pl_PL/js/header-cart9.js'
      })
    });
  };


  documentready(function() {
    if (document.getElementById('topMenu')) {
      new replaceMenu();
    }
  });

})(window, document, undefined);
