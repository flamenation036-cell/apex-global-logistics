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

  const trackingId =
    document.getElementById("trackingId").value;

  const customerName =
    document.getElementById("customerName").value;

  const currentLocation =
    document.getElementById("currentLocation").value;

  const shipmentStatus =
    document.getElementById("shipmentStatus").value;

  const progress =
    document.getElementById("progress").value;



  await setDoc(doc(db, "shipments", trackingId), {

    customerName,

    currentLocation,

    shipmentStatus,

    progress

  });



  alert("Shipment Added Successfully");



  loadShipments();

};



loadShipments();