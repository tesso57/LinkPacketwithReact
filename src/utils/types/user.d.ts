import { firebase } from "../../firebase"
import {Packet} from "./packet";

export type User = {
    id: string;
    packetRefs: any[];
    displayName: string | null;
    photoUrl: string | null;
}
//firebase.firestore.DocumentReference<Packet>[];
