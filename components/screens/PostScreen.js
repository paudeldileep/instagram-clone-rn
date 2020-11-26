import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native"
import { Camera } from "expo-camera"
import * as ImagePicker from "expo-image-picker"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const PostScreen = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null)
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [image, setImage] = useState(null)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === "granted")

      const galleryStatus = await ImagePicker.requestCameraRollPermissionsAsync()
      setHasGalleryPermission(galleryStatus.status === "granted")
    })()
  }, [])

  const takePicture = async () => {
    if (camera) {
      const options = {quality: 0.1};
      const data = await camera.takePictureAsync(options)
      setImage(data.uri)
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    console.log(result)

    if (!result.cancelled) {
      setImage(result.uri)
    }
  }

  if (hasPermission === null || hasGalleryPermission === null) {
    return <View />
  }
  if (hasPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera or Galery</Text>
  }

  if (image !== null) {
    return (
      <View style={{ flex: 1, marginTop: 70,marginBottom:5 }}>
        {image && <Image source={{ uri: image }} style={{ flex:1 }} />}
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('SavePost', { image })}>
          <Text>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>setImage(null)}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1, marginVertical: 70 }}
        type={type}
        
        ref={(ref) => {
          camera = ref
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 30,
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
            onPress={pickImage}
          >
            <MaterialCommunityIcons
              name='camera-image'
              style={{ color: "#fff", fontSize: 40 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
            onPress={takePicture}
          >
            <MaterialCommunityIcons
              name='camera'
              style={{ color: "#fff", fontSize: 40 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              )
            }}
          >
            <MaterialCommunityIcons
              name='camera-switch'
              style={{ color: "#fff", fontSize: 40 }}
            />
          </TouchableOpacity>
        </View>
      </Camera>
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  )
}

export default PostScreen

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#E53935",
    marginTop: 15,
    padding: 10,
    marginHorizontal:10,
    borderRadius: 5,
    alignItems: "center",
  },
})
