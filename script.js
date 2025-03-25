$(document).ready(function() {
    // Mobile menu toggle
    $('.menu-toggle').click(function() {
        $('.nav-menu').toggleClass('active');
    });

    // Custom amount toggle
    $('#amount-other').change(function() {
        if ($(this).is(':checked')) {
            $('.custom-amount').show();
            $('#custom-amount').focus();
        } else {
            $('.custom-amount').hide();
        }
    });

    // Payment method toggle
    $('input[name="payment-method"]').change(function() {
        const selectedMethod = $(this).val();

        // Hide all payment fields
        $('#card-payment-fields').slideUp();
        $('.mobile-money-options').hide();
        $('.bank-transfer-info').hide();

        // Show fields based on selected payment method
        if (selectedMethod === 'card') {
            $('#card-payment-fields').slideDown();
        } else if (selectedMethod === 'mobile-money') {
            $('.mobile-money-options').show();
        } else if (selectedMethod === 'bank-transfer') {
            $('.bank-transfer-info').show();
        }
    });

    // FAQ accordion
    $('.faq-question').click(function() {
        $(this).parent().toggleClass('active');
        $(this).parent().find('.faq-answer').slideToggle();
        if ($(this).parent().hasClass('active')) {
            $(this).find('.faq-toggle i').removeClass('fa-plus').addClass('fa-minus');
        } else {
            $(this).find('.faq-toggle i').removeClass('fa-minus').addClass('fa-plus');
        }
    });

    // Impact stories slider
    let currentSlide = 0;
    const slides = $('.story-slide');
    const dots = $('.dot');
    const slideCount = slides.length;

    // Initialize slider
    updateSlider();

    // Next slide button
    $('.slider-next').click(function() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    });

    // Previous slide button
    $('.slider-prev').click(function() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlider();
    });

    // Dot navigation
    $('.dot').click(function() {
        currentSlide = $(this).index();
        updateSlider();
    });

    function updateSlider() {
        slides.hide();
        $(slides[currentSlide]).fadeIn();
        dots.removeClass('active');
        $(dots[currentSlide]).addClass('active');
    }

    // Form validation
    $('#donation-form').submit(function(e) {
        e.preventDefault();
        let isValid = true;
        const requiredFields = $(this).find('[required]');
        $('.error-message').remove();
        $('input, select').removeClass('error');

        // Check required fields
        requiredFields.each(function() {
            if ($(this).val() === '') {
                isValid = false;
                $(this).addClass('error');
                $(this).parent().append('<p class="error-message">This field is required</p>');
            }
        });

        // Custom amount validation
        if ($('#amount-other').is(':checked') && ($('#custom-amount').val() === '' || parseFloat($('#custom-amount').val()) <= 0)) {
            isValid = false;
            $('#custom-amount').addClass('error');
            $('#custom-amount').parent().append('<p class="error-message">Please enter a valid amount</p>');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailField = $('#email');
        if (emailField.val() !== '' && !emailRegex.test(emailField.val())) {
            isValid = false;
            emailField.addClass('error');
            emailField.parent().append('<p class="error-message">Please enter a valid email address</p>');
        }

        // Credit card validation if card payment selected
        if ($('#method-card').is(':checked')) {
            const cardNumberField = $('#card-number');
            const cardNumber = cardNumberField.val().replace(/\s/g, '');
            if (!/^\d+$/.test(cardNumber) || cardNumber.length < 13 || cardNumber.length > 19) {
                isValid = false;
                cardNumberField.addClass('error');
                cardNumberField.parent().append('<p class="error-message">Please enter a valid card number</p>');
            }

            const expiryField = $('#expiry-date');
            const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
            if (!expiryRegex.test(expiryField.val())) {
                isValid = false;
                expiryField.addClass('error');
                expiryField.parent().append('<p class="error-message">Please enter a valid expiry date (MM/YY)</p>');
            } else {
                const expParts = expiryField.val().split('/');
                const expMonth = parseInt(expParts[0]);
                const expYear = parseInt('20' + expParts[1]);
                const today = new Date();
                const currentMonth = today.getMonth() + 1;
                const currentYear = today.getFullYear();
                if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                    isValid = false;
                    expiryField.addClass('error');
                    expiryField.parent().append('<p class="error-message">Card has expired</p>');
                }
            }

            const cvcField = $('#cvc');
            if (!/^\d{3,4}$/.test(cvcField.val())) {
                isValid = false;
                cvcField.addClass('error');
                cvcField.parent().append('<p class="error-message">Please enter a valid CVC (3-4 digits)</p>');
            }
        }

        // Mobile money validation
        if ($('#method-mobile-money').is(':checked')) {
            const mobileProvider = $('#mobile-money-provider');
            const mobileNumber = $('#mobile-number');
            if (mobileProvider.val() === '') {
                isValid = false;
                mobileProvider.addClass('error');
                mobileProvider.parent().append('<p class="error-message">Please select a mobile money provider</p>');
            }
            if (mobileNumber.val() === '') {
                isValid = false;
                mobileNumber.addClass('error');
                mobileNumber.parent().append('<p class="error-message">Please enter a valid mobile number</p>');
            }
        }

        // Bank transfer validation
        if ($('#method-bank-transfer').is(':checked')) {
            const proofOfPayment = $('#proof-of-payment');
            if (proofOfPayment.val() === '') {
                isValid = false;
                proofOfPayment.addClass('error');
                proofOfPayment.parent().append('<p class="error-message">Please upload proof of payment</p>');
            }
        }

        // If form is valid, show success message
        if (isValid) {
            let donationAmount = 0;
            if ($('#amount-other').is(':checked')) {
                donationAmount = parseFloat($('#custom-amount').val());
            } else {
                donationAmount = parseFloat($('input[name="amount"]:checked').val());
            }

            $(this).hide();
            $('.donation-form-container').append(`
                <div class="donation-success">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Thank You for Your Donation!</h2>
                    <p>Your $${donationAmount.toFixed(2)} donation to Horizon Foundation has been successfully processed.</p>
                    <p>A receipt has been sent to your email address.</p>
                    <p>Your support helps us create lasting change around the world.</p>
                    <a href="index.html" class="btn btn-primary">Return to Homepage</a>
                </div>
            `);

            $('html, body').animate({
                scrollTop: $('.donation-success').offset().top - 100
            }, 500);
        }
    });

    // Format credit card number with spaces
    $('#card-number').on('input', function() {
        let value = $(this).val().replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        $(this).val(formattedValue);
    });

    // Format expiry date as MM/YY
    $('#expiry-date').on('input', function() {
        let value = $(this).val().replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        $(this).val(value);
    });

    // Newsletter subscription in footer
    $('.newsletter-form').submit(function(e) {
        e.preventDefault();
        const emailInput = $(this).find('input[type="email"]');
        const emailValue = emailInput.val();
        if (emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            $(this).html('<p class="success-message">Thank you for subscribing!</p>');
        } else {
            emailInput.addClass('error');
            if ($(this).find('.error-message').length === 0) {
                $(this).append('<p class="error-message">Please enter a valid email</p>');
            }
        }
    });
});