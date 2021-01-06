import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    AsyncStorage
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-cards';
import Icon from 'react-native-vector-icons/FontAwesome'

export default class EventList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoading: false
        }
    }

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
    componentWillMount = () => {
        this.checkLogin();
    }



    renderRow = ({ item }) => {
        return (
            <Card style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', alignItems: "center", padding: 20 }}>
                <View style={{ marginLeft: 20 }}>
                    <Text style={{ fontSize: 20 }}>{"Rank " + item.rank}</Text>
                </View>
                <View style={{ marginRight: 30, alignContent: 'center' }} >
                    <Text style={{ fontSize: 20 }}>{item.name}</Text>
                </View>
                <View style={{ alignContent: 'center', marginRight: 20, flexDirection: 'row' }} >
                    <View style={{ marginTop: 3, }}>
                        <Icon name='trophy' size={20} color={"#FFD700"} />
                    </View>
                    <View style={{ marginLeft: 5 }}>
                        <Text style={{ fontSize: 20 }}>{item.score}</Text>
                    </View>
                </View>
            </Card>
        )
    }

    render() {

        return (
            <SafeAreaView style={{ marginTop: -45, flex: 1 }}>
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

    async componentDidMount() {
        const userid = await AsyncStorage.getItem('userid');
        this.setState({ userid: userid });
        this.getData();
    }
    async componentDidUpdate() {
        const userid = await AsyncStorage.getItem('userid');
        this.setState({ userid: userid });
    }


    getData = (userid) => {
        this.setState({ isLoading: true });
        fetch('http://localhost:3000/api/user/leaderboard?userid=' + this.state.userid, {
            method: "GET",
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => response.json())
            .then((json) => {
                if (!json.err) {
                    let count = 1;
                    this.setState({ items: [] });
                    for (let item of json) {
                        item.rank = count;
                        var score = item.score > 100 ? 100 : item.score;
                        item.score = score;
                        this.state.items.push(item);
                        count++;
                    }
                    console.log(this.state.items);
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
    header_style: {

        width: '100%',
        height: 45,
        backgroundColor: '#00BCD4',
        alignItems: 'center',
        justifyContent: 'center'

    }

});

