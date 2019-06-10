// **** A Drink For Your Mood ****


// *** Birthday Page Confirmation ***
$(document).ready(function() {

    // on click function for submit
    $('#submit').on('click', function() {
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
    // if statement for acceptance of camera use

    // if accepted can proceed to evaluation & drink recommendation page after inputtnig slider info

    // else will proceed to drink recommendation page after slider page instead of face ++

});

// *** Evaluation & Drink Recommendation page ***
$(document).ready(function() {
    // object for 50 different drink options

    //Check if browser supports camera use
    // const supported = 'mediaDevices' in navigator;

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