const f = "#46B6D1";
const b = "#504C4C";

function Element(id) {
    return document.getElementById(id);
}

if ('alt' in window) {

    alt.on('SetVoiceRange', range => {
        Element("text_saltychat").innerText = `${range} Meter`
    })

    alt.on('PlayAudio', (path, volume) => {
        audioElement = new Audio(path)
        audioElement.volume = volume
        audioElement.play()
    })

    alt.on("hud:updateIndicators", (health, armor, food, drink) => {
        //Element("bar_health").style.background = `repeating-linear-gradient(to right, ${f}, ${f} ${health}%, ${b} ${health - 100}%, ${b} 100%)`
        //Element("bar_armor").style.background = `repeating-linear-gradient(to right, ${f}, ${f} ${armor}%, ${b} ${armor - 100}%, ${b} 100%)`
        Element("bar_food").style.background = `repeating-linear-gradient(to right, ${f}, ${f} ${food}%, ${b} ${food - 100}%, ${b} 100%)`
        Element("bar_drink").style.background = `repeating-linear-gradient(to right, ${f}, ${f} ${drink}%, ${b} ${drink - 100}%, ${b} 100%)`
    })
    alt.on("ToggleCar", (inCar) => {
        if (!inCar) {
            Element("li_fuel").style.opacity = "0.0"
            Element("li_speed").style.opacity = "0.0"
            Element("li_belt").style.opacity = "0.0"
            Element("li_km").style.opacity = "0.0"
        } else {
            Element("li_fuel").style.opacity = "1.0"
            Element("li_speed").style.opacity = "1.0"
            Element("li_belt").style.opacity = "1.0"
            Element("li_km").style.opacity = "1.0"
        }
    });
    alt.on('SetHealth', health => Element("bar_health").style.background = `repeating-linear-gradient(to right, ${f}, ${f} ${health}%, ${b} ${health}%, ${b} 100%)`)
    alt.on('SetArmour', armour => Element("bar_armor").style.background = `repeating-linear-gradient(to right, ${f}, ${f} ${armour}%, ${b} ${armour}%, ${b} 100%)`)
    alt.on("SetSpeed", speed => Element("text_speed").innerText = speed + " KM/H" )
    alt.on("SetFuel", fuel => Element("text_fuel").innerText = `${parseInt(fuel)} Liter`)
    alt.on("SetKM", km => Element("text_km").innerText = `${km.toFixed(2)} KM`)
    alt.on("SetSeatbelt", on => {
        if (on)
            Element("text_belt").innerText = "Angeschnallt";
        else
            Element("text_belt").innerText = "Nicht angeschnallt";
    });
    alt.on("hud:updateVehicleManagement", (active) => {
        if (active) {
            Element("vehicle_container").style.opacity = "0.9";
        } else {
            Element("vehicle_container").style.opacity = "0.0";
        }
        
    });
    alt.on("hud:mPressed", (s) => {
        if ('alt' in window) {
            var o = Element("vehicle_container").style.opacity;
            alt.emit("hud:webViewRequestVehicleManagementUpdate", o != 0);
        }
    });
}

function onEngineClick() {
    if ('alt' in window) {
        alt.emit("vehicle:webViewRequestEngineToggle");
    }
}
function onSeatbeltClick() {
    if ('alt' in window) {
        alt.emit("vehicle:webViewRequestSeatbeltToggle");
    }
}
function onHoodClick() {
    alt.emit("vehicle:webViewRequestHood");
}
function onTrunkClick() {
    alt.emit("vehicle:webViewRequestTrunk");
}
function onLightClick() {
    alt.emit("vehicle:webViewRequestLight");
}