import { auth } from "../auth/firebase"
import React, { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import { FontAwesome } from "@expo/vector-icons"

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"

import FeedScreen from "./FeedScreen"
import ProfileScreen from "./ProfileScreen"
import SearchScreen from "./SearchScreen"

import { connect } from "react-redux"
//import { bindActionCreators } from 'redux'
import { clearData, fetchUser,fetchUserPosts } from "../redux/action"

const Tab = createMaterialBottomTabNavigator()
const EmptyScreen = () => {
  return null
}

const HomeScreen = ({ fetchUser, currentUser,clearData,fetchUserPosts }) => {
  useEffect(() => {
    clearData()
    fetchUser()
   fetchUserPosts()
  }, [])

  return (
    <Tab.Navigator
      initialRouteName='Feed'
      shifting={true}
      labeled={false}
      activeColor='#E53935'
      barStyle={{ backgroundColor: "grey" }}
      
    >
      <Tab.Screen
        name='Feed'
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name='home' color={color} size={26} />
          ),
         tabBarColor:'grey'
        }}
      />
      <Tab.Screen
        name='Search'
        component={SearchScreen}
      
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name='search' color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name='AddPost'
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault()
            navigation.navigate("Post")
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name='plus-square' color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault()
            navigation.navigate("Profile",{uid:auth.currentUser.uid})
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name='user' color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps, { fetchUser,fetchUserPosts,clearData })(HomeScreen)

const styles = StyleSheet.create({})
