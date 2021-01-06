import React, { Component } from 'react';
import {
    TouchableOpacity,
    View,
    AsyncStorage,
    Text,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardAction, CardButton, CardImage, CardContent } from 'react-native-cards';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather'


export default class EventList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoading: false,
        }
    }

    convertStartTime = (startTime) => {
        var st = new Date(startTime);
        var stMin = st.getMinutes();
        if (stMin < 10) stMin = "0" + stMin;
        else stMin = stMin.toString();
        return (st.getDate() + "/" + (st.getMonth() + 1) + "/" + st.getFullYear() + " " + st.getHours() + ":" + stMin);
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

    eventDetails = (desc, name, participantCount, startTime, endTime, location, title) => {
        console.log(endTime);
        this.props.navigation.navigate('Event Details', { desc: desc, hostname: name, participantCount: participantCount, startTime: startTime, endTime: endTime, location: location, title: title });
    }
    createEvent = () => {
        this.props.navigation.navigate('Create Event')
    }
    renderRow = ({ item }) => {
        return (
            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>

                <Card>
                    <CardImage
                        source={require('./event.png')}
                        title={item.title}
                    />
                    <CardContent text={"Hosted By: " + item.name} />
                    <CardContent text={"Start Time: " + this.convertStartTime(item.startTime)} />
                    <CardAction
                        separator={true}
                        inColumn={false}>
                        <CardButton
                            title="View Event"
                            color="#0169FF"
                            onPress={() => this.eventDetails(item.description, item.name, item.participantCount, item.startTime, item.endTime, item.location, item.title)}
                        />
                    </CardAction>
                </Card>
            </View>


        )

    };

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
                <View style={{ position: 'absolute', right: 30, bottom: 30 }}>
                    <TouchableOpacity onPress={this.createEvent}>
                        <View style={{
                            width: 50,
                            height: 50,
                            borderRadius: 100 / 2,
                            backgroundColor: '#0169FF',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Icon name="plus" size={25} color="white" style={{ fontWeight: "200" }}></Icon>

                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView >
        )

    }

    async componentDidMount() {
        this.getData();
    }

    getData = (userid) => {
        this.setState({ isLoading: true });
        fetch('http://localhost:3000/api/user/events?userid=' + this.state.userid, {
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
                    this.setState({ isLoading: false });
                } else {

                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

}

