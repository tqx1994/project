import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    AsyncStorage,
    FlatList,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Avatar } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Divider } from 'react-native-elements';


export default class test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoading: false,
            inputEmail: ""
        }
    }
    backToLogin = () => {
        AsyncStorage.setItem("userid", "");
        AsyncStorage.setItem("email", "");
        AsyncStorage.setItem("name", "");
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'MainTab' }],
        });
        this.props.navigation.navigate('MainStack', { screen: 'Login' });
    }

    async componentDidMount() {
        const userid = await AsyncStorage.getItem('userid');
        const email = await AsyncStorage.getItem('email');
        const name = await AsyncStorage.getItem('name');
        this.setState({ email: email, name: name, userid: userid });
        this.getData();
    }

    render() {
        return (
            <SafeAreaView>
                <View style={{ height: 300, flexDirection: "column", justifyContent: 'space-between', marginTop: -45 }}>
                    <View style={{ flex: 1, backgroundColor: '#0072ff' }}>
                        <View style={{ flex: 1, position: 'absolute', alignSelf: 'center' }}>
                            <Avatar
                                rounded

                                source={require('./johndoe.png')}
                                onPress={() => console.log("Works!")}
                                activeOpacity={0.7}
                                size={150}
                                containerStyle={{ marginTop: 20 }}
                            />
                        </View>
                        <View style={{
                            position: 'absolute',
                            marginTop: 160,
                            padding: 10,
                            alignSelf: 'center'
                        }}>
                            <Text style={{
                                fontSize: 35,
                                color: 'white',
                                fontWeight: "300",
                            }}>
                                {this.state.name}
                            </Text>
                        </View>
                        <View style={{
                            position: 'absolute',
                            marginTop: 200,
                            padding: 10,
                            alignSelf: 'center'
                        }}>
                            <Text style={{
                                fontSize: 20,
                                color: 'white',
                                fontWeight: "300",
                                textAlign: 'center'
                            }}>{this.state.email}</Text>
                        </View>

                        <View style={{
                            position: 'absolute',
                            marginTop: 250,
                            padding: 10,
                            alignSelf: 'center',
                            justifyContent: 'center'
                        }}>
                            <TouchableOpacity style={styles.logoutButton}
                                activeOpacity={0.7}
                                onPress={this.backToLogin}>
                                <Text style={{
                                    marginTop: 3,
                                    fontSize: 15,
                                    color: "white",
                                    fontWeight: "400",
                                    textAlign: 'center'
                                }}>LOGOUT</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    {/* findfriend */}
                </View>
                <View style={{ flexDirection: "row", marginTop: 10, justifyContent: 'space-between' }}>
                    <View style={{ marginLeft: 20, marginTop: 6 }}>
                        <TextInput placeholder="Enter Friend Email"
                            onChangeText={text => this.setState({ inputEmail: text })} value={this.state.inputEmail} />
                    </View>
                    <View style={{ marginLeft: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.7} onPress={this.addFriend}>
                            <Text style={{ textAlign: 'center', marginTop: 6, color: "white" }}>ADD</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Divider style={{ borderBottomWidth: 0.5 }} ></Divider>
                <FlatList bounces={true}
                    data={this.state.items}
                    renderItem={this.renderRow}
                    refreshing={this.state.isLoading}
                    onRefresh={this.getData}
                    keyExtractor={(i, k) => k.toString()}
                />

            </SafeAreaView >
        )

    }
    renderRow = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 10, marginBottom: 5, padding: 5 }}>
                <View>
                    <Avatar
                        rounded
                        icon={{ name: 'user', type: 'font-awesome' }}
                        onPress={() => console.log("Works!")}
                        activeOpacity={0.7}
                        size={40}
                    />
                </View>
                <View style={{ marginLeft: 20, marginTop: 5 }}>
                    <Text style={{ fontSize: 20, fontWeight: "300" }}>{item.name}</Text>

                </View>
            </View>
        )
    };

    getData = () => {
        this.setState({ isLoading: true });
        fetch('http://localhost:3000/api/user/friendlist?userid=' + this.state.userid, {
            method: "GET",
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => response.json())
            .then((json) => {
                var items = [];
                if (!json.err) {
                    for (let item of json) {
                        items.push(item);
                    }
                }
                this.setState({ items: items });
                this.setState({ isLoading: false });
            })
            .catch((error) => {
                console.error(error);
            });
    }
    addFriend = () => {
        var email = this.state.inputEmail;
        if (email.length < 5) {
            Alert.alert("Please enter an email")
            return
        }
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            console.log("Email is Not Correct");
            Alert.alert("Friend Successfully Added")
            return
        }
        else
            console.log(this.state);
        return fetch('http://localhost:3000/api/user/addfriend', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.userid,
                email: this.state.inputEmail
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                if (json.success) {
                    Alert.alert(json.success)
                    this.setState({ inputEmail: "" })
                    this.getData()
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
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    logoutButton: {
        backgroundColor: '#CA1C04',
        width: 100,
        height: 30,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CA1C04'
    },
    buttonContainer: {
        width: 50,
        alignItems: 'center',
        height: 30,
        marginRight: 20,
        backgroundColor: '#2ecc71',
    },
});