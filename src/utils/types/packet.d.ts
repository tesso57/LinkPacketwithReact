import {firebase} from "../../firebase";
import {URL} from "./index";

export type Packet = {
    id: string;
    userRef: firebase.firestore.DocumentReference;
    urls: URL[];
    title: string;
    postedDate: firebase.firestore.Timestamp;
}
