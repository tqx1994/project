import React, { Component } from 'react';
import {
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    Image,
    AsyncStorage,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log(error);
        }
    };

    checkLogin = async () => {
        try {
            const value = await AsyncStorage.getItem('userid');
            if (value !== null && value !== "") {
                console.log(value);
                // user is logged in
                this.props.navigation.navigate('Events')
            } else {
                // not logged in
                this.props.navigation.navigate('MainStack');
            }
        } catch (error) {
            console.log(error);
            // not logged in
            this.props.navigation.navigate('MainStack');
        }
    };

    postLogin = () => {
        var email = this.state.email;
        var password = this.state.password;
        // if (email.length < 1) {
        //     console.log('Your text is less than what is required.');
        //     Alert.alert("Please fill in the required field")
        //     return
        // }
        // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // if (reg.test(email) === false) {
        //     console.log("Email is incorrect");
        //     Alert.alert("Invalid Email Format")
        //     return
        // }
        // if (password.length < 7) {
        //     Alert.alert("Password must contain least 8 characters")
        //     return
        // }
        // else
        console.log(this.state);
        return fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.success) {
                    Alert.alert(json.success)
                    this.storeData("userid", json.id.toString());
                    this.storeData("email", this.state.email);
                    this.storeData("name", json.name.toString());
                    this.props.navigation.navigate('Events')
                } else {
                    Alert.alert(json.err)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    register = () => {
        this.props.navigation.navigate('Register');
    }

    componentDidMount() {
        this.checkLogin();
    }
    render() {
        return (
            <>
                <SafeAreaView style={{ marginTop: -130, flex: 0, backgroundColor: '#00c6ff' }} />
                <SafeAreaView style={{ flex: 1, backgroundColor: '#0072ff' }}>
                    <LinearGradient
                        colors={['#00c6ff', '#0072ff']}
                        style={{
                            flex: 1, justifyContent: 'center', alignItems: 'center'
                        }}
                    >
                        <View style={{}}>
                            <Image
                                style={{ width: 100, height: 100, }}
                                source={require('./icon.png')}></Image>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 40, fontWeight: "200", color: "white" }}>HealthMate</Text>
                        </View>
                        <View style={styles.container}>
                            <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor="rgba(255,255,255,0.7)" onChangeText={text => this.setState({ email: text })} value={this.state.email} />
                            <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor="rgba(255,255,255,0.7)" onChangeText={text => this.setState({ password: text })} secureTextEntry={true} value={this.state.password} />
                        </View>
                        <View style={{ marginBottom: 40, flexDirection: 'row' }}>
                            <Text style={{ color: "rgba(255,255,255,0.7)" }}>Don't have an account? </Text>
                            <TouchableOpacity activeOpacity={0.7} onPress={this.register}>
                                <Text style={{ fontWeight: "600" }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.7} onPress={this.postLogin}>
                            <Text style={styles.buttonText}>LOGIN</Text>
                        </TouchableOpacity>


                    </LinearGradient>
                </SafeAreaView>

            </>

        );
    }
}
const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#FFF',
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10
    },
    container: {
        marginTop: 20,
        padding: 20,
        width: 300,
    },
    buttonContainer: {
        backgroundColor: '#0652DD',
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
})