import React, { Component } from 'react';
import {
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    Alert,
    AsyncStorage
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import FeatherIcon from "react-native-vector-icons/Feather"

export default class CreateEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible1: false,
            isVisible2: false,
            chosenDateStart: '',
            chosenDateEnd: '',
            eventName: '',
            location: '',
            description: ''

        }

    }
    alert = () => {
        Alert.alert(
            "Event Created!"
        )
    }
    backToEvents = () => {
        this.props.navigation.navigate('Events')
    }
    functionCombined = () => {
        this.backToEvents();
        this.alert();
    }
    handleStartPicker = (datetime) => {
        this.setState({
            isVisible1: false,
            chosenDateStart: moment(datetime).format('LLL'),
            chosenDateStartValue: moment(datetime).format('YYYY-MM-DD HH:mm')
        })
    }
    showStartPicker = () => {
        this.setState({
            isVisible1: true
        })
    }
    hideStartPicker = () => {
        this.setState({
            isVisible1: false,
        })
    }
    handleEndPicker = (datetime) => {
        this.setState({
            isVisible2: false,
            chosenDateEnd: moment(datetime).format('LLL'),
            chosenDateEndValue: moment(datetime).format('YYYY-MM-DD HH:mm')
        })
    }
    showEndPicker = () => {
        this.setState({
            isVisible2: true
        })
    }
    hideEndPicker = () => {
        this.setState({
            isVisible2: false,
        })
    }
    render() {
        return (
            <SafeAreaView>
                <ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ marginLeft: 40 }}>
                            <Text>Event Name</Text>
                        </View>
                        <View style={{ padding: 10, marginLeft: 30, marginRight: 30 }}>
                            <TextInput
                                style={{ fontSize: 30 }}
                                style={{ borderBottomWidth: 1 }}
                                onChangeText={text => this.setState({ eventName: text })} value={this.state.eventName}
                            />
                        </View>

                        <View style={{ marginLeft: 40, marginTop: 10 }}>
                            <Text>Location</Text>
                        </View>
                        <View style={{ padding: 10, marginLeft: 30, marginRight: 30 }}>
                            <TextInput
                                style={{ fontSize: 30 }}
                                style={{ borderBottomWidth: 1 }}
                                onChangeText={text => this.setState({ location: text })} value={this.state.location}
                            />
                        </View>
                        <View style={{ marginLeft: 40, marginTop: 10, flexDirection: 'row' }}>
                            <Text>Select Start Date & Time</Text>
                            <DateTimePickerModal
                                isVisible={this.state.isVisible1}
                                onConfirm={this.handleStartPicker}
                                onCancel={this.hideStartPicker}
                                mode={'datetime'}
                            />
                        </View>
                        <View style={{ padding: 10, marginLeft: 30, marginRight: 30, flexDirection: "row" }}>

                            <View>
                                <TouchableOpacity onPress={this.showStartPicker}>
                                    <FeatherIcon name="calendar" size={20} color={"#0072ff"} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TextInput style={{ borderBottomWidth: 1, width: 300, marginLeft: 15 }}>
                                    {this.state.chosenDateStart}
                                </TextInput>
                            </View>
                        </View>
                        <View style={{ marginLeft: 40, marginTop: 10, flexDirection: 'row' }}>
                            <Text>Select End Date & Time</Text>
                            <DateTimePickerModal
                                isVisible={this.state.isVisible2}
                                onConfirm={this.handleEndPicker}
                                onCancel={this.hideEndPicker}
                                mode={'datetime'}
                            />
                        </View>
                        <View style={{ padding: 10, marginLeft: 30, marginRight: 30, flexDirection: "row" }}>

                            <View>
                                <TouchableOpacity onPress={this.showEndPicker}>
                                    <FeatherIcon name="calendar" size={20} color={"#0072ff"} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TextInput style={{ borderBottomWidth: 1, width: 300, marginLeft: 15 }}>
                                    {this.state.chosenDateEnd}
                                </TextInput>
                            </View>
                        </View>

                        <View style={{ marginLeft: 40, marginTop: 20 }}>
                            <Text>Description</Text>
                        </View>
                        <View style={{ padding: 20, marginLeft: 20, marginRight: 20 }}>
                            <TextInput
                                style={{ borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderTopWidth: 1, height: 100, borderRadius: 10, borderColor: 'green' }}
                                multiline={true}
                                scrollEnabled={false}
                                onChangeText={text => this.setState({ description: text })} value={this.state.description}
                            />
                        </View>
                        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={this.createEvent}>
                            <View>
                                <Text style={styles.text}>Create Event</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>


            </SafeAreaView >

        )
    }

    async componentDidMount() {
        const userid = await AsyncStorage.getItem('userid');
        this.setState({ userid: userid });
    }

    async componentDidUpdate() {
        const userid = await AsyncStorage.getItem('userid');
        this.setState({ userid: userid });
    }

    createEvent = () => {
        var title = this.state.eventName;
        var startTime = this.state.chosenDateStart;
        var endTime = this.state.chosenDateEnd;
        var location = this.state.location;
        var description = this.state.description;

        if (title.length < 3) {
            console.log('Your name length is less than what is required.');
            Alert.alert("Event Name must be longer")
            return
        }
        if (location.length < 3) {
            console.log("Location length too short");
            Alert.alert("Please provide a valid location");
            return
        }
        if (startTime.length < 1) {
            console.log('No start time selected');
            Alert.alert("Unable to create event without a Start Time");
            return
        }
        if (endTime.length < 1) {
            console.log('No end time selected');
            Alert.alert("Unable to create event without a End Time");
            return
        }

        if (description.length < 10) {
            console.log("Description length too short");
            Alert.alert("Please give a little bit more details in your description")
            return
        }
        else
            console.log(this.state);
        return fetch('http://localhost:3000/api/user/createevent', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.userid,
                participantID: this.state.userid,
                title: this.state.eventName,
                startTime: this.state.chosenDateStartValue,
                endTime: this.state.chosenDateEndValue,
                location: this.state.location,
                description: this.state.description
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                if (json.success) {
                    this.functionCombined()
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
    button: {
        height: 50,
        marginLeft: 40,
        marginRight: 40,
        borderRadius: 20,
        backgroundColor: "#0169FF",
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
    }
})
