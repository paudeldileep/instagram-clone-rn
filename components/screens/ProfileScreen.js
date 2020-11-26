import React, { useEffect, useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native"

import { connect } from "react-redux"
import { fetchUserPosts } from "../redux/action/index"

import { auth, db } from "../auth/firebase"

const ProfileScreen = ({ posts, currentUser, fetchUserPosts, route }) => {
  const [userposts, setuserposts] = useState([])
  const [user, setuser] = useState("")
  console.log(route.params.uid)
  console.log(userposts)
  useEffect(() => {
    // fetchUserPosts()

    if (route.params.uid === auth.currentUser.uid) {
      setuser(currentUser)
      setuserposts(posts)
    } else {
      db.collection("users")
        .doc(route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setuser(snapshot.data())
          } else {
            console.log("does not exist")
          }
        })
      db.collection("posts")
        .doc(route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let tempposts = snapshot.docs.map((doc) => {
            const data = doc.data()
            const id = doc.id
            return { id, ...data }
          })
          setuserposts(tempposts)
        })
    }
  }, [route.params.uid])

  return (
    <View style={styles.conainer}>
      <View style={styles.profileview}>
        <View style={styles.userinfo}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.profileimage}
          />
          <Text style={styles.username}>{user?.name}</Text>
        </View>
        <View style={styles.postcount}>
          <Text>Posts</Text>
          <Text>{userposts?.length}</Text>
        </View>
      </View>
      <View style={styles.postview}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userposts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </View>
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  conainer: {
    flex: 1,
    padding: 2,
  },
  profileview: {
    height: "20%",
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  userinfo: {
    paddingHorizontal: 5,
  },
  username: {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  profileimage: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "red",
  },
  postcount: {
    paddingVertical: 15,
    alignContent: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  postview: {
    borderTopWidth: 2,
    borderTopColor: "grey",
    paddingTop: 2,
  },
  containerImage: {
    flex: 1 / 3,
    padding: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    borderRadius: 5,
  },
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
})

export default connect(mapStateToProps, { fetchUserPosts })(ProfileScreen)
