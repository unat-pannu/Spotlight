        const canvas = document.getElementById('spotlightCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const spotlightRadius = 150;
        const text = "SPOTLIGHT";
        const fontSize = 150;
        let currentLetter = 0;
        let spotlightX = centerX;
        let spotlightY = centerY;
        let spotlightOn = false;
        const gifImage = new Image();
        gifImage.src = "https://img1.picmix.com/output/stamp/normal/7/1/2/0/1560217_adbd3.gif"; 
        const gifWidth = 200; 
        const gifHeight = 200;
        const gifX = canvas.width - gifWidth; 
        const gifY = canvas.height - gifHeight;
        let showGif = false; 
        function drawBackground() {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#5a37e3');
            gradient.addColorStop(1, 'black');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        function drawSpotlight() {
            ctx.beginPath();
            ctx.arc(spotlightX, spotlightY, spotlightRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#fece0c';
            ctx.fill();
        }
        function drawText() {
            ctx.fillStyle = 'white';
            ctx.font = `bold ${fontSize}px 'League Spartan',sans-serif`;
            ctx.textAlign = 'center';
            const spacing = fontSize;

            const textWidth = (text.length - 2) * spacing + fontSize;

            for (let i = 0; i < currentLetter; i++) {
                const x = centerX - textWidth / 2 + (i * spacing);
                ctx.fillText(text[i], x, centerY);
            }

            if (currentLetter < text.length) {
                currentLetter++;
                setTimeout(drawText, 200);
            }
        }
        function drawGif() {
            if (showGif) {
                ctx.drawImage(gifImage, gifX, gifY, gifWidth, gifHeight);
            }
        }
        function animate() {
            drawBackground();
            if (spotlightOn) {
                drawSpotlight();
            }
            const distance = Math.sqrt(
                Math.pow(spotlightX - (gifX + gifWidth / 2), 2) +
                Math.pow(spotlightY - (gifY + gifHeight / 2), 2)
            );
            drawText();
            if (distance < spotlightRadius) {
                showGif = true; 
            } else {
                showGif = false;
            }
            drawGif();
            requestAnimationFrame(animate);
        }
        window.onload = () => {
            setTimeout(() => {
                spotlightOn = true;
                animate();
            }, 1000);
            canvas.addEventListener('mousemove', (e) => {
                spotlightX = e.clientX;
                spotlightY = e.clientY;
            });
        };
        const apiKey = 'AIzaSyD8xyXCeHA4D24MT_Ins3AnEDYOYPuSzzA';
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }
        function showPosition(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
            fetch(geocodeUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "OK") {
                        let city = "Location not found";
                        for (let component of data.results[0].address_components) {
                            if (component.types.includes("locality") || component.types.includes("administrative_area_level_1")) {
                                city = component.long_name;
                                break;
                            }
                        }
                        document.getElementById("location").value = city;
                    } else {
                        console.error("Geocoding error:", data.status);
                        document.getElementById("location").value = "Unable to retrieve address";
                    }
                })
                .catch(error => {
                    console.error('Error getting address:', error);
                    document.getElementById("location").value = "Unable to retrieve address";
                });
        }
        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred.");
                    break;
            }
        }
        window.addEventListener('scroll', function() {
            if (window.scrollY > 200) {  
                document.getElementById('menu').style.display='block';
            }
            if (window.scrollY < 200) {  
                document.getElementById('menu').style.display='none';
            }
        });
        document.getElementById("castingForm").addEventListener("submit", function(event) {
            event.preventDefault();
            alert("Form submitted!");
        });
        const parallax = document.getElementById('parallax');
        const sec = document.getElementById('sec');

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const newSize = 100 + scrollPosition * 0.1; // Adjust zoom factor here
            parallax.style.backgroundSize = `${newSize}%`;
            sec.style.backgroundSize = `${newSize}%`;
        });
 