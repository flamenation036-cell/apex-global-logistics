import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
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

  shipmentList.innerHTML = "";



  const querySnapshot =
    await getDocs(collection(db, "shipments"));



  querySnapshot.forEach((docItem) => {

    const data = docItem.data();



    shipmentList.innerHTML += `

      <div style="
        background:white;
        color:black;
        padding:15px;
        margin-top:15px;
        border-radius:10px;
      ">

        <h3>${docItem.id}</h3>

        <p><b>Customer:</b> ${data.customerName}</p>

        <p><b>Location:</b> ${data.currentLocation}</p>

        <p><b>Status:</b> ${data.shipmentStatus}</p>

        <p><b>Progress:</b> ${data.progress}%</p>

      </div>

    `;

  });

}


window.addShipment = async function () {

  try {

    const trackingId =
      document.getElementById("trackingId").value.trim();

    const customerName =
      document.getElementById("customerName").value.trim();

    const currentLocation =
      document.getElementById("currentLocation").value.trim();

    const shipmentStatus =
      document.getElementById("shipmentStatus").value.trim();

    const progress =
      document.getElementById("progress").value;

    if (!trackingId || !customerName || !currentLocation || !shipmentStatus || progress === "") {
      alert("Please fill in all shipment fields.");
      return;
    }

    await setDoc(doc(db, "shipments", trackingId), {

      customerName: customerName,
      currentLocation: currentLocation,
      shipmentStatus: shipmentStatus,
      progress: Number(progress)

    });

    alert("Shipment Added Successfully!");

    document.getElementById("trackingId").value = "";
    document.getElementById("customerName").value = "";
    document.getElementById("currentLocation").value = "";
    document.getElementById("shipmentStatus").value = "";
    document.getElementById("progress").value = "";

    await loadShipments();

  } catch (error) {

    console.error("Error adding shipment:", error);

    alert("Shipment could not be added. Check the browser console for the error.");

  }

};
