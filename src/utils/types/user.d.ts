import { Packet } from "."
import { firebase } from "../../firebase"

export type User = {
    id: string;
    packetRefs: firebase.firestore.DocumentReference<firebase.firestore.DocumentData<Packet>>[];
    subscribePacketRefs: firebase.firestore.DocumentReference<firebase.firestore.DocumentData<Packet>>[];
    displayName: string | null;
    photoUrl: string | null;
}
