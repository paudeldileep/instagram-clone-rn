import React, { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Button,
  TouchableHighlight,
  Modal,
} from "react-native"
import { auth, db } from "../auth/firebase"
import firebase from "firebase"
import { connect } from "react-redux"

import ProgressBar from "react-native-progress/Bar"
import { fetchUserPosts } from "../redux/action"

const SavePostScreen = ({ navigation, route, fetchUserPosts }) => {
  const [caption, setCaption] = useState("")
  const [progress, setprogress] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)

  console.log(route.params)
  const uploadImage = async () => {
    setModalVisible(true)
    const uri = route.params.image
    const childPath = `post/${auth.currentUser.uid}/${Math.random().toString(
      36
    )}`
    console.log(childPath)

    const response = await fetch(uri)
    const blob = await response.blob()

    const task = firebase.storage().ref().child(childPath).put(blob)

    const taskProgress = (snapshot) => {
      //console.log(`transferred: ${snapshot.bytesTransferred}`)
      const progress = Number(
        (snapshot.bytesTransferred / snapshot.totalBytes).toFixed(1)
      )

      setprogress(progress)
    }

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot)
        console.log(snapshot)
      })
    }

    const taskError = (snapshot) => {
      console.log(snapshot)
    }

    task.on("state_changed", taskProgress, taskError, taskCompleted)
  }

  const savePostData = (downloadURL) => {
    db.collection("posts")
      .doc(auth.currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        setprogress(0)
        fetchUserPosts()
        setModalVisible(false)

        navigation.popToTop()
        // props.navigation.navigate('Home');
      })
  }

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.")
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Uploading Post..</Text>
            <ProgressBar progress={progress} width={200} />
          </View>
        </View>
      </Modal>
      <Image source={{ uri: route.params.image }} style={{ flex: 1 }} />
      <TextInput
        placeholder='Write a Caption . . .'
        onChangeText={(caption) => setCaption(caption)}
      />

      <Button title='Save' onPress={() => uploadImage()} />
    </View>
  )
}

export default connect(null, { fetchUserPosts })(SavePostScreen)

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
})
