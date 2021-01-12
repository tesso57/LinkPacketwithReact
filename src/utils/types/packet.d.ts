import {firebase} from "../../firebase";
import {User, URL} from "./index";

export type Packet = {
    id: string;
    userRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
    urlRefs: URL[];
    title: string;
    postedDate: Date;
}
