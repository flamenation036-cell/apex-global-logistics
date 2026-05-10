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
    document.getElementById("trackingInput").value.trim();

  const result =
    document.getElementById("result");



  if (!trackingId) {

    result.innerHTML =
      "<p>Please enter tracking ID</p>";

    return;
  }



  try {

    const shipmentRef =
      db.collection("shipments").doc(trackingId);

    const shipment =
      await shipmentRef.get();



    if (shipment.exists) {

      const data = shipment.data();



      result.innerHTML = `

        <div style="
          background:#334155;
          padding:20px;
          border-radius:10px;
          margin-top:20px;
        ">

          <h2>Shipment Found</h2>

          <p><strong>Tracking ID:</strong>
          ${trackingId}</p>

          <p><strong>Customer:</strong>
          ${data.customerName}</p>

          <p><strong>Location:</strong>
          ${data.currentLocation}</p>

          <p><strong>Status:</strong>
          ${data.shipmentStatus}</p>

          <p><strong>Progress:</strong>
          ${data.progress}%</p>

        </div>

      `;

    } else {

      result.innerHTML = `
        <p style="color:red;">
          Shipment Not Found
        </p>
      `;
    }

  } catch (error) {

    console.log(error);

    result.innerHTML = `
      <p style="color:red;">
        Error loading shipment
      </p>
    `;
  }
}



window.trackShipment = trackShipment;