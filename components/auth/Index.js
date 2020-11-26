import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity, Image } from 'react-native'

const Index = ({navigation}) => {
    return (
        <View style={styles.container}>
            
            <TouchableOpacity style={styles.buttons}  onPress={()=>navigation.navigate("Register")}><Text>Register</Text></TouchableOpacity>
            <TouchableOpacity style={styles.buttons}  onPress={()=>navigation.navigate("Login")}><Text>Log In</Text></TouchableOpacity>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        
        padding:10,
        
    },
    buttons:{
        margin:5,
        padding:10,
        borderRadius:5,
        backgroundColor:'#E53935',
        alignItems:'center',
    }

})
