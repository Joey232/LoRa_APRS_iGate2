// Custom scripts

let currentSettings = null;

function backupSettings() {
    const data =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(currentSettings));
    const a = document.createElement("a");
    a.setAttribute("href", data);
    a.setAttribute("download", "iGateConfigurationBackup.json");
    a.click();
}

document.getElementById("backup").onclick = backupSettings;

document.getElementById("restore").onclick = function (e) {
    e.preventDefault();

    document.querySelector("input[type=file]").click();
};

document.querySelector("input[type=file]").onchange = function () {
    const files = document.querySelector("input[type=file]").files;

    if (!files.length) return;

    const file = files.item(0);

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        const data = JSON.parse(reader.result);

        loadSettings(data);
    };
};

function fetchSettings() {
    fetch("/configuration.json")
        .then((response) => response.json())
        .then((settings) => {
            loadSettings(settings);
        })
        .catch((err) => {
            console.error(err);

            alert(`Failed to load configuration`);
        });
}

const alwaysOnCheckbox = document.querySelector(
    'input[name="display.alwaysOn"]'
);
const timeoutInput = document.querySelector('input[name="display.timeout"]');

alwaysOnCheckbox.addEventListener("change", function () {
    timeoutInput.disabled = this.checked;
});

// timeoutInput.addEventListener("change", function () {
//     alwaysOnCheckbox.disabled = this.value !== "";
// });

const logCheckbox = document.querySelector('input[name="syslog.active"]');
const serverField = document.querySelector('input[name="syslog.server"]');
const portField = document.querySelector('input[name="syslog.port"]');

logCheckbox.addEventListener("change", function () {
    serverField.disabled = !this.checked;
    portField.disabled = !this.checked;
});

function loadSettings(settings) {
    currentSettings = settings;
    // General
    document.getElementById("callsign").value = settings.callsign;
    document.getElementById("stationMode").value = settings.stationMode;
    document.getElementById("bme.active").checked = settings.bme.active;
    document.getElementById("iGateComment").value = settings.iGateComment;

    document.querySelector(".list-networks").innerHTML = "";

    // Networks
    const wifiNetworks = settings.wifi.AP;
    const networksContainer = document.querySelector(".list-networks");

    let networkCount = 0;

    wifiNetworks.forEach((network) => {
        const networkElement = document.createElement("div");
        networkElement.classList.add("row", "network", "border-bottom", "py-2");

        // Increment the name, id, and for attributes
        const attributeName = `wifi.AP.${networkCount}`;
        networkElement.innerHTML = `
                  <div class="form-floating col-6 col-md-3 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.ssid" id="${attributeName}.ssid" value="${network.ssid}">
                    <label for="${attributeName}.ssid">SSID</label>
                  </div>
                  <div class="form-floating col-6 col-md-3 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.password" id="${attributeName}.password" value="${network.password}">
                    <label for="${attributeName}.password">Passphrase</label>
                  </div>
                  <div class="col-4 col-md-2 form-floating px-1 mb-2">
                    <input type="text" class="form-control form-control-sm latitude" name="${attributeName}.latitude" id="${attributeName}.latitude" value="${network.latitude}">
                    <label for="${attributeName}.latitude">Latitude</label>
                  </div>
                  <div class="col-4 col-md-2 form-floating px-1 mb-2">
                    <input type="text" class="form-control form-control-sm longitude" name="${attributeName}.longitude" id="${attributeName}.longitude" value="${network.longitude}">
                    <label for="${attributeName}.longitude">Longitude</label>
                  </div>
                  <div class="col-4 col-md-2 d-flex align-items-center justify-content-end">
                    <div class="btn-group" role="group">
                      <button type="button" class="btn btn-sm btn-danger" title="Delete" onclick="return this.parentNode.parentNode.parentNode.remove();"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
            </svg><span class="visually-hidden">Delete</span></button>
                    </div>
                  </div>
                `;
        networksContainer.appendChild(networkElement);
        networkCount++;
    });

    // APRS-IS
    document.getElementById("aprs_is.server").value = settings.aprs_is.server;
    document.getElementById("aprs_is.port").value = settings.aprs_is.port;
    document.getElementById("aprs_is.reportingDistance").value =
        settings.aprs_is.reportingDistance;
    document.getElementById("aprs_is.passcode").value =
        settings.aprs_is.passcode;

    // Display
    document.getElementById("display.alwaysOn").checked =
        settings.display.alwaysOn;
    document.getElementById("display.turn180").checked =
        settings.display.turn180;
    document.getElementById("display.timeout").value = settings.display.timeout;

    if (settings.display.alwaysOn) {
        timeoutInput.disabled = true;
    }

    // WiFi Auto AP
    document.getElementById("wifi.autoAP.password").value =
        settings.wifi.autoAP.password;
    document.getElementById("wifi.autoAP.powerOff").value =
        settings.wifi.autoAP.powerOff;

    // Digi
    document.getElementById("digi.comment").value = settings.digi.comment;
    document.getElementById("digi.latitude").value = settings.digi.latitude;
    document.getElementById("digi.longitude").value = settings.digi.longitude;

    // OTA
    document.getElementById("ota.username").value = settings.ota.username;
    document.getElementById("ota.password").value = settings.ota.password;

    // Beacon
    document.getElementById("other.beaconInterval").value =
        settings.other.beaconInterval;
    document.getElementById("other.rememberStationTime").value =
        settings.other.rememberStationTime;
    document.getElementById("other.sendBatteryVoltage").checked =
        settings.other.sendBatteryVoltage;
    document.getElementById("other.externalVoltageMeasurement").checked =
        settings.other.externalVoltageMeasurement;
    document.getElementById("other.externalVoltagePin").value =
        settings.other.externalVoltagePin;
    document.getElementById("other.igateSendsLoRaBeacon").value =
        settings.other.igateSendsLoRaBeacon;
    document.getElementById("other.igateRepeatLoRaPackets").value =
        settings.other.igateRepeatLoRaPackets;

    // Syslog
    document.getElementById("syslog.active").checked = settings.syslog.active;
    document.getElementById("syslog.server").value = settings.syslog.server;
    document.getElementById("syslog.port").value = settings.syslog.port;

    if (settings.syslog.active) {
        serverField.disabled = false;
        portField.disabled = false;
    }

    // LoRa
    document.getElementById("lora.digirepeaterTxFreq").value =
        settings.lora.digirepeaterTxFreq;
    document.getElementById("lora.iGateFreq").value = settings.lora.iGateFreq;
    document.getElementById("lora.digirepeaterRxFreq").value =
        settings.lora.digirepeaterRxFreq;
    document.getElementById("lora.spreadingFactor").value =
        settings.lora.spreadingFactor;
    document.getElementById("lora.signalBandwidth").value =
        settings.lora.signalBandwidth;
    document.getElementById("lora.codingRate4").value =
        settings.lora.codingRate4;
    document.getElementById("lora.power").value = settings.lora.power;

    updateImage();
}

const bmeCheckbox = document.querySelector("input[name='bme.active']");

const stationModeSelect = document.querySelector("select[name='stationMode']");

const digirepeaterTxFreqInput = document.querySelector(
    "input[name='lora.digirepeaterRxFreq']"
);

function updateImage() {
    const image = document.querySelector("img");

    const isChecked = bmeCheckbox.checked;

    if (isChecked) {
        image.src =
            "data:image/png;base64,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";
    } else {
        const selectedValue = stationModeSelect.value;

        if (selectedValue === "1") {
            if (bmeCheckbox.checked) {
                image.src =
                    "data:image/png;base64,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";
            } else {
                image.src =
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ6SURBVHgB7d0/axRBGMfx50IMWPoKkpA02gUsLfZdqOCLOPBFWAliHbCUVNpaxQNrIY0WVjZaJlUsIsZ5uDu9bGb/zMwzs/PM/L7wIG4Ocflwl7ndvVsihBBCmTajunpk5uHG33+aOSGkvhdmLs1cW+bKzDEhle2a+UZ22Pacrx6PlMRYXc/arrkkIKvIBxfISgrBBXLmSeACOdMkcYGcWTFwgZxJMXGBPHEpcIE8USlxgSzcbGD2KD0ukIXKGRfIAuWOC+TANOACOSAtuEAemQ10a2P2KV9cIA+0ZZltMzurOaT8cYHcUx+wJlwgd9QFrBEXyJZswAekFxfIrdq4GhZUQO7Itlq+QzoXVEC21AdcIm51yF3AJeNWhWwDLmFBBeRVmg4/Atmj2nGLR/bCbZrm2qWx/+7Ekwx5i9LGO/XFzF2qO97/r5QAOSUwcG+WBDkVMHDtRUdOAcz/ed4J4NqLihwbGLjjioYcExi4bkVBjgUMXL/EkWMAAzcsUWRpYODKJIYsCQxc2USQpYCBG6dgZAlg4MYtCDkUGLhp8kYOAQZu2ryQfYGT4S7PAKJVzsg+wEmfubNZbd+XOpgTsiswXpbzaDSyCzBw82oU8lhg4ObZIPIYYODmXS/yEDBwdcQ+72w/6AMGrq6OaHnLghv1AQNXX6/bG7qAPxNwNbbf3mAD5qf5EaEisgG/IVRMNuA9QsVkA94mpLWP7Q2pP5uE4vayvQHA5bQw86m90Qb8i5C22Kyx/cAG/IGQphj3ftcPbcBzM78JaWiN+73rATZgfvAzWn4SHeXbIC7Xtcg6MfOUgJxro3C5vlU0kPNsNC439DYJyHnlhMuNeR8M5DxyxuXGHugA8rR54XIuR7KAPE3euJzroUogpy0Il/M5Fg3kNAXjcr4nG4AcNxFcLuTc78nqz7e0/A7KLDo9PbV+nkn6Q2xnZ2c0n88pQmK4XOjJ/eyQm6YhxYnichLng/FyLZM4Lid1wh/IYUXB5SSv6ACyX9FwOelLdoDsVlRcLsY1WUAeV3RcLtZFd0Duj3EfUGRcLuZVlUC2lwyXi32Re/D75IuLC1osFtYDFXxAo73dts21MV/8wgc6PEqKm7LHZv5QnndASTV8p5U9unl7oaJ6QvUi23CLA+YdqhGZcQ/Jfmu/olrvVE3Ia9wdqgB4sxp+JzPuPv2/+XV1lYzcxq32Q34lvlzbcKsF5h0vCZlxD+g2btXApSCvF1TbBOB/ba4oNSOvn7lr3KpWzC5pXHgVf4RKOk3P5CqOUEmn5eW6CxfAA2n4ndyHC+AR5YwMXOFyWngx7i4h8XJABm7kpkQGbqKmQAZu4lIiA3eiUiADd+JiIgM3k2IgAzezJJGBm2kSyMDNvBBk4CrJBxm4ynJB/kHAVRnf3OucumGvzBxTBZV+eouhn5u5t7HtvZlXhBBCCCEUsb+qGDWF0d8l5AAAAABJRU5ErkJggg==";
            }
            digirepeaterTxFreqInput.disabled = true;
        } else if (selectedValue === "2") {
            if (bmeCheckbox.checked) {
                image.src =
                    "data:image/png;base64,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";
            } else {
                image.src =
                    "data:image/png;base64,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";
            }
            digirepeaterTxFreqInput.disabled = true;
        } else if (selectedValue === "3" || selectedValue === "4") {
            image.src =
                "data:image/png;base64,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";
            digirepeaterTxFreqInput.disabled = selectedValue === "3";
        } else if (selectedValue === "5") {
            if (bmeCheckbox.checked) {
                image.src =
                    "data:image/png;base64,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";
            } else {
                image.src =
                    "data:image/png;base64,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";
            }
            digirepeaterTxFreqInput.disabled = true;
        }
    }
}

stationModeSelect.addEventListener("change", updateImage);
bmeCheckbox.addEventListener("change", updateImage);

function toggleFields() {
    const sendBatteryVoltageCheckbox = document.querySelector(
        'input[name="other.sendBatteryVoltage"]'
    );
    const externalVoltageMeasurementCheckbox = document.querySelector(
        'input[name="other.externalVoltageMeasurement"]'
    );
    const externalVoltagePinInput = document.querySelector(
        'input[name="other.externalVoltagePin"]'
    );

    externalVoltageMeasurementCheckbox.disabled =
        !sendBatteryVoltageCheckbox.checked;
    externalVoltagePinInput.disabled =
        !externalVoltageMeasurementCheckbox.checked;
}

const sendBatteryVoltageCheckbox = document.querySelector(
    'input[name="other.sendBatteryVoltage"]'
);
const externalVoltageMeasurementCheckbox = document.querySelector(
    'input[name="other.externalVoltageMeasurement"]'
);
const externalVoltagePinInput = document.querySelector(
    'input[name="other.externalVoltagePin"]'
);

sendBatteryVoltageCheckbox.addEventListener("change", function () {
    externalVoltageMeasurementCheckbox.disabled = !this.checked;
    externalVoltagePinInput.disabled =
        !externalVoltageMeasurementCheckbox.checked;
});

document.querySelector(".new button").addEventListener("click", function () {
    const networksContainer = document.querySelector(".list-networks");

    let networkCount = document.querySelectorAll(".network").length;

    const networkElement = document.createElement("div");

    networkElement.classList.add("row", "network", "border-bottom", "py-2");

    // Increment the name, id, and for attributes
    const attributeName = `wifi.AP.${networkCount}`;
    networkElement.innerHTML = `
                <div class="form-floating col-6 col-md-3 px-1 mb-2">
                <input type="text" class="form-control form-control-sm" name="${attributeName}.ssid" id="${attributeName}.ssid" placeholder="" >
                <label for="${attributeName}.ssid">SSID</label>
                </div>
                <div class="form-floating col-6 col-md-3 px-1 mb-2">
                <input type="text" class="form-control form-control-sm" name="${attributeName}.password" id="${attributeName}.password" placeholder="">
                <label for="${attributeName}.password">Passphrase</label>
                </div>
                <div class="col-4 col-md-2 form-floating px-1 mb-2">
                <input type="text" class="form-control form-control-sm latitude" name="${attributeName}.latitude" id="${attributeName}.latitude" placeholder="">
                <label for="${attributeName}.latitude">Latitude</label>
                </div>
                <div class="col-4 col-md-2 form-floating px-1 mb-2">
                <input type="text" class="form-control form-control-sm longitude" name="${attributeName}.longitude" id="${attributeName}.longitude" placeholder="">
                <label for="${attributeName}.longitude">Longitude</label>
                </div>
                <div class="col-4 col-md-2 d-flex align-items-center justify-content-end">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-sm btn-danger" title="Delete" onclick="return this.parentNode.parentNode.parentNode.remove();"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
        </svg><span class="visually-hidden">Delete</span></button>
                </div>
                </div>
            `;
    networksContainer.appendChild(networkElement);

    networkCount++;

    // Add the new network element to the end of the document
    document.querySelector(".new").before(networkElement);
});

toggleFields();

const form = document.querySelector("form");

const saveModal = new bootstrap.Modal(document.getElementById("saveModal"), {
    backdrop: "static",
    keyboard: false,
});

const savedModal = new bootstrap.Modal(
    document.getElementById("savedModal"),
    {}
);

function checkConnection() {
    const controller = new AbortController();

    setTimeout(() => controller.abort(), 2000);

    fetch("/status?_t=" + Date.now(), { signal: controller.signal })
        .then(() => {
            saveModal.hide();

            savedModal.show();

            setTimeout(function () {
                savedModal.hide();
            }, 3000);

            fetchSettings();
        })
        .catch((err) => {
            setTimeout(checkConnection, 0);
        });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    document.getElementById("wifi.APs").value =
        document.querySelectorAll(".network").length;

    fetch(form.action, {
        method: form.method,
        body: new FormData(form),
    });

    saveModal.show();

    setTimeout(checkConnection, 0);
});

fetchSettings();
