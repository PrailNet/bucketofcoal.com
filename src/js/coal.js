/* global Stripe jQuery */

;(function ($) {
  'use strict' // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (
      window.location.pathname.replace(/^\//, '') ===
        this.pathname.replace(/^\//, '') &&
      window.location.hostname === this.hostname
    ) {
      var target = $(this.hash)
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']')
      if (target.length) {
        $('html, body').animate(
          {
            scrollTop: target.offset().top - 70
          },
          1000,
          'easeInOutExpo'
        )
        return false
      }
    }
  })

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function () {
    $('.navbar-collapse').collapse('hide')
  })

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 100
  })

  // Collapse Navbar
  var navbarCollapse = function () {
    if ($('#mainNav').offset().top > 100) {
      $('#mainNav').addClass('navbar-shrink')
    } else {
      $('#mainNav').removeClass('navbar-shrink')
    }
  }
  // Collapse now if page is not at top
  navbarCollapse()
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse)

  var stripe = Stripe('pk_live_qqoVVEdeWc49isA4t568IDqL', {
    betas: ['checkout_beta_4']
  })

  $('#orderForm').submit(function (event) {
    event.preventDefault()

    var size = $('#size').val()

    stripe
      .redirectToCheckout({
        items: [{ sku: size, quantity: 1 }],
        successUrl: 'https://bucketofcoal.com/success',
        cancelUrl: 'https://bucketofcoal.com/canceled'
      })
      .then(function (result) {
        if (result.error) {
          var displayError = document.getElementById('error-message')
          displayError.textContent = result.error.message
        }
      })
  })
})(jQuery) // End of use strict