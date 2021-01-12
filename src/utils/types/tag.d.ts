import {firebase} from "../../firebase";
import {Packet} from "./packet";
export type Tag = {
    id: string;
    name: string;
    packetRefs: firebase.firestore.DocumentReference<Packet>[];
}
