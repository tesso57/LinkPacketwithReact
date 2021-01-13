import {firebase} from "../../firebase";
import {URL} from "./index";

export type Packet = {
    id: string;
    userRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData<User>>;
    urls: URL[];
    title: string;
    postedDate: Timestamp;
}