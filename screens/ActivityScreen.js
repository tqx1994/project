import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    FlatList,
    AsyncStorage
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Divider } from 'react-native-elements';
import ProgressCircle from 'react-native-progress-circle'
import { Card } from 'react-native-cards';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome'

export default class ActivityScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoading: false,
            percent: 0
        };
    }

    insertData = (activityID, score) => {
        return fetch('http://localhost:3000/api/user/insertactivity', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: this.state.userid,
                activityID: activityID,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.success) {
                    // success
                    this.setState({ percent: (this.state.percent + score > 100) ? 100 : (this.state.percent + score) })
                } else {
                    // unsuccessful
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    renderRow = ({ item }) => {
        return (

            <View style={{ flex: 1, flexDirection: "row" }}>
                <TouchableOpacity activeOpacity={0.6} onPress={() => this.insertData(item.id, item.score)}>
                    <Card style={styles.cardStyle}>
                        <View>
                            <Icon name='trophy' size={40} color={"#FFD700"} />
                        </View>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontSize: 20, color: "red" }}>{item.score} POINTS</Text>
                        </View>
                        <View style={{ textAlign: "center" }}>
                            <Text style={{ textAlign: "center" }}>{item.name}</Text>
                        </View>
                    </Card>
                </TouchableOpacity>

            </View>

        )

    };
    render() {
        return (
            <SafeAreaView style={{ marginTop: -45, flex: 1 }}>

                <View style={{
                    marginBottom: 20,
                    flexDirection: 'column',
                    justifyContent: "space-between",
                    backgroundColor: "#0072ff"
                }}>

                    <View style={{ padding: 20 }}>

                        <Text style={{ fontSize: 30, fontWeight: "200", color: 'white' }}>
                            Daily Activity Level
                    </Text>
                    </View>
                    <View style={{ alignSelf: "center", marginBottom: 40, }}>
                        <ProgressCircle
                            percent={this.state.percent}
                            radius={70}
                            borderWidth={8}
                            color="#FFB900"
                            shadowColor="black"
                            bgColor="#0072ff"
                        >
                            <Text style={{ fontSize: 30, fontWeight: "200", color: 'white' }}>{this.state.percent}</Text>
                            <Text style={{ color: "white" }}>POINTS</Text>
                        </ProgressCircle>
                    </View>

                    <Divider></Divider>
                </View>

                <FlatList bounces={true}
                    numColumns={2}
                    data={this.state.items}
                    renderItem={this.renderRow}
                    refreshing={this.state.isLoading}
                    onRefresh={this.getData}
                    keyExtractor={(i, k) => k.toString()}
                />
            </SafeAreaView >
        );
    }

    async componentDidMount() {
        const userid = await AsyncStorage.getItem('userid');
        this.setState({ userid: userid });
        this.getData();
    }
    async componentDidUpdate() {
        const userid = await AsyncStorage.getItem('userid');
        if (userid != this.state.userid) {
            this.setState({ userid: userid });
            this.getData();
        }
    }

    getData = (userid) => {
        this.setState({ isLoading: true });
        fetch('http://localhost:3000/api/user/activities', {
            method: "GET",
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => response.json())
            .then((json) => {
                if (!json.err) {
                    this.setState({ items: [] });
                    for (let item of json) {
                        this.state.items.push(item);
                    }
                    console.log(this.state.items);
                } else {

                }
            })
            .catch((error) => {
                console.error(error);
            });
        fetch('http://localhost:3000/api/user/progress?userid=' + this.state.userid, {
            method: "GET",
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => response.json())
            .then((json) => {
                if (!json.err) {
                    this.setState({ percent: json.score });
                    this.setState({ isLoading: false });
                } else {

                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

const styles = StyleSheet.create({
    category: {
        width: 150,
        height: 150
    },

    cardStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        alignItems: "center",
        padding: 20, borderRadius: 10, width: 200, height: 150
    },
})