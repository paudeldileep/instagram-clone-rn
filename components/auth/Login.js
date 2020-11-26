import { auth } from "./firebase"
import React,{useState} from "react"
import { StyleSheet, TextInput,TouchableOpacity,Text, View } from "react-native"

const Login = () => {
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const[errmsg,seterrmsg]=useState(false)

  const SignIn = () => {
    auth
      .signInWithEmailAndPassword(email.trim(), password)
      .then((result) => {
       // console.log(result)
        seterrmsg(false)
      })
      .catch((error) => {
        console.log(error)
        seterrmsg(true)
      })
  }
  return (
    <View style={styles.container}>
      <TextInput
      style={styles.textinput}
        placeholder='email'
        onChangeText={(email) => setemail(email)}
        autoCapitalize='none'
      />
      <TextInput
      style={styles.textinput}
        placeholder='password'
        secureTextEntry={true}
        onChangeText={(password) => setpassword(password)}
        autoCapitalize='none'
      />

<TouchableOpacity style={styles.button} onPress={SignIn}>
        <Text>Sign In</Text>
      </TouchableOpacity>

      {errmsg && <Text style={styles.errtext}>*Please provide a valid email and password</Text> }
    </View>
  )
}

export default Login

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
