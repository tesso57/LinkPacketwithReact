import { firebase } from "../../firebase"
import {Packet} from "./packet";

export type User = {
    id: string;
    packetRefs?: firebase.firestore.DocumentReference<Packet>[];
    displayName: string | null;
    photoUrl: string | null;
}
