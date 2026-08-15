import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const firebaseConfig = {

  apiKey: "AIzaSyC7lF5GST9b6UHzj7NC8uO8SET8TwSUt-Y",

  authDomain: "apex-global-logistics-company.firebaseapp.com",

  databaseURL: "https://apex-global-logistics-company-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "apex-global-logistics-company",

  storageBucket: "apex-global-logistics-company.firebasestorage.app",

  messagingSenderId: "1090302812907",

  appId: "1:1090302812907:web:e31667aee6e9a76a63d4ae"

};




const app = initializeApp(firebaseConfig);

const db = getFirestore(app);



const shipmentList =
  document.getElementById("shipmentList");



async function loadShipments() {

  const shipmentList =
    document.getElementById("shipmentList");

  const totalElement =
    document.getElementById("totalShipments");

  const transitElement =
    document.getElementById("transitShipments");

  const deliveredElement =
    document.getElementById("deliveredShipments");


  shipmentList.innerHTML = "";


  try {

    const querySnapshot =
      await getDocs(
        collection(db, "shipments")
      );


    let total = 0;
    let transit = 0;
    let delivered = 0;


    querySnapshot.forEach((docItem) => {

      const data =
        docItem.data();

      total++;


      const status =
        (data.shipmentStatus || "")
        .toLowerCase();


      if (status.includes("transit")) {
        transit++;
      }


      if (status.includes("deliver")) {
        delivered++;
      }


      const progress =
        Number(data.progress) || 0;


      shipmentList.innerHTML += `

        <div style="
          background:#1e293b;
          padding:20px;
          margin-top:15px;
          border-radius:15px;
          border:1px solid #334155;
        ">

          <h3 style="
            color:#38bdf8;
            margin-top:0;
          ">
            ${docItem.id}
          </h3>


          <p>
            <strong>Customer:</strong>
            ${data.customerName || "N/A"}
          </p>


          <p>
            <strong>Location:</strong>
            ${data.currentLocation || "N/A"}
          </p>


          <p>
            <strong>Status:</strong>
            ${data.shipmentStatus || "Pending"}
          </p>


          <p>
            <strong>Progress:</strong>
            ${progress}%
          </p>


          <div style="
            width:100%;
            height:10px;
            background:#334155;
            border-radius:20px;
            overflow:hidden;
            margin-top:10px;
          ">

            <div style="
              width:${Math.min(progress,100)}%;
              height:100%;
              background:#22c55e;
              border-radius:20px;
            "></div>

          </div>


          <div style="
            display:flex;
            gap:10px;
            margin-top:18px;
          ">

            <button
              onclick="editShipment('${docItem.id}')"
              style="
                margin-top:0;
                background:#2563eb;
                flex:1;
              "
            >
              ✏️ Edit
            </button>


            <button
              onclick="deleteShipment('${docItem.id}')"
              style="
                margin-top:0;
                background:#dc2626;
                flex:1;
              "
            >
              🗑️ Delete
            </button>

          </div>

        </div>

      `;

    });


    totalElement.textContent = total;

    transitElement.textContent = transit;

    deliveredElement.textContent = delivered;


    if (total === 0) {

      shipmentList.innerHTML = `
        <div class="empty-message">
          No shipments found.
        </div>
      `;

    }


  } catch (error) {

    console.error(
      "Error loading shipments:",
      error
    );


    shipmentList.innerHTML = `
      <div style="
        color:#fca5a5;
        background:#450a0a;
        padding:15px;
        border-radius:10px;
      ">
        Unable to load shipments.
      </div>
    `;

  }

}


window.addShipment = async function () {

  try {

    const trackingId =
      document.getElementById("trackingId")
        .value.trim();

    const customerName =
      document.getElementById("customerName")
        .value.trim();

    const currentLocation =
      document.getElementById("currentLocation")
        .value.trim();

    const shipmentStatus =
      document.getElementById("shipmentStatus")
        .value.trim();

    const progress =
      document.getElementById("progress")
        .value;


    if (
      !trackingId ||
      !customerName ||
      !currentLocation ||
      !shipmentStatus ||
      progress === ""
    ) {

      alert(
        "Please fill in all shipment fields."
      );

      return;

    }


    const editingTrackingId =
      window.editingTrackingId;


    if (editingTrackingId) {

      /*
        UPDATE EXISTING SHIPMENT
      */

      await setDoc(
        doc(
          db,
          "shipments",
          editingTrackingId
        ),
        {

          customerName:
            customerName,

          currentLocation:
            currentLocation,

          shipmentStatus:
            shipmentStatus,

          progress:
            Number(progress)

        }
      );


      alert(
        "Shipment updated successfully!"
      );


      window.editingTrackingId =
        null;


    } else {

      /*
        CREATE NEW SHIPMENT
      */

      await setDoc(
        doc(
          db,
          "shipments",
          trackingId
        ),
        {

          customerName:
            customerName,

          currentLocation:
            currentLocation,

          shipmentStatus:
            shipmentStatus,

          progress:
            Number(progress)

        }
      );


      alert(
        "Shipment added successfully!"
      );

    }


    /*
      CLEAR FORM
    */

    document.getElementById(
      "trackingId"
    ).value = "";

    document.getElementById(
      "customerName"
    ).value = "";

    document.getElementById(
      "currentLocation"
    ).value = "";

    document.getElementById(
      "shipmentStatus"
    ).value = "";

    document.getElementById(
      "progress"
    ).value = "";


    /*
      RELOAD SHIPMENTS
    */

    await loadShipments();


  } catch (error) {

    console.error(
      "Error saving shipment:",
      error
    );

    alert(
      "Shipment could not be saved. Check the browser console."
    );

  }

};
loadShipments();
window.deleteShipment = async function (trackingId) {

  const confirmed =
    confirm(
      `Are you sure you want to delete shipment ${trackingId}?`
    );


  if (!confirmed) {
    return;
  }


  try {

    await deleteDoc(
      doc(db, "shipments", trackingId)
    );


    alert(
      "Shipment deleted successfully."
    );


    await loadShipments();


  } catch (error) {

    console.error(
      "Error deleting shipment:",
      error
    );


    alert(
      "Unable to delete shipment."
    );

  }

};
window.editShipment = async function (trackingId) {

  try {

    const shipmentRef =
      doc(db, "shipments", trackingId);

    const shipment =
      await getDocs(
        collection(db, "shipments")
      );

    let shipmentData = null;

    shipment.forEach((item) => {

      if (item.id === trackingId) {
        shipmentData = item.data();
      }

    });


    if (!shipmentData) {

      alert("Shipment could not be found.");

      return;

    }


    document.getElementById("trackingId").value =
      trackingId;

    document.getElementById("customerName").value =
      shipmentData.customerName || "";

    document.getElementById("currentLocation").value =
      shipmentData.currentLocation || "";

    document.getElementById("shipmentStatus").value =
      shipmentData.shipmentStatus || "";

    document.getElementById("progress").value =
      shipmentData.progress || 0;


    window.editingTrackingId = trackingId;


    alert(
      "Shipment loaded into the form. Make your changes, then save it."
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });


  } catch (error) {

    console.error(
      "Error loading shipment for editing:",
      error
    );

    alert(
      "Unable to load shipment for editing."
    );

  }

};