const session = new Date()
let timeElapsed, connecttionState, entries
let lastConnected = new Date()
let lastDisconnected = new Date()
let eventsArr = []
let notificattionStatus = {
    con: false,
    dis: false
}
// let btnElm = document.querySelector("button")
let btnElm

// Device Type Detecttion 
const deviceType = {
    MOBILE: 'mobile',
    TABLET: 'tablet',
    DESKTOP: 'desktop'
}

function detectDeviceType() {
    const userAgent = navigator.userAgent

    if (/Mobi/.test(userAgent)) {
        return deviceType.MOBILE
    } 
    else if (/Tablet|iPad/i.test(userAgent)) {
        return deviceType.TABLET
    } 
    else {
        return deviceType.DESKTOP
    }
}

const device = detectDeviceType()

if (device != "desktop"){
    // document.querySelector("div").innerText = "The NetMon app is designed to only run on Desktop/Laptop computers."
    let divElm = document.querySelector("div")
    divElm.innerHTML = ""
    let imgElm = document.createElement("img")
    imgElm.src = "./no-phone.png"
    let pElm = document.createElement("p")
    pElm.innerText = "The NetMon app is designed to only run on Desktop/Laptop computers."
    divElm.appendChild(imgElm)
    divElm.appendChild(pElm)
}
else if(device === "desktop"){
    btnElm = document.querySelector("button")
    
    // Request permission for notifications
    Notification.requestPermission().then(function (result) {
        let h4Elm = document.querySelector("h4")
        h4Elm.innerText = `Notifications: ${result}`
        if (result === 'granted') {
            console.log('Notification permission granted.');
        } else {
            console.log('Notification permission denied.');
        }
    });

    setInterval(function() {
        // Code runs each time as per duration set.
        
        let currentTime = new Date()
        currentTime = `${currentTime.getHours()}h ${currentTime.getMinutes()}m ${currentTime.getSeconds()}s`
        const eventObj = {
            conStat: navigator.onLine,
            time: currentTime,
            session: session,
            connData: getNavConString()
        }
    
        eventsArr.push(eventObj)
    
        updateUI(eventObj)
    
    }, 1000)

    btnElm.addEventListener("click", function(){
        let csvString = CSVConverter.arrayToCSV(eventsArr)
        let filename = `Log_${session.getFullYear()}-${session.getMonth() + 1}-${session.getDate()}_${Date.now()}`
        CSVDownloader.downloadCSV(csvString, filename)
    })
}

function updateUI(event){
    updateTitleFav(event)
    let bodyElm = document.querySelector("body")
    let h1Elm = document.querySelector("h1")
    let connStatElm = document.getElementById("connStat")
    // let h2Elm = document.querySelector("h2")
    let h3Elm = document.querySelector("h3")
    let imgElm = document.querySelector("img")
    h3Elm.innerText = event.session
    // let btnElm = document.querySelector("button")
    btnElm.innerText = `EXPORT LOG (${eventsArr.length} entries)`
    // document.querySelector("h5").innerText = event.connData
    document.querySelector("h5").style.display = "none"

    if (event.conStat === true){
        // h1Elm.innerText = "CONNECTED"
        connStatElm.innerText = "CONNECTED"
        h1Elm.style.color = "white"
        bodyElm.style.backgroundColor = "green"
        document.querySelector("h5").innerText = event.connData
        document.querySelector("h5").style.display = "block"
        imgElm.src = "./connected.png"
        
        if (connecttionState != "connected"){
            connecttionState = "connected"
            lastConnected = new Date()
        }
        timeElapsed = formatTime(new Date() - lastConnected)
        // h2Elm.innerText = `${timeElapsed.hours}h ${timeElapsed.minutes}m ${timeElapsed.seconds}s`
        updateTimeElapsed()

        if (!notificattionStatus.con){
            notificattionStatus.con = true
            notificattionStatus.dis = false
            showNotification()
        }
    }
    else{
        // h1Elm.innerText = "DISCONNECTED"
        connStatElm.innerText = "DISCONNECTED"
        h1Elm.style.color = "white"
        bodyElm.style.backgroundColor = "red"
        imgElm.src = "./disconnected.png"

        if (connecttionState != "disconnected"){
            connecttionState = "disconnected"
            lastDisconnected = new Date()
        }
        timeElapsed = formatTime(new Date() - lastDisconnected)
        // h2Elm.innerText = `${timeElapsed.hours}<span class="tLabel">h</span> ${timeElapsed.minutes}<span class="tLabel">m</span> ${timeElapsed.seconds}<span class="tLabel">s</span>`
        updateTimeElapsed()

        if (!notificattionStatus.dis){
            notificattionStatus.dis = true
            notificattionStatus.con = false
            showNotification()
        }
    }
}

function updateTimeElapsed(){
    let hrsElm = document.getElementById("hrs")
    let minElm = document.getElementById("min")
    let secElm = document.getElementById("sec")

    hrsElm.innerText = timeElapsed.hours
    minElm.innerText = timeElapsed.minutes
    secElm.innerText = timeElapsed.seconds
}

function formatTime(time){
    var hours = Math.floor(time / 3600000); // 1 hour = 3600000 milliseconds
    var minutes = Math.floor((time % 3600000) / 60000); // 1 minute = 60000 milliseconds
    var seconds = Math.floor(((time % 3600000) % 60000) / 1000); // 1 second = 1000 milliseconds

    // Return the formatted time
    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}

// btnElm.addEventListener("click", function(){
//     let csvString = CSVConverter.arrayToCSV(eventsArr)
//     let filename = `Log_${session.getFullYear()}-${session.getMonth() + 1}-${session.getDate()}_${Date.now()}`
//     CSVDownloader.downloadCSV(csvString, filename)
// })

// Function to show notification
function showNotification() {
    if (Notification.permission === 'granted') {
        var notification = new Notification('Internet Connectivity Alert', {
            body: `Internet ${connecttionState}`,
            icon: iconSwitcher() 
        });

        // Close the notification after 5 seconds
        setTimeout(notification.close.bind(notification), 5000);
    } else {
        console.log('Notification permission not granted.');
    }
}

// Switch the notification icon for connected/disconnected.
function iconSwitcher(){
    if (connecttionState === "connected"){
        return "./connected.png"
    }
    else if (connecttionState === "disconnected"){
        return "./disconnected.png"
    }
}

// Return navigator.connection data as a string 
// connType: 2g | downlink: 0.4mbps | rtt: 2050ms
function getNavConString(){
    let connType = navigator.connection.effectiveType
    let downlink = navigator.connection.downlink
    let rtt = navigator.connection.rtt
    let connData = `connType: ${connType} | downlink: ${downlink}mbps | rtt: ${rtt}ms`
    return connData
}

// Change the Favicon and Title to reflect connectivity. 
function updateTitleFav(event){
    let faviconElm = document.getElementById("favicon")
    let pageTitleElm = document.getElementById("page-title")

    if (event.conStat){
        faviconElm.href = "./favicon.ico"
        pageTitleElm.innerText = "CONNECTED - NetMon"
    }
    else{
        faviconElm.href = "./faviconDC.ico"
        pageTitleElm.innerText = "DISCONNECTED - NetMon"
    }
}
