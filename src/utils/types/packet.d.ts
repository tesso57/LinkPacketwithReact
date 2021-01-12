import {firebase} from "../../firebase";
import {User, Tag} from "./index";

export type Packet = {
    id: string;
    userRef: firebase.firestore.DocumentReference<User>;
    tagRefs: firebase.firestore.DocumentReference<Tag>[];
    title: string;
    urls: strings[];
    postedDate: Date;
}
