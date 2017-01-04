// fb3-craft js

//=include "../bower_components/jquery/dist/jquery.js"
//=include "../bower_components/jquery.fitvids/jquery.fitvids.js"
//=include "../bower_components/velocity/velocity.min.js"
//=include "../bower_components/imagesloaded/imagesloaded.pkgd.min.js"
// include "../bower_components/vanilla-lazyload/dist/lazyload.min.js"
//=include "../bower_components/jquery_lazyload/jquery.lazyload.js"
//=include "../bower_components/waypoints/lib/jquery.waypoints.js"
//=include "../bower_components/jquery-validation/dist/jquery.validate.js"

$.gdgr = $.gdgr || {};

// good design for good reason for good namespace
$.gdgr.main = (function() {

  var screenWidth = 0,
      desktop = false,
      handheld = false,
      tablet = false,
      adminStatus = false,
      isAnimating = false,
      cart,
      stripeCheckout;

  function _init() {
    $('#flash').hide().css('visibility','visible').fadeIn();

    // remove useless alt tooltips
    $('img').each(function () {
      if (!$(this).attr('title')) {
        $(this).attr('title', '');
      }
    });

    // Localstorage cart
    cart = Modernizr.localstorage && localStorage.getItem('Fb.cart') ? JSON.parse(localStorage.getItem('Fb.cart')) : {items:[],shipping:{}};
    $('.cart').toggleClass('cart-active', cart.length>0);

    // responsive videos
    $('.summary.user-content, .content').fitVids();

    // lazyload images
    _initLazyload();

    // Keyboard nerds rejoice
    $(document).keyup(function(e) {
      if (e.keyCode == 27) {
        _hideSidebar();
      }
    });

    // Scroll down to hash afer page load
    // $(window).load(function() {
    //   if (window.location.hash) {
    //     var el = $(window.location.hash);
    //     if (el.length) _scrollBody(el);
    //   }
    // });

    // Homepage
    if ($('#work-page.index').length) {
      _scrollToFilters();
      // SEO useless filter header
      var filterHeader = $('<div class="filter-header">Filter:<p><span class="filter"></span> </p></div>').prependTo('#page .portfolio');
      $('<button type="button" class="tcon tcon-no-animate tcon-menu--xcross xcross-open xcross-small" aria-label="remove project filter"><span class="tcon-menu__lines" aria-hidden="true"></span><span class="tcon-visuallyhidden">remove project filter</span></button>')
      .appendTo(filterHeader.find('p')).on('click', function(e) {
        e.preventDefault();
        $('#filters .show-all a').trigger('click');
      });
    }

    // Products
    if ($('#store-page').length) {
      _initProducts();
    }

    _resize();
    _newsletterInit();
    _transformicions();
    _sidebarToggle();
    _sidebarColors();
    _scrollToContact();
    _hideHeader();
    _initFilterNav();
    _initSmoothScroll();
  };

  function _newsletterInit() {
    // ajaxify all newsletter signup forms
    $('form.newsletter').each(function() {
      var $form = $(this);
      $form.on('submit', function(e) {
        e.preventDefault();
        if ($form.find('input[name=EMAIL]').val()=='') {
          $form.find('label.status').addClass('error').text('Error: Please enter an email.');
        } else {
          $.getJSON($form.attr('action'), $form.serialize())
            .done(function(data) {
              if (data.result != 'success') {
                if (data.msg.match(/already subscribed/)) {
                  $form.find('label.status').addClass('error').text('Error: You are already subscribed to our newsletter.');
                } else {
                  $form.find('label.status').addClass('error').text('Error: ' + data.msg);
                }
              } else {
                $form.find('label.status').removeClass('error').addClass('success').text("Success: " + data.msg);
              }
            })
            .fail(function() {
              $form.find('label.status').addClass('error').text('Error: There was an error subscribing. Please try again.');
            });
        }
      });
    });
  }

  function _scrollBody(element, duration, delay) {
    // var headerHeight = $('.site-header').outerHeight();
    _hideHeader();
    var headerHeight = 0;
    isAnimating = true;
    element.velocity("scroll", {
      duration: duration,
      delay: delay,
      offset: -headerHeight,
      complete: function(elements) {
        isAnimating = false;
      }
    }, "easeOutSine");
  }

  function _transformicions() {
    $('.tcon:not(.tcon-no-animate)').on('click', function(e) {
      e.preventDefault();
      $(this).toggleClass('tcon-transform');
    });
  }

  function _sidebarToggle() {
    $('html').on('click', '.menu-toggle', function() {
      $('#side').toggleClass('open');
      $('body, #page, .site-header, .site-footer').toggleClass('sidebar-open');
    });

    $('html').on('click', '.project-side-toggle', function() {
      $('#project-side').toggleClass('open');

      // init lazyload images in sidebar if not already done
      if (!$('#project-side').hasClass('lazy-loaded')) {
        $('.lazy-side').lazyload({
          container : $('#project-side .projects'),
          effect : 'fadeIn',
        });
        $('#project-side').addClass('lazy-loaded')
      }

      $('body, #page, .site-header, .site-footer').toggleClass('project-side-open');
    });

    // Close sidebar when clicking away
    $('html').on('click', '#page.sidebar-open, .site-footer.sidebar-open, #page.project-side-open, .site-footer.project-side-open', function(e) {
      if (!$(e.target).is('a, a > *,button,input')) {
        e.preventDefault();
        _hideSidebar();
      } else {
        return e;
      }
    });
  }

  function _hideSidebar() {
    $('#side,#project-side').removeClass('open');
    $('.sidebar-open').removeClass('sidebar-open');
    $('.project-side-open').removeClass('project-side-open');
  }

  function _showSidebar() {
    if (!$('#side').is('.open')) {
      $('#side').addClass('open');
      $('body, #page, .site-header, .site-footer').addClass('sidebar-open');
    }
  }

  function _sidebarColors() {
    $('.site-nav a').hover(function() {
      color = $(this).attr('data-color');
      $('#side').addClass('color-' + color);
    }, function() {
      $('#side').removeClass('color-' + color);
    });
  }

  function _initSmoothScroll() {
    $('#wrapper').on('click', '.smoothscroll a', function(e){
      e.preventDefault();
      var el = $( $(this).attr('href') );
      if (el.length) _scrollBody(el);
    });
  }

  function _scrollToContact() {
    $('.nav-contact a').on('click', function(e) {
      e.preventDefault();
       _hideSidebar();
       _scrollBody($('#contact'), 250, 250);
       $('body').addClass('focus-contact');
       setTimeout(function() {
         $('body').removeClass('focus-contact');
       }, 1500);
    });
  }

  function _scrollToFilters() {
    // When clicking on a filter, scroll to top of grid
    $('#filters a').on('click', function() {
      _scrollBody($('#page .projects'), 250, 0);
    });
  }

  function _hideHeader() {
    // Hide Header on on scroll down
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('.site-header').outerHeight();

    $(window).scroll(function(event){
        didScroll = true;
    });

    setInterval(function() {
        if (!isAnimating && didScroll) {
            _hasScrolled();
            didScroll = false;
        }
    }, 250);

    function _hasScrolled() {
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight){
            // Scroll Down
            $('.site-header').removeClass('nav-down').addClass('nav-up');
        } else {
            // Scroll Up
            if(st + $(window).height() < $(document).height()) {
                $('header').removeClass('nav-up').addClass('nav-down');
            } else if (st < navbarHeight) {
              $('.site-header').removeClass('-fixed');
            }
        }

        lastScrollTop = st;
    }
  }

  function _initFilterNav() {
    if ($('.filter-items li').length>0) {
      // init filtering
      $('#filters a').click(function(e) {
        e.preventDefault();
        if ($(this).hasClass('selected')) {
          $('#filters .show-all a').trigger('click');
        } else {
          var filter = $(this).attr('data-filter');
          _filterProjects(filter);
          window.location.hash = '#' + filter;
        }
        return false;
      });
      // initial filter?
      if (window.location.hash) {
        var filter = window.location.hash.replace('#','');
        _filterProjects(filter);
        // make sure images are shown after filtering
        $('.lazy').trigger('appear');
      }
    }
  }

  function _initLazyload() {
    $('.lazy').attr('title','').lazyload({
      effect : 'fadeIn',
      threshold: 1500
    });
  }

  function _filterProjects(filter) {
    // highlight filter in nav
    $('#filters a').removeClass('selected');

    var activeFilter = $('#filters a[data-filter="'+filter+'"]');
    activeFilter.addClass('selected');
    if (filter != '') {
      $('.filter-header').addClass('active').find('.filter').html(activeFilter.html());
    } else {
      $('.filter-header').removeClass('active');
    }

    // dim all projects not matching filter
    $('.filter-items li').each(function() {
      if (filter=='' || $(this).attr('data-industry').match(filter) || $(this).attr('data-services').match(filter)) {
        $(this).removeClass('dim').addClass('selected');
      } else {
        $(this).removeClass('selected').addClass('dim');
      }
    });

    // if on mobile, slide out nav after clicking
    if (handheld) {
      _hideSidebar();
    }
  }

  function _resize() {
    screenWidth = document.documentElement.clientWidth;
    giant_desktop = screenWidth > 1382;
    desktop = screenWidth > 767;
    handheld = screenWidth < 481;
    tablet = !desktop && !handheld;
  }

  function _initProducts() {
    // Add to Cart buttons
    $(document).on('click', '.add-to-cart', function() {
      _addToCart({
        title: $(this).attr('data-title'),
        price: $(this).attr('data-price'),
        stripe_product_id: $(this).attr('data-stripe-product-id'),
        weight: $(this).attr('data-weight'),
        'quantity': 1,
        id: $(this).attr('data-id')
      });
    });

    stripeCheckout = StripeCheckout.configure({
      key: $('form.cart-wrap').attr('data-stripe-publishable-key'),
      image: '/assets/images/checkout-logo.png',
      locale: 'auto',
      token: function(token) {
        console.log(token);
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
      }
    });

    // Delete cart items
    $(document).on('click', '.cart .delete', function() {
      _removeFromCart($(this).attr('data-id'));
    });

    // Quantity fields
    $(document).on('keydown', '.cart .quantity input', function(e) {
      if (e.keyCode==13) {
        e.preventDefault();
        _updateCartQuantities();
      }
    }).on('change', '.cart .quantity input', function() {
      _updateCartQuantities();
    });

    // Checkout button
    $(document).on('click', '.cart button.checkout', function(e) {
      _checkoutCart(e);
    });
    _showCart("Don't show the sidebar, man, we're just, like, init'ing the cart.");
  }

  // Add item to cart
  function _addToCart(product) {
    var exists = $.grep(cart.items, function(obj) {
      return obj.title === product.title;
    });
    if (!exists.length) {
      cart.items.push(product);
    } else {
      exists[0].quantity +=1;
    }
    _saveCart();
    _showCart();
  }
  // Remove item from cart
  function _removeFromCart(id) {
    cart.items.splice(id,1);
    _saveCart();
    _showCart();
  }
  // Save cart if localStorage
  function _saveCart() {
    if (Modernizr.localstorage) {
      localStorage.setItem('Fb.cart', JSON.stringify(cart));
    }
  }
  // Update all cart quantities
  function _updateCartQuantities() {
    var quantity, id;
    $('.cart-items li.line-item').each(function() {
      quantity = parseInt($(this).find('.quantity input').val());
      id = $(this).attr('data-id');
      if (quantity > 0) {
        cart.items[id].quantity = quantity;
      } else {
        cart.items.splice(id,1);
      }
    });
    _saveCart();
    _showCart();
  }
  // Build cart in DOM from cart object
  function _showCart(no_open_sidebar) {
    var cost = 0,
        total = 0,
        html = '';
    cart.shipping.cost = 6;
    $('.cart-items').empty();
    // Loop through cart items and build rudimentary HTML cart
    if (cart.items.length) {
      $('.cart').addClass('cart-active').removeClass('loading').find('button.checkout').text('Checkout');
      for (var i = 0; i < cart.items.length; i++) {
        cost = cart.items[i].quantity * parseFloat(cart.items[i].price);
        $('<li class="line-item" data-stripe-product-id="' + cart.items[i].stripe_product_id + '" data-id="' + i + '"><div class="item">' + cart.items[i].title + '</div> <div class="price">$' + cost + '</div> ' +
          '<div class="quantity"><span>Qty:</span> <input type="text" size="2" value="' + cart.items[i].quantity + '" tabindex="' + (i+1) + '"></div>' +
          '<div class="delete-link"><a href="#" class="delete" data-id="' + i + '">Remove</a></div></li>')
        .appendTo('.cart-items');
        total += cost;
      }
      total += cart.shipping.cost;
      $('<li class="cart-shipping active" data-cost="6">Shipping: $6 USA <span style="opacity:.5">$30 INT\'L</span></li>').appendTo('.cart-items');
      $('<li class="cart-total">Total: $' + total + '</li>').appendTo('.cart-items');
      if (typeof no_open_sidebar === 'undefined') {
        _showSidebar();
      }
    } else {
      $('.cart').removeClass('cart-active');
    }
  }
  // Build PayPal form and submit checkout
  function _checkoutCart(e) {
    // Open Checkout with further options:
    stripeCheckout.open({
      name: 'Firebelly Checkout',
      // description: 'Shop',
      amount: 2000,
      shippingAddress: true
    });
    e.preventDefault();

    // var $form = $('form.cart-wrap');
    // for(var i = 0; i < cart.length; ++i) {
    //   $("<input type='hidden' name='quantity_" + (i+1) + "' value='" + cart.items[i].quantity + "'>" +
    //     "<input type='hidden' name='item_name_" + (i+1) + "' value='" + cart.items[i].title + "'>" +
    //     "<input type='hidden' name='item_weight_" + (i+1) + "' value='" + cart.items[i].weight + "'>" +
    //     "<input type='hidden' name='item_number_" + (i+1) + "' value='nb-" + cart.items[i].id + "'>" +
    //     "<input type='hidden' name='amount_" + (i+1) + "' value='" + cart.items[i].price + "'>")
    //   .appendTo($form);
    // }
    // // PayPal so stinkin' slow
    // $('.cart').addClass('loading').find('button.checkout').text('Contacting PayPal...').prop('disabled', true);
    // setTimeout(function() {
    //   $form.submit();
    // }, 150);
  }

  return {
    init: _init,
    resize: _resize,
    showSidebar: _showSidebar
  };

})();

// fire up the mothership
$(window).ready(function() {
  $.gdgr.main.init();
});

$(window).resize(function(){
  $.gdgr.main.resize();
});
