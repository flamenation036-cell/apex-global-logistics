let trackingHistory =
    JSON.parse(localStorage.getItem("trackingHistory")) || [];



async function trackPackage() {

    let trackingInput =
        document.getElementById("trackingInput");

    let trackingNumber =
        trackingInput.value;

    let result =
        document.getElementById("result");

    let progressBar =
        document.getElementById("progressBar");

    let historyList =
        document.getElementById("historyList");

    let trackingCount =
        document.getElementById("trackingCount");

    let loader =
        document.getElementById("loader");

    let sound =
        document.getElementById("trackSound");



    if (trackingNumber === "") {

        result.innerHTML =
            "<p style='color:red;'>❌ Enter tracking number</p>";

        return;

    }



    loader.style.display = "block";

    result.innerHTML =
        "<p>🔍 Searching package...</p>";



    try {

        const shipmentRef =
            window.doc(
                window.db,
                "shipments",
                trackingNumber
            );

        const shipmentSnap =
            await window.getDoc(
                shipmentRef
            );



        loader.style.display = "none";



        if (shipmentSnap.exists()) {

            const data =
                shipmentSnap.data();



            sound.play();



            progressBar.style.width =
                data.progress + "%";



          let badgeColor = "#3498db";

if (
    data.status.includes("Processing")
) {

    badgeColor = "#f1c40f";

}

else if (
    data.status.includes("Shipped")
) {

    badgeColor = "#3498db";

}

else if (
    data.status.includes("Out for Delivery")
) {

    badgeColor = "#e67e22";

}

else if (
    data.status.includes("Delivered")
) {

    badgeColor = "#2ecc71";

}



result.innerHTML = `

    <div
        style="
            background:${badgeColor};
            color:white;
            padding:10px;
            border-radius:10px;
            margin-bottom:15px;
            font-weight:bold;
        "
    >

        📦 ${data.status}

    </div>

   <p>
    📍 Location:
    ${data.location}
</p>

<p>
    👤 Customer:
    ${data.customer}
</p>

<p>
    📊 Progress:
    ${data.progress}%
</p>

<p>
    ⏰ Updated:
    ${data.createdAt || "No timestamp"}
</p>

`;



            trackingHistory.push(trackingNumber);

            localStorage.setItem(
                "trackingHistory",
                JSON.stringify(trackingHistory)
            );



            historyList.innerHTML = "";



            trackingHistory.forEach((item, index) => {

                historyList.innerHTML += `
                    <li>
                        📦 ${item}

                        <button onclick="deleteHistory(${index})">
                            ❌
                        </button>
                    </li>
                `;

            });



            trackingCount.innerHTML =
                `Total Packages Tracked: ${trackingHistory.length}`;



            trackingInput.value = "";

        }

        else {

            progressBar.style.width = "0%";

            result.innerHTML =
                "<p style='color:red;'>❌ Tracking number not found</p>";

        }

    }

    catch (error) {

        loader.style.display = "none";

        result.innerHTML =
            "<p style='color:red;'>❌ Error loading shipment</p>";

        console.log(error);

    }

}



function clearHistory() {

    trackingHistory = [];

    localStorage.removeItem("trackingHistory");

    document.getElementById("historyList").innerHTML = "";

    document.getElementById("trackingCount").innerHTML =
        "Total Packages Tracked: 0";
}



function deleteHistory(index) {

    trackingHistory.splice(index, 1);

    localStorage.setItem(
        "trackingHistory",
        JSON.stringify(trackingHistory)
    );

    let historyList =
        document.getElementById("historyList");

    let trackingCount =
        document.getElementById("trackingCount");

    historyList.innerHTML = "";



    trackingHistory.forEach((item, index) => {

        historyList.innerHTML += `
            <li>
                📦 ${item}

                <button onclick="deleteHistory(${index})">
                    ❌
                </button>
            </li>
        `;

    });



    trackingCount.innerHTML =
        `Total Packages Tracked: ${trackingHistory.length}`;
}



function updateDateTime() {

    let now = new Date();

    let dateTime =
        now.toLocaleString();

    document.getElementById("dateTime").innerHTML =
        "📅 " + dateTime;
}



setInterval(updateDateTime, 1000);

updateDateTime();



const darkModeToggle =
    document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

});



document
    .getElementById("trackingInput")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {

            trackPackage();

        }

    });



window.onload = function () {

    let historyList =
        document.getElementById("historyList");

    let trackingCount =
        document.getElementById("trackingCount");

    historyList.innerHTML = "";



    trackingHistory.forEach((item, index) => {

        historyList.innerHTML += `
            <li>
                📦 ${item}

                <button onclick="deleteHistory(${index})">
                    ❌
                </button>
            </li>
        `;

    });



    trackingCount.innerHTML =
        `Total Packages Tracked: ${trackingHistory.length}`;

};



function logout() {

    sessionStorage.removeItem("loggedIn");

    window.location.href = "index.html";

}



function showNotification(message) {

    let notification =
        document.getElementById("notification");

    notification.innerHTML = message;

    notification.style.display = "block";



    setTimeout(() => {

        notification.style.display = "none";

    }, 3000);

}



setInterval(() => {

    let messages = [

        "📦 New shipment arriving in Lagos",

        "🚚 Package delivered successfully",

        "📍 Shipment departed London",

        "✅ Order received from customer",

        "🛵 Rider heading to destination"

    ];



    let randomMessage =
        messages[
            Math.floor(Math.random() * messages.length)
        ];



    showNotification(randomMessage);

}, 8000);
async function addShipment() {

    let tracking =
        document.getElementById(
            "adminTracking"
        ).value;

    let customer =
        document.getElementById(
            "adminCustomer"
        ).value;

    let location =
        document.getElementById(
            "adminLocation"
        ).value;

    let status =
        document.getElementById(
            "adminStatus"
        ).value;

    let progress =
        document.getElementById(
            "adminProgress"
        ).value;



    if (
        tracking === "" ||
        customer === "" ||
        location === "" ||
        status === "" ||
        progress === ""
    ) {

        alert("Please fill all fields");

        return;

    }



    try {

        await window.setDoc(

            window.doc(
                window.db,
                "shipments",
                tracking
            ),

            {

    customer: customer,

    location: location,

    status: status,

    progress: Number(progress),

    createdAt:
    new Date().toLocaleString()

}

        );



        alert("Shipment Added Successfully ✅");



        document.getElementById(
            "adminTracking"
        ).value = "";

        document.getElementById(
            "adminCustomer"
        ).value = "";

        document.getElementById(
            "adminLocation"
        ).value = "";

        document.getElementById(
            "adminStatus"
        ).value = "";

        document.getElementById(
            "adminProgress"
        ).value = "";

    }

    catch (error) {

        console.log(error);

        alert("Error Adding Shipment ❌");

    }

}
async function loadDashboardStats() {

    try {

        const querySnapshot =
            await window.getDocs(

                window.collection(
                    window.db,
                    "shipments"
                )

            );



        let total = 0;

        let delivered = 0;

        let transit = 0;



        querySnapshot.forEach((doc) => {

            total++;



            const data = doc.data();



            if (
                data.status.includes("Delivered")
            ) {

                delivered++;

            }



            if (

                data.status.includes("Shipped") ||

                data.status.includes("Processing") ||

                data.status.includes("Out for Delivery")

            ) {

                transit++;

            }

        });



        document.getElementById(
            "totalShipments"
        ).innerHTML = total;



        document.getElementById(
            "deliveredShipments"
        ).innerHTML = delivered;



        document.getElementById(
            "transitShipments"
        ).innerHTML = transit;

    }

    catch (error) {

        console.log(error);

    }

}



loadDashboardStats();
async function updateShipment() {

    let tracking =
        document.getElementById(
            "updateTracking"
        ).value;

    let status =
        document.getElementById(
            "updateStatus"
        ).value;

    let progress =
        document.getElementById(
            "updateProgress"
        ).value;



    if (
        tracking === "" ||
        status === "" ||
        progress === ""
    ) {

        alert("Please fill all fields");

        return;

    }



    try {

        const shipmentRef =

            window.doc(
                window.db,
                "shipments",
                tracking
            );



        await window.updateDoc(

            shipmentRef,

            {

                status: status,

                progress: Number(progress),

                createdAt:
                new Date().toLocaleString()

            }

        );



        alert("Shipment Updated ✅");



        loadDashboardStats();



        document.getElementById(
            "updateTracking"
        ).value = "";

        document.getElementById(
            "updateStatus"
        ).value = "";

        document.getElementById(
            "updateProgress"
        ).value = "";

    }

    catch (error) {

        console.log(error);

        alert("Error Updating Shipment ❌");

    }

}
async function deleteShipment() {

    let tracking =
        document.getElementById(
            "deleteTracking"
        ).value;



    if (tracking === "") {

        alert("Enter tracking number");

        return;

    }



    try {

        await window.deleteDoc(

            window.doc(
                window.db,
                "shipments",
                tracking
            )

        );



        alert("Shipment Deleted ✅");



        loadDashboardStats();



        document.getElementById(
            "deleteTracking"
        ).value = "";

    }

    catch (error) {

        console.log(error);

        alert("Error Deleting Shipment ❌");

    }

}
window.onload = function () {

    let role =
        sessionStorage.getItem(
            "userRole"
        );



    if (role !== "admin") {

        let adminPanels =
            document.querySelectorAll(
                ".admin-only"
            );



        adminPanels.forEach((panel) => {

            panel.style.display = "none";

        });

    }

};
window.onload = function () {

    let role =
        sessionStorage.getItem(
            "userRole"
        );



    if (role !== "admin") {

        let adminPanels =
            document.querySelectorAll(
                ".admin-only"
            );



        adminPanels.forEach((panel) => {

            panel.style.display = "none";

        });

    }

};