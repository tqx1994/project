import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList,
    AsyncStorage
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-cards';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from "moment";


export default class Feed extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        items: [],
        isLoading: false
    }
    renderRow = ({ item }) => {
        return (
            <Card style={{ borderRadius: 10 }}>
                <View style={{}}>

                    <View style={{ flexDirection: 'column' }}>

                        <View style={{ marginLeft: 10, padding: 10 }}>
                            <Text style={{ fontSize: 25, fontWeight: "500" }}>{item.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginLeft: 10, padding: 10 }}>
                                <Icon name='trophy' size={20} color={"#FFD700"} />
                            </View>
                            <View style={{ marginTop: 8 }}>
                                <Text style={{ fontSize: 20, color: "red" }}>{item.score} POINTS</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: 10, padding: 10 }}>
                            <Text style={{ fontSize: 15 }}>{item.activity}</Text>
                        </View>


                    </View>
                    <View style={{ position: "absolute", left: 230, bottom: 10 }}>
                        <Text>{moment(item.time).format('LLL')}</Text>
                    </View>

                </View>
            </Card>

        );
    }

    async componentDidMount() {
        const userid = await AsyncStorage.getItem('userid');
        this.setState({ userid: userid });
        this.getData();
    }

    async componentDidUpdate() {
        const userid = await AsyncStorage.getItem('userid');
        this.setState({ userid: userid });
        // this.getData();
    }

    getData = (userid) => {
        this.setState({ isLoading: true });
        fetch('http://localhost:3000/api/user/feed?userid=' + this.state.userid, {
            method: "GET",
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => response.json())
            .then((json) => {
                if (!json.err) {
                    let count = 1;
                    let items = [];
                    for (let item of json) {
                        item.rank = count;
                        items.push(item);
                        count++;
                    }
                    this.setState({ items: items });
                    this.setState({ isLoading: false });
                } else {

                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    render() {

        return (
            <SafeAreaView style={{ marginTop: -45 }}>

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

};