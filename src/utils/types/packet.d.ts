import {firebase} from "../../firebase";
import {URL} from "./index";
import firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;

export type Packet = {
    id: string;
    userRef: firebase.firestore.DocumentReference;
    urls: URL[];
    title: string;
    postedDate: Timestamp;
}
