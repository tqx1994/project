import React, { Component } from 'react';
import {
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    AsyncStorage,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: ""
        };
    }
    backToLogin = () => {
        this.props.navigation.navigate('Login');
    }
    render() {
        return (
            <>

                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 0.1, padding: 50, backgroundColor: '#0072ff' }}>
                        <Text style={{ fontSize: 40, color: 'white', fontWeight: "200" }}>Sign Up</Text>
                    </View>

                    <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }} >

                        <View style={{ marginTop: -10 }}>
                            <View style={styles.container}>
                                <TextInput style={styles.input} placeholder="Enter your desired name" placeholderTextColor="grey" onChangeText={text => this.setState({ name: text })} value={this.state.name} />
                                <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor="grey" onChangeText={text => this.setState({ email: text })} value={this.state.email} />
                                <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor="grey" onChangeText={text => this.setState({ password: text })} secureTextEntry={true} value={this.state.password} />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.7} onPress={this.createAccount}>
                                    <Text style={styles.buttonText}>SIGN UP</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                                <Text>Already have an account? </Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                <TouchableOpacity style={{
                                    backgroundColor: '#0652DD',
                                    paddingVertical: 10,
                                    width: 180,
                                    alignItems: 'center',
                                    borderRadius: 10
                                }} activeOpacity={0.7} onPress={this.backToLogin}>
                                    <Text style={styles.buttonText}>Back to Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View >
                    </View>


                </SafeAreaView>
            </>

        );
    }
    storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log(error);
        }
    };
    createAccount = () => {
        var email = this.state.email;
        var name = this.state.name;
        var password = this.state.password;
        if (name.length < 3) {
            console.log('Your name length is less than what is required.');
            Alert.alert("Name must contain at least 4 characters")
            return
        }
        if (email.length < 1) {
            console.log('Your text is less than what is required.');
            Alert.alert("Email is required")
            return
        }
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            console.log("Email is Not Correct");
            Alert.alert("Invalid Email Format")
            return
        }
        if (password.length < 1) {
            Alert.alert("Password field must not be empty")
            return
        }
        if (password.length < 7) {
            Alert.alert("Password must contain at least 8 characters")
            return
        }
        if ((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(password)) === false) {
            Alert.alert("Password must contain at least 1 uppercase and 1 lowercase letter and 1 number");
            return
        }
        else
            console.log(this.state);
        return fetch('http://localhost:3000/api/user/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                if (json.success) {
                    Alert.alert("Account Successfully Created!")
                    this.storeData("userid", json.id.toString());
                    this.storeData("email", this.state.email);
                    this.storeData("name", this.state.name);
                    this.props.navigation.navigate('Events')
                } else {
                    Alert.alert(json.err)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

}
const styles = StyleSheet.create({
    container: {
        padding: 5,
        width: 300,
        marginTop: 50

    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,1)',
        color: 'black',
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10
    },
    buttonContainer: {
        backgroundColor: '#00c6ff',
        paddingVertical: 10,
        width: 250,
        alignItems: 'center',
        borderRadius: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700'
    }
});