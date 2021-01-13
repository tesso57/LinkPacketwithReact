import {firebase} from "../../firebase";
import {URL} from "./index";
import firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;

export type Packet = {
    id: string;
    userRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
    urls: URL[];
    title: string;
    postedDate: firebase.firestore.FieldValue;
}
