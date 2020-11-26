import { USER_STATE_CHANGE, CLEAR_DATA,USER_POSTS_STATE_CHANGE } from "../action/types"
import { auth, db } from "../../auth/firebase"

export const clearData = () => (dispatch) => {
  dispatch({ type: CLEAR_DATA })
}
export const fetchUser = () => (dispatch) => {
  db.collection("users")
    .doc(auth.currentUser.uid)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
      } else {
        console.log("does not exist")
      }
    })
}

export const fetchUserPosts=()=>(dispatch)=>{
  db
            .collection("posts")
            .doc(auth.currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({ type: USER_POSTS_STATE_CHANGE, posts })
            })
}