const firebaseConfig = {

  apiKey: "AIzaSyC7lF5GST9b6UHzj7NC8uO8SET8TwSUt-Y",

  authDomain: "apex-global-logistics-company.firebaseapp.com",

  databaseURL: "https://apex-global-logistics-company-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "apex-global-logistics-company",

  storageBucket: "apex-global-logistics-company.firebasestorage.app",

  messagingSenderId: "1090302812907",

  appId: "1:1090302812907:web:e31667aee6e9a76a63d4ae"

};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


async function trackShipment() {

  const trackingId =
    document.getElementById("trackingInput")
    .value
    .trim();

  const result =
    document.getElementById("result");

  if (!trackingId) {

    result.innerHTML = `
      <p style="
        color:#f87171;
        background:#450a0a;
        padding:15px;
        border-radius:10px;
      ">
        Please enter a tracking ID.
      </p>
    `;

    return;
  }

  result.innerHTML = `
    <div style="
      text-align:center;
      padding:30px;
      color:#94a3b8;
    ">
      🔄 Loading shipment information...
    </div>
  `;


  try {

    const shipmentRef =
      db.collection("shipments").doc(trackingId);

    const shipment =
      await shipmentRef.get();


    if (!shipment.exists) {

      result.innerHTML = `
        <div style="
          background:#450a0a;
          padding:20px;
          border-radius:15px;
          margin-top:20px;
          color:#fecaca;
        ">

          <h3>Shipment Not Found</h3>

          <p>
            We couldn't find a shipment with tracking ID:
          </p>

          <strong>${trackingId}</strong>

        </div>
      `;

      return;
    }


    const data = shipment.data();


    const shipmentStatus =
      data.shipmentStatus || "Pending";


    const progress =
      Number(data.progress) || 0;


    const currentLocation =
      data.currentLocation || "Location unavailable";


    const customerName =
      data.customerName || "N/A";


    const estimatedDelivery =
      data.estimatedDelivery || "Pending";


    const updatedAt =
      data.updatedAt || "N/A";


    const lastActivity =
      data.lastActivity || "No activity yet";


    const activityTime =
      data.activityTime || "";


    const shipmentImage =
      data.shipmentImage || "";


    const locationHistory =
      data.locationHistory || "";


    let statusColor = "#eab308";


    if (
      shipmentStatus
        .toLowerCase()
        .includes("deliver")
    ) {

      statusColor = "#16a34a";

    } else if (
      shipmentStatus
        .toLowerCase()
        .includes("transit")
    ) {

      statusColor = "#2563eb";

    } else if (
      shipmentStatus
        .toLowerCase()
        .includes("customs")
    ) {

      statusColor = "#dc2626";

    } else if (
      shipmentStatus
        .toLowerCase()
        .includes("out")
    ) {

      statusColor = "#7c3aed";

    }


    let locationHistoryHTML =
      "<p style='color:#94a3b8;'>No location history available.</p>";


    if (locationHistory) {

      locationHistoryHTML =
        locationHistory
        .split(",")
        .map(location => `

          <div style="
            background:#0f172a;
            padding:14px;
            border-radius:12px;
            margin-bottom:10px;
            border-left:3px solid #38bdf8;
          ">

            📍 ${location.trim()}

          </div>

        `)
        .join("");

    }


    const stages = [

      "Shipment Created",

      "In Transit",

      "Held By Customs",

      "Out For Delivery",

      "Delivered"

    ];


    let activeStage = 0;


    const statusLower =
      shipmentStatus.toLowerCase();


    if (statusLower.includes("transit")) {

      activeStage = 1;

    }

    if (statusLower.includes("customs")) {

      activeStage = 2;

    }

    if (
      statusLower.includes("out") ||
      statusLower.includes("delivery")
    ) {

      activeStage = 3;

    }

    if (statusLower.includes("deliver")) {

      activeStage = 4;

    }


    let timelineHTML = "";


    stages.forEach((stage, index) => {

      const completed =
        index <= activeStage;


      timelineHTML += `

        <div style="
          display:flex;
          align-items:center;
          margin-bottom:16px;
        ">

          <div style="
            width:28px;
            height:28px;
            min-width:28px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            margin-right:14px;
            background:${completed ? "#22c55e" : "#475569"};
            color:white;
            font-weight:bold;
            box-shadow:${completed
              ? "0 0 12px rgba(34,197,94,0.4)"
              : "none"};
          ">

            ${completed ? "✓" : ""}

          </div>

          <div style="
            color:${completed ? "white" : "#94a3b8"};
            font-weight:${completed ? "bold" : "normal"};
          ">

            ${stage}

          </div>

        </div>

      `;

    });


    result.innerHTML = `

      <div style="
        background:#1e293b;
        padding:25px;
        border-radius:20px;
        margin-top:25px;
        color:white;
        box-shadow:0 15px 40px rgba(0,0,0,0.35);
        animation:shipmentAppear 0.6s ease;
      ">


        ${
          shipmentImage
          ? `
            <img
              src="${shipmentImage}"
              style="
                width:100%;
                max-height:250px;
                object-fit:cover;
                border-radius:16px;
                margin-bottom:20px;
              "
              onerror="this.style.display='none'"
            >
          `
          : ""
        }


        <h2 style="
          color:#38bdf8;
          margin-bottom:20px;
        ">

          Shipment Found

        </h2>


        <p>

          <strong>Tracking ID:</strong>
          ${trackingId}

        </p>


        <p>

          <strong>Customer:</strong>
          ${customerName}

        </p>


        <p>

          <strong>Current Location:</strong>
          ${currentLocation}

        </p>


        <p>

          <strong>Status:</strong>

          <span style="
            background:${statusColor};
            color:white;
            padding:7px 12px;
            border-radius:20px;
            margin-left:8px;
            display:inline-block;
            font-size:14px;
          ">

            ${shipmentStatus}

          </span>

        </p>


        <p>

          <strong>Expected Delivery:</strong>
          ${estimatedDelivery}

        </p>


        <p>

          <strong>Last Updated:</strong>
          ${updatedAt}

        </p>


        <div style="
          margin-top:25px;
          background:#0f172a;
          padding:18px;
          border-radius:15px;
        ">

          <h3 style="
            color:#38bdf8;
            margin-top:0;
          ">

            📍 Current Shipment Location

          </h3>


          <div style="
            border-radius:15px;
            overflow:hidden;
            border:2px solid #334155;
          ">

            <iframe

              width="100%"

              height="300"

              style="
                border:0;
                display:block;
              "

              loading="lazy"

              allowfullscreen

              src="https://www.google.com/maps?q=${encodeURIComponent(currentLocation)}&output=embed">

            </iframe>

          </div>


          <p style="
            color:#94a3b8;
            line-height:1.6;
          ">

            Current shipment position:

            <strong style="color:white;">

              ${currentLocation}

            </strong>

          </p>

        </div>


        <div style="
          margin-top:20px;
          background:#0f172a;
          padding:18px;
          border-radius:15px;
        ">

          <h3 style="
            color:#38bdf8;
            margin-top:0;
          ">

            🚚 Latest Activity

          </h3>


          <p style="
            line-height:1.7;
            margin-bottom:0;
          ">

            🚚 ${lastActivity}

          </p>


          ${
            activityTime
            ? `
              <p style="
                margin-top:10px;
                color:#94a3b8;
                font-size:14px;
              ">

                ${activityTime}

              </p>
            `
            : ""
          }

        </div>


        <div style="
          margin-top:20px;
          background:#0f172a;
          padding:18px;
          border-radius:15px;
        ">

          <h3 style="
            color:#38bdf8;
            margin-top:0;
          ">

            📊 Delivery Progress

          </h3>


          <div style="
            display:flex;
            justify-content:space-between;
            margin-bottom:8px;
          ">

            <span>Progress</span>

            <strong>${progress}%</strong>

          </div>


          <div style="
            width:100%;
            height:14px;
            background:#334155;
            border-radius:20px;
            overflow:hidden;
          ">

            <div style="
              width:${Math.min(progress,100)}%;
              height:100%;
              background:linear-gradient(
                90deg,
                #2563eb,
                #22c55e
              );
              border-radius:20px;
              transition:width 1s ease;
            "></div>

          </div>

        </div>


        <div style="
          margin-top:20px;
          background:#0f172a;
          padding:18px;
          border-radius:15px;
        ">

          <h3 style="
            color:#38bdf8;
            margin-top:0;
          ">

            📍 Location History

          </h3>


          ${locationHistoryHTML}

        </div>


        <div style="
          margin-top:20px;
          background:#0f172a;
          padding:18px;
          border-radius:15px;
        ">

          <h3 style="
            color:#38bdf8;
            margin-top:0;
          ">

            Shipment Timeline

          </h3>


          ${timelineHTML}

        </div>


        <button
          onclick="downloadReceipt()"
          style="
            margin-top:25px;
            background:#38bdf8;
            color:white;
            border:none;
            padding:14px 20px;
            border-radius:12px;
            cursor:pointer;
            font-size:16px;
            width:100%;
          "
        >

          🧾 Download Receipt

        </button>


      </div>

    `;

  } catch (error) {

    console.error(error);

    result.innerHTML = `

      <div style="
        background:#450a0a;
        color:#fecaca;
        padding:20px;
        border-radius:15px;
        margin-top:20px;
      ">

        <h3>Error Loading Shipment</h3>

        <p>
          Please try again.
        </p>

      </div>

    `;

  }

}


window.trackShipment = trackShipment;


window.downloadReceipt = function () {

  const { jsPDF } = window.jspdf;


  if (!jsPDF) {

    alert("Receipt system is not available.");

    return;

  }


  const trackingId =
    document.getElementById("trackingInput")
    .value
    .trim();


  const result =
    document.getElementById("result");


  if (!trackingId || !result.innerText.trim()) {

    alert("Please track a shipment first.");

    return;

  }


  const doc =
    new jsPDF();


  doc.setFillColor(15,23,42);

  doc.rect(
    0,
    0,
    220,
    40,
    "F"
  );


  doc.setFontSize(22);

  doc.setTextColor(
    255,
    255,
    255
  );


  doc.text(
    "Apex Global Logistics",
    20,
    23
  );


  doc.setFontSize(12);


  doc.text(
    "Official Shipment Receipt",
    20,
    33
  );


  doc.setTextColor(
    0,
    0,
    0
  );


  doc.setFontSize(14);


  doc.text(
    `Tracking ID: ${trackingId}`,
    20,
    60
  );


  doc.setFontSize(11);


  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    20,
    72
  );


  doc.line(
    20,
    82,
    190,
    82
  );


  doc.setFontSize(13);


  doc.text(
    "Shipment Details",
    20,
    97
  );


  const lines =
    result.innerText
    .split("\n");


  let y = 110;


  lines.forEach(line => {

    const cleanLine =
      line.trim();


    if (!cleanLine) {

      return;

    }


    const wrapped =
      doc.splitTextToSize(
        cleanLine,
        170
      );


    doc.text(
      wrapped,
      20,
      y
    );


    y +=
      wrapped.length * 7 + 3;


    if (y > 260) {

      doc.addPage();

      y = 25;

    }

  });


  doc.setFontSize(10);

  doc.setTextColor(
    100,
    100,
    100
  );


  doc.text(
    "Thank you for choosing Apex Global Logistics.",
    20,
    280
  );


  doc.save(
    `${trackingId}-receipt.pdf`
  );

};