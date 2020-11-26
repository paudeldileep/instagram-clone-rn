import React, { useState } from "react"
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native"

//import firebase from "firebase"

import { auth, db } from "./firebase"

const Register = () => {
  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const[errmsg,seterrmsg]=useState(false)

  const SignUp = () => {
    console.log(email)
    auth
      .createUserWithEmailAndPassword(email.trim(), password)
      .then((result) => {
        db.collection("users").doc(auth.currentUser.uid).set({
          name,
          email,
        })
        //console.log(result)
        seterrmsg(false)
      })
      .catch((error) => {
        console.log(error)
        seterrmsg(true);
      })
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textinput}
        placeholder='Name'
        onChangeText={(name) => setname(name)}
      />
      <TextInput
        style={styles.textinput}
        placeholder='Email'
        onChangeText={(email) => setemail(email)}
        autoCapitalize='none'
      />
      <TextInput
        style={styles.textinput}
        placeholder='Password'
        secureTextEntry={true}
        onChangeText={(password) => setpassword(password)}
        autoCapitalize='none'
      />

      <TouchableOpacity style={styles.button} onPress={SignUp}>
        <Text>Register</Text>
      </TouchableOpacity>

      {errmsg && <Text style={styles.errtext}>*Please provide a valid email and password</Text> }
    </View>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding:10,
  },
  textinput: {
    borderBottomWidth: 2,
    borderBottomColor: "#E53935",
    marginTop:5,
    marginBottom:5,
    padding:5

  },
  button: {
    backgroundColor: "#E53935",
    marginTop: 15,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  errtext:{
    textAlign:'center',
    marginTop:5
  }
})
