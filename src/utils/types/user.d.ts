import { firebase } from "../../firebase"
import {Packet} from "./packet";

export type User = {
    id: string;
    packetRefs: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>[];
    subscribePacketRefs: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>[];
    displayName: string | null;
    photoUrl: string | null;
}
