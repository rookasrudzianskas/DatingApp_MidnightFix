import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet, Text, TouchableOpacity,
    View
} from 'react-native';
import HomeScreen from "./src/screens/HomeScreen";
import MatchesScreen from "./src/screens/MatchesScreen";
import {FontAwesome, Fontisto, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

import Amplify from 'aws-amplify'
import config from './src/aws-exports';
import { withAuthenticator } from "aws-amplify-react-native";
import ProfileScreen from "./src/screens/ProfileScreen";
import { Hub } from 'aws-amplify';
import {DataStore} from 'aws-amplify';

import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

Amplify.configure({
    ...config,
    Analytics: {
        disabled: true,
    },
});



const App = () => {

    const color = '#b5b5b5';
    const activeColor = '#ff0065';
    const [activeScreen, setActiveScreen] = useState('HOME');
    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        // Create listener
        const listener = Hub.listen('datastore', async hubData => {
            const  { event, data } = hubData.payload;
            if (event === 'modelSynced' && data?.model?.name === 'User') {
                // console.log(`User has a network connection: ${data.active}`)
                // console.log('User Model has finished syncing 🔥', JSON.stringify(data) );
                setIsUserLoading(false);
            }
        });

        return () => listener();
    }, []);

    DataStore.start().then();

    const renderPage = () => {

        if(activeScreen === 'HOME') {
            return <HomeScreen isUserLoading={isUserLoading} />
        }

        if(isUserLoading) {
            return <ActivityIndicator size="large" color="primary" style={{flex: 1,}} />
        }

        if(activeScreen === 'CHAT') {
            return <MatchesScreen />
        }

        if(activeScreen === 'PROFILE') {
            return <ProfileScreen />
        }
    }


    return (
        <SafeAreaView style={{flex: 1,}}>
            <View style={styles.pageContainer}>
                {/*{activeScreen === 'HOME' || activeScreen === 'CHAT' && (*/}
                    <View style={[tw`flex flex-row mt-6`, {justifyContent: 'space-around', width: '100%'}]}>
                        <TouchableOpacity onPress={() => setActiveScreen('HOME')}>
                            <Fontisto name="tinder" size={30} color={activeScreen === 'HOME' ? activeColor  : color} />
                        </TouchableOpacity>
                        <MaterialCommunityIcons name="star-four-points" size={30} color={color} />
                        <Pressable onPress={() => setActiveScreen('CHAT')}>
                            <Ionicons name="ios-chatbubbles" size={30} color={activeScreen === 'CHAT' ? activeColor  : color} />
                        </Pressable>
                        <Pressable onPress={() => setActiveScreen('PROFILE')}>
                            <FontAwesome name="user" size={30} color={activeScreen === 'PROFILE' ? activeColor  : color} />
                        </Pressable>
                    </View>
                {/*)}*/}

                {isUserLoading ? <ActivityIndicator size={'large'} style={{flex: 1,}} /> : renderPage() }

                <StatusBar style="auto" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
    },
});

export default withAuthenticator(App);
