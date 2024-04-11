// Variable to store the currently playing audio
let currentlyPlayingAudio = null;
let timeInterval = null; // Interval for updating time display
let hoverClicked = null

// Function to fetch data
async function fetchData() {
  try {
    let response = await fetch("/songs");
    let data = await response.text();

    // Convert HTML text to DOM elements
    let parser = new DOMParser();
    let htmlDoc = parser.parseFromString(data, 'text/html');

    // Query all 'a' elements in the parsed HTML DOM
    let aElements = htmlDoc.querySelectorAll("a");
    //  console.log(data)
    for (let i = 1; i < aElements.length; i++) {
      let link = aElements[i].getAttribute("href");
      let decodedLink = decodeURIComponent(link.replace(/\+/g, ' '));

      let relacedSBrackets = aElements[i].innerText.replace(/\s*\[([^[\]]*)\]\s*/g, " ");
      let relacedBrackets = relacedSBrackets.replace(/\s*\([^)]*\)\s*/g, " ");
      let replacedDots = relacedBrackets.replace(/\..*/g, " ");

      let songs = document.createElement("li");
      let cardName = document.createElement("li")
      let hoverPlay = document.createElement("button");


     hoverPlay.innerHTML = `<a href="${decodedLink}">${replacedDots}</a><img src="/svgs/hoverPlay.svg">`;
      songs.innerHTML = `<img class="music" src="/svgs/playlist.svg"><span>${replacedDots}</span><a href="${decodedLink}">Play Now <span class="songName">${replacedDots}</span></a><img class="music" src="/svgs/music.svg"><br>`;
      document.querySelector(".songs-list ul").appendChild(songs);
      cardName.innerHTML = `<img src="/imgs/The_Neighbourhood.jpg" class="cards-img">${replacedDots}`
      document.querySelector(".cards-container ul").appendChild(cardName)
      
      document.querySelectorAll(".my-playlist ul li").forEach((e)=>{
        e.appendChild(hoverPlay)
      })

    }

   // Iterate over each playlist item (li)
document.querySelectorAll(".my-playlist ul li").forEach((item, index) => {
  // Get the img element within each playlist item
  let img = item.querySelector("img");
  
  // Assign a unique class name to each img element
  img.classList.add("playlist-img-" + index);
  
  // Assign src attribute based on the index
  switch (index) {
      case 0:
          img.src = "/imgs/iwannabeyours.jpg";
          break;
      case 1:
          img.src = "/imgs/Unforgettable.jpg";
          break;
      case 3:
          img.src = "/imgs/swether-weather.jpg";
          break;
      case 4:
          img.src = "/imgs/another-love.jpg";
          break;
      case 5:
          img.src = "/imgs/stay-with-me.jpg";
          break;
      default:
          // Handle the case where there are more images than expected
          break;
  }
});

   


    // Attach event listeners to all song links to prevent default action
    let elements = document.querySelectorAll(".songs-list ul a");
    let hoverButton = document.querySelectorAll(".my-playlist ul li button")


    //giving ids to <a> 
    for (let i = 0; i < elements.length; i++) {
      elements[i].id = i;
    }

    //giving ids to button
    for (let i = 0; i < hoverButton.length; i++) {
      hoverButton[i].id = i;
    }
    //hover play
     hoverButton.forEach((element)=>{
              
          element.addEventListener("click",(event)=>{
            event.preventDefault()
           let anchor = element.querySelector("a")

          let link = anchor.getAttribute("href")
           
           

            if(!hoverClicked){
                  playAudio(link,element) 
                  let songControlfooter = document.querySelector(".songcontrol-footer")
                  let cardsContainer = document.querySelector(".cards-container")
        
        
                  if (songControlfooter.style.display = "none") {
                    songControlfooter.style.display = "block"
                    cardsContainer.style.height = "68%"
                  }   
                  


            }
          })
      
          
    })



      elements.forEach((element) => {

        element.addEventListener("click", (event) => {
          event.preventDefault();
          let link = element.getAttribute("href");
          //console.log(link)
          if (hoverClicked == null) {
            playAudio(link, element);
          } // Call the playAudio function directly with the link




          let songControlfooter = document.querySelector(".songcontrol-footer")
          let cardsContainer = document.querySelector(".cards-container")


          if (songControlfooter.style.display = "none") {
            songControlfooter.style.display = "block"
            cardsContainer.style.height = "78%"
           /* if (document.body.clientWidth <= 990) {
              cardsContainer.style.height = "78%";
          }*/

          }

        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

// Function to play audio
function playAudio(link, element) {

    // If there's already audio playing, stop it
    if (currentlyPlayingAudio) {
      currentlyPlayingAudio.pause();
      currentlyPlayingAudio.currentTime = 0; // Reset playback position
      clearInterval(timeInterval); // Clear the interval for updating time display

    }


    // Assuming 'element' references the anchor element (<a>)
    let sName = document.querySelector(".sName")
    let currentSongName = element.firstElementChild.innerHTML

    sName.innerHTML = currentSongName

    // Create new Audio object for the selected song
    currentlyPlayingAudio = new Audio(link);

    // Play the audio
    currentlyPlayingAudio.play()
      .then(() => {

        updateTime(); // Update time display immediately
        timeInterval = setInterval(updateTime, 1000); // Set interval to update time display every second
      })
      .catch(error => {
        console.error("Error playing audio:", error);
      });

let audioVolume = document.querySelector(".audio-volume");

// Function to set audio volume based on the slider value
function setAudioVolume() {

  
  // Retrieve the value from the volume slider and convert it to a number
  let volume = parseFloat(audioVolume.value) / 100;

  // Ensure the volume value is within the valid range
  if (!isNaN(volume) && volume >= 0 && volume <= 1) {
      // Set the volume of currentlyPlayingAudio based on the calculated volume
      currentlyPlayingAudio.volume = 0.5
      currentlyPlayingAudio.volume = volume;
   
  } else {
      console.error("Invalid volume value:", volume);
  }
}

// Attach event listener to the volume slider to update volume dynamically
audioVolume.addEventListener("input", setAudioVolume);







    // Set the initial state of the play/pause button
    let pandp = document.querySelector(".pandp");
    pandp.src = "/svgs/pause.svg";

    pandp.addEventListener("click", togglePlayPause);

    // Attach event listener for the "Next" button outside the loop
    let next = document.querySelector(".next");
    next.addEventListener("click", () => {
      nextClicked(element, currentlyPlayingAudio)
    });

    // Attach event listener for the "Prev" button outside the loop
    let prev = document.querySelector(".prev");
    prev.addEventListener("click", () => {
      prevClicked(element, currentlyPlayingAudio)
    });
  }

  // Function to handle "Prev" button click
  function prevClicked(element, currentlyPlayingAudio) {
    let prevnewID = parseInt(element.id) - 1;
    if (!isNaN(prevnewID)) {
      // Pause the currently playing audio
      currentlyPlayingAudio.pause();

      // Get the next element to play
      let prevElement = document.getElementById(prevnewID);

      if (prevElement) {
        // Get the link of the next audio
        let prevLink = prevElement.getAttribute("href");

        // Play the next audio
        playAudio(prevLink, prevElement);
      } else {
        console.log("Element with ID 'id" + prevnewID + "' not found.");
      }
    }









  }



  // Function to handle "Next" button click

  function nextClicked(element, currentlyPlayingAudio) {
    let newID = parseInt(element.id) + 1;
    if (!isNaN(newID)) {
      // Pause the currently playing audio
      currentlyPlayingAudio.pause();

      // Get the next element to play
      let nextElement = document.getElementById(newID);

      if (nextElement) {
        // Get the link of the next audio
        let nextLink = nextElement.getAttribute("href");

        // Play the next audio
        playAudio(nextLink, nextElement);
      } else {
        console.log("Element with ID 'id" + newID + "' not found.");
      }
    }
  }




  // Function to update time display and seek bar
  function updateTime() {
    let timer = document.getElementById("timer");
    let seekbar = document.getElementById("seekbar");
    let mins = Math.floor(currentlyPlayingAudio.currentTime / 60);
    let secs = Math.floor(currentlyPlayingAudio.currentTime % 60);
    if (secs < 10) {
      secs = '0' + String(secs);
    }
    totalmins = Math.floor(currentlyPlayingAudio.duration / 60);
    totalsecs = Math.floor(currentlyPlayingAudio.duration % 60);
    if (totalsecs < 10) {
      totalsecs = '0' + String(totalsecs);
    }

    timer.innerHTML = mins + ":" + secs + "/" + totalmins + ":" + totalsecs;

    seekbar.value = Math.floor(currentlyPlayingAudio.currentTime);

    seekbar.addEventListener("input", seekbarClicked); // Add event listener to seekbar

    seekbar.max = Math.floor(currentlyPlayingAudio.duration);

    // Reset the timer and seekbar once the song is completed
    if (seekbar.value == seekbar.max) {
      let pandp = document.querySelector(".pandp");
      seekbar.value = 0;
      timer.innerHTML = "00:00";
      pandp.src = "play.svg";
    }
  }



  // Function to update seekbar when clicked
  function seekbarClicked(event) {
    currentlyPlayingAudio.currentTime = event.target.value;
  }

  // Function to toggle play/pause
  function togglePlayPause() {
    if (currentlyPlayingAudio.paused) {
      currentlyPlayingAudio.play()
        .then(() => {
          console.log("Audio played");
          updateTime(); // Update time display immediately
          timeInterval = setInterval(updateTime, 1000); // Set interval to update time display every second
        })
        .catch(error => {
          console.error("Error playing audio:", error);
        });
      this.src = "/svgs/pause.svg";

    } else {
      currentlyPlayingAudio.pause();
      clearInterval(timeInterval); // Clear the interval for updating time display
      this.src = "/svgs/play.svg";

    }
  }

  // Function to initialize
  async function main() {
    await fetchData();
  }

  main();


  //hamburger
  let hamburger = document.querySelector(".hamburger");
  let left = document.querySelector(".left");
  let cut = document.querySelector(".logo button")




  hamburger.addEventListener("click", () => {
    console.log("hamburger clicked")
    left.classList.add("show")
  })
  cut.addEventListener("click", () => {
    console.log("cut clicked");
    left.classList.remove("show")
  });


