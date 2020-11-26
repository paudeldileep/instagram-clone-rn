import { auth } from "./components/auth/firebase"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, Image, TouchableOpacity } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import rootReducer from "./components/redux/reducers"
import thunk from "redux-thunk"
const store = createStore(rootReducer, applyMiddleware(thunk))

import IndexScreen from "./components/auth/Index"
import RegisterScreen from "./components/auth/Register"
import LoginScreen from "./components/auth/Login"
import HomeScreen from "./components/screens/HomeScreen"
import PostScreen from "./components/screens/PostScreen"
import SavePostScreen from "./components/screens/SavePostScreen"

const Stack = createStackNavigator()

export default function App() {
  const [loaded, setloaded] = useState(false)
  const [loggedIn, setloggedIn] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        //not logged in
        setloaded(true)
        setloggedIn(false)
      } else {
        //user logged in
        setloaded(true)
        setloggedIn(true)
      }
    })
    return () => {
      //clean up action
      unsubscribe()
    }
  }, [])

  const LoadingData = () => <Text>Loading ......</Text>

  const LogoTitle=()=>(
    <Image
      style={{ width: 150, height: 50 }}
      source={require('./assets/app-logo.png')}
    />
  )

  const LogOutTitle=()=>(
    <TouchableOpacity style={styles.logoutB} onPress={()=>auth.signOut()}><Text>Sign Out</Text></TouchableOpacity>
  )

  const MainData = () => (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Index'>
        <Stack.Screen name='Index' component={IndexScreen} options={{ headerTitle: props => <LogoTitle {...props} /> }} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )

  const LoggedInData = () => (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='Home' component={HomeScreen} options={{ headerRight: props => <LogOutTitle {...props} /> }}/>
          <Stack.Screen name='Post' component={PostScreen} options={{headerShown:false}}/>
          <Stack.Screen name='SavePost' component={SavePostScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )

  return (
    <>
      {!loaded && <LoadingData />}
      {!loggedIn && loaded && <MainData />}
      {loaded && loggedIn && <LoggedInData />}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutB:{
    marginRight:10
  }
})
