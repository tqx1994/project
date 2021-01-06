import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    AsyncStorage,
    StyleSheet,
    View,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'


export default class EventDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            joined: false,
            desc: props.route.params.desc,
            name: props.route.params.hostname,
            participantCount: props.route.params.participantCount,
            startTime: props.route.params.startTime,
            endTime: props.route.params.endTime,
            location: props.route.params.location,
            title: props.route.params.title
        };
    }

    convertEventTime = () => {
        var st = new Date(this.state.startTime);
        var et = new Date(this.state.endTime);
        var stMin = st.getMinutes();
        if (stMin < 10) stMin = "0" + stMin;
        else stMin = stMin.toString();
        var etMin = et.getMinutes();
        if (etMin < 10) etMin = "0" + etMin;
        else etMin = etMin.toString();
        return (st.getDate() + "/" + (st.getMonth() + 1) + "/" + st.getFullYear() + " " + st.getHours() + ":" + stMin + " - " + et.getHours() + ":" + etMin);
    }

    joinEvent = () => {
        this.setState({ joined: !this.state.joined });
    }

    render() {

        return (
            <SafeAreaView>
                <ScrollView bounces={false} style={{ marginTop: -45, marginBottom: -30, backgroundColor: 'white' }}>

                    <View >
                        <Image
                            source={require('./fitness.jpg')}
                            style={{ width: 500, height: 300, }}
                            blurRadius={3}
                        />
                        <View style={{ marginTop: 250, width: 500, height: 50, position: 'absolute', backgroundColor: 'rgba(0,0,0,.8)', }}>
                        </View>
                        <View style={styles.nameView}>
                            <Text style={styles.nameText}>{this.state.title}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', padding: 5, justifyContent: 'space-between' }}>
                        {/* hostname */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ padding: 10 }}>
                                <Icon name="user-circle-o" size={20} />
                            </View>
                            <View style={{ padding: 10 }}>
                                <Text style={{ color: '#731659', fontSize: 15, fontWeight: "300" }}>{this.state.name}</Text>
                            </View>
                        </View>
                        {/* number of participants */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ padding: 10 }}>
                                <Icon name="group" size={20} />
                            </View>
                            <View style={{ padding: 10 }}>
                                <Text style={{ color: '#731659', fontSize: 15, fontWeight: "300" }}>Participants: {this.state.participantCount}</Text>
                            </View>
                        </View>
                    </View>

                    <Divider></Divider>

                    <View style={{ flexDirection: 'row', padding: 5, justifyContent: 'space-between' }}>
                        {/* datetime */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ padding: 10 }}>
                                <FeatherIcon name="calendar" size={20} />
                            </View>
                            <View style={{ padding: 10 }}>
                                <Text style={{ color: '#731659', fontSize: 15, fontWeight: "300" }}>{this.convertEventTime()}</Text>
                            </View>
                        </View>
                        {/* location */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ padding: 10 }}>
                                <MaterialIcon name="location-on" size={20} />
                            </View>
                            <View style={{ padding: 10 }}>
                                <Text style={{ color: '#731659', fontSize: 15, fontWeight: "300" }}>{this.state.location}</Text>
                            </View>
                        </View>
                    </View>
                    <Divider></Divider>
                    <View style={{ padding: 10 }}>
                        <Text>{this.state.desc}</Text>
                    </View>
                    <TouchableOpacity style=
                        {this.state.joined ? styles.red : styles.green}
                        onPress={this.joinEvent}>
                        <View>
                            <Text style=
                                {styles.text}>{this.state.joined ? "Leave" : "Join"} Event</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        )
    };

}


const styles = StyleSheet.create({
    nameView: {
        position: 'absolute',
        marginTop: 243,
        padding: 10,

    },
    nameText: {
        fontSize: 35,
        color: 'white',
        fontWeight: "200",
    },
    hostView: {
        padding: 20,
    },
    green: {
        height: 50,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: "#2ecc71",
        justifyContent: "center", shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,

    },
    red: {
        height: 50,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: "#e74c3c",
        justifyContent: "center", shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    text: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFF",
        textAlign: "center",
        justifyContent: "center"
    },
    RectangleShapeView: {

        marginTop: 20,
        width: 120 * 2,
        height: 70,


    }
})


