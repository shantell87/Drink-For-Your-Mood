// **** A Drink For Your Mood ****
var slider = "";

// *** Birthday Page Confirmation ***
$(document).ready(function() {

    // on click function for submit
    $('#submit-birthday').on('click', function() {
        // variable for user inputted date
        var date = $('#picker').val();
        console.log("date.valueOF(): " + date.valueOf());
        console.log("moment of: " + moment(date).valueOf())

        // chosen date to unix
        var chosenDate = moment(date).valueOf()

        // variable for todays date
        var today = parseInt(moment().valueOf());
        console.log("today: " + today);

        // Getting age by subracting today from chosen date
        console.log("Age: " + parseInt(today - chosenDate));

        var ofAge = parseInt(today - chosenDate)
            // if statement for date entered
        if (ofAge >= 662256000000) {
            // if 21+ proceed to next page
            console.log("Let's Drink!")
        } else {
            // else denied!
            console.log("NOPE! Rejected");
        }
    })

});

// *** Description of Service & Slider page ***
$(document).ready(function() {
    $('.form-control-range').on('input', function () {
        var output = parseInt($('.form-control-range').val());
        if(output <= 14) { 
            $('.reader').text("Sad");
            slider = "sad";
        }if((output > 14) && (output <= 28)) { 
            $('.reader').text("Angry");
            slider = "angry";
        }if((output > 28) && (output <= 42)) { 
            $('.reader').text("Afraid");
            slider = "afraid";
        }if((output > 42) && (output <= 56)) { 
            $('.reader').text("Neutral");
            slider = "neutral";
        }if((output > 56) && (output <= 70)) { 
            $('.reader').text("Anxious");
            slider = "anxious";
        }if((output > 70) && (output <= 84)) { 
            $('.reader').text("Surprised");
            slider = "surprised";
        }if((output > 84) && (output <= 100)) { 
            $('.reader').text("Happy");
            slider = "happy";
        };

    })    
    
    $('#submit-slider').on('click', function(){
        if((slider === "sad") || (slider === "angry") || (slider === "afraid") || (slider === "neutral") || (slider === "anxious") || (slider === "surprised") || (slider === "happy")) {
            window.location = "wireframe3.html";
        }else{
            $('.reader').text("Please adjust slider ");
        }
    })   

    // if accepted can proceed to evaluation & drink recommendation page after inputtnig slider info
    
    // else will proceed to drink recommendation page after slider page instead of face ++
})

// *** Evaluation & Drink Recommendation page ***
$(document).ready(function() {
    // object for 50 different drink options
    
    //Check if browser supports camera use
    // if statement for acceptance of camera use
    const supported = 'mediaDevices' in navigator;

    const constraints = { "video": { width: { exact: 320 } } };
    // var videoTag = $('#video-tag');
    // var imageTag = $('#image-tag');
    var zoomSlider = $("#zoom-slider");
    var zoomSliderValue = $("#zoom-slider-value");
    var imageCapturer;
    const videoTag = document.querySelector('#video-tag');
    const imageTag = document.querySelector('#image-tag');

    $('#start').on('click', function start() {
        console.log("HELLO");
        navigator.mediaDevices.getUserMedia(constraints)
            .then(gotMedia)
            .catch(e => { console.error('getUserMedia() failed: ', e); });
    })

    function gotMedia(mediastream) {
        // console.log(videoTag);

        videoTag.srcObject = mediastream;

        $('#start').disabled = true;

        var videoTrack = mediastream.getVideoTracks()[0];
        imageCapturer = new ImageCapture(videoTrack);

        // Timeout needed in Chrome, see https://crbug.com/711524
        setTimeout(() => {
            const capabilities = videoTrack.getCapabilities()
                // Check whether zoom is supported or not.
            if (!capabilities.zoom) {
                return;
            }

            zoomSlider.min = capabilities.zoom.min;
            zoomSlider.max = capabilities.zoom.max;
            zoomSlider.step = capabilities.zoom.step;

            zoomSlider.value = zoomSliderValue.value = videoTrack.getSettings().zoom;
            zoomSliderValue.value = zoomSlider.value;

            zoomSlider.oninput = function() {
                zoomSliderValue.value = zoomSlider.value;
                videoTrack.applyConstraints({ advanced: [{ zoom: zoomSlider.value }] });
            }
        }, 500);

    }

    $('#takePhoto').on('click', function takePhoto() {
        // console.log("clicked");
        imageCapturer.takePhoto()
            .then((blob) => {
                console.log("Photo taken: " + blob.type + ", " + blob.size + "B")
                imageTag.src = URL.createObjectURL(blob);

                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    let base64data = reader.result;
                    console.log(base64data);


                    var queryURL = `https://api-us.faceplusplus.com/facepp/v3/detect?image_base64=${base64data}&api_key=XtvBZyeUXRy0uOEtl1mlG61af7JzBlIj&api_secret=tYNC1LAnUmHhUw_1IXhLLyKJXcZRHuvo`

                    $.ajax({
                            // passing object through ajax
                            url: 'https://api-us.faceplusplus.com/facepp/v3/detect',
                            method: "POST",
                            data: {
                                api_key: 'XtvBZyeUXRy0uOEtl1mlG61af7JzBlIj',
                                api_secret: 'tYNC1LAnUmHhUw_1IXhLLyKJXcZRHuvo',
                                image_base64: base64data,
                                return_attributes: 'gender,age,emotion'
                            }
                        })
                        .then(function(response) {
                            console.log(`FACE++:`, response);
                        })
                        .catch(e => {
                            console.log(e);
                        })
                        // console.log(URL.createObjectURL(blob));

                }
            })
            .catch(e => {
                console.error("takePhoto() failed: ", e);
            });
    })
});


// run through face ++ api



// variable for query URL

// AJAX call using query url and photo
var queryURL = `https://api-us.faceplusplus.com/facepp/v3/face/analyze&api_key=XtvBZyeUXRy0uOEtl1mlG61af7JzBlIj&api_secret=tYNC1LAnUmHhUw_1IXhLLyKJXcZRHuvo`

// then response function

// pull user slider input from previous page

// pull face ++ results

// compare face ++ results & slider results

// If first slider chosen and Face++ reads, then recommend:

// Slider: Sadness	Face++: Sadness	    Cocktail Reco: Whiskey Sour
// Slider: Anger	Face++: Sadness	    Cocktail Reco: Mulled Wine
// Slider: Angst	Face++: Sadness	    Cocktail Reco: Tequila Slammer
// Slider: Fear	    Face++: Sadness	    Cocktail Reco: Grass Skirt
// Slider: Neutral	Face++: Sadness	    Cocktail Reco: Mimosa
// Slider: Surprise	Face++: Sadness	    Cocktail Reco: Mudslinger
// Slider: Happiness	Face++: Sadness	    Cocktail Reco: Cosmopolitan
// Slider: Sad	    Face++: Anger	Cocktail Reco: Blue Lagoon
// Slider: Anger	Face++: Anger	Cocktail Reco: Tequila Surprise
// Slider: Angst	Face++: Anger	Cocktail Reco: Creme de Menthe
// Slider: Fear	    Face++: Anger	Cocktail Reco: Big Red
// Slider: Neutral	Face++: Anger	Cocktail Reco: The Jimmy Conway
// Slider: Surprise	Face++: Anger	Cocktail Reco: Mother's Milk
// Slider: Happiness	Face++: Anger	Cocktail Reco: Jackhammer
// Slider: Sad	    Face++: Disgust	    Cocktail Reco: B-52
// Slider: Anger	Face++: Disgust	    Cocktail Reco: Thriller
// Slider: Angst	Face++: Disgust	    Cocktail Reco: Mojito
// Slider: Fear	    Face++: Disgust	    Cocktail Reco: Bloody Mary
// Slider: Neutral	Face++: Disgust	    Cocktail Reco: Penicillin
// Slider: Surprise	Face++: Disgust	    Cocktail Reco: Pink Lady
// Slider: Happiness	Face++: Disgust	    Cocktail Reco: Belgian Blue
// Slider: Sad	    Face++: Fear	Cocktail Reco: Coke and Drops
// Slider: Anger	Face++: Fear	Cocktail Reco: Dirty Martini
// Slider: Angst	Face++: Fear	Cocktail Reco: Berry Deadly
// Slider: Fear	    Face++: Fear	Cocktail Reco: Martini
// Slider: Neutral	Face++: Fear	Cocktail Reco: Gin And Tonic
// Slider: Surprise	Face++: Fear	Cocktail Reco: Jello Shots
// Slider: Happiness	Face++: Fear	Cocktail Reco: Paloma
// Slider: Sad	    Face++: Neutral	    Cocktail Reco: Vesuvio
// Slider: Anger	Face++: Neutral	    Cocktail Reco: Zippy's Revenge
// Slider: Angst	Face++: Neutral	    Cocktail Reco: Pina Colada
// Slider: Fear	    Face++: Neutral	    Cocktail Reco: Zinger
// Slider: Neutral	Face++: Neutral	    Cocktail Reco: Old Fashioned
// Slider: Surprise	Face++: Neutral	    Cocktail Reco: Bellini
// Slider: Happiness	Face++: Neutral	    Cocktail Reco: Strawberry Daiquiri
// Slider: Sad	    Face++: Surprise	Cocktail Reco: Brain Fart
// Slider: Anger	Face++: Surprise	Cocktail Reco: Gimlet
// Slider: Angst	Face++: Surprise	Cocktail Reco: Paradise
// Slider: Fear	    Face++: Surprise	Cocktail Reco: Zenmeister
// Slider: Neutral	Face++: Surprise	Cocktail Reco: Boulevardier
// Slider: Surprise	Face++: Surprise	Cocktail Reco: Pisco Sour
// Slider: Happiness	Face++: Surprise	Cocktail Reco: Ipamena
// Slider: Sad	    Face++: Happiness	Cocktail Reco: Negroni
// Slider: Anger	Face++: Happiness	Cocktail Reco: Manhattan
// Slider: Angst	Face++: Happiness	Cocktail Reco: Vesper 
// Slider: Fear	    Face++: Happiness	Cocktail Reco: Flaming Lamborghini
// Slider: Neutral	Face++: Happiness	Cocktail Reco: Yellow Bird
// Slider: Surprise	Face++: Happiness	Cocktail Reco: Moscow Mule
// Slider: Happiness	Face++: Happiness	Cocktail Reco: Margarita

// SECONDARY - pull weather from weather api for the decision

// if statement with accepted camera permissions

// if accepted, use face ++ & weather to come up with drink recommendation


// else give drink recommendation based on slider

// // DISPLAY 

// var queryURL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinks}`;

// $.ajax({
//     url: queryURL,
//     method: "GET"
// }).then(function(response) {
//     console.log(`Drinks Data: ${response}`);
// });

// picture of drink in the html
// ingredients
// instructions

// *** About Us & Contact Page ***

// Contact us store the user inputs in a database?