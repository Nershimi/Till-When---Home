import { initialApp } from "../Hosting/initialApp.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

initialApp;
const db = getFirestore(initialApp);

function addNewProduct(product) {
  addDoc(collection(db, "productsOfUsers"), {
    productsType: product.productsType,
    productName: product.productName,
    company: product.company,
    expiryDate: product.expiryDate,
    created: new Date(),
  })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
