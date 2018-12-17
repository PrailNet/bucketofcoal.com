/* global Stripe */

import $ from 'jquery'
import 'jquery.easing'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '../scss/coal.scss'

// Smooth scrolling using jQuery easing
$('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
  if (
    window.location.pathname.replace(/^\//, '') ===
      this.pathname.replace(/^\//, '') &&
    window.location.hostname === this.hostname
  ) {
    let target = $(this.hash)
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
$('.js-scroll-trigger').click(() => {
  $('.navbar-collapse').collapse('hide')
})

// Activate scrollspy to add active class to navbar items on scroll
$('body').scrollspy({
  target: '#mainNav',
  offset: 100
})

// Collapse Navbar
const navbarCollapse = () => {
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

const stripe = Stripe('pk_live_qqoVVEdeWc49isA4t568IDqL', {
  betas: ['checkout_beta_4']
})

$('#orderForm').submit(event => {
  event.preventDefault()

  const size = $('#size').val()

  stripe
    .redirectToCheckout({
      items: [{ sku: size, quantity: 1 }],
      successUrl: 'https://bucketofcoal.com/success',
      cancelUrl: 'https://bucketofcoal.com/canceled'
    })
    .then(result => {
      if (result.error) {
        const displayError = document.getElementById('error-message')
        displayError.textContent = result.error.message
      }
    })
})
