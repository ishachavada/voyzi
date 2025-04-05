import { View, TextInput, ScrollView, Image, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from './AppText';
import { BlurView } from 'expo-blur';

const HomeScreen = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const categoryData = [
        { name: 'Music Shows', image: require('./assets/images/music_shows.jpg') },
        { name: 'Comedy', image: require('./assets/images/samay-raina.jpg') },
        { name: 'Gatherings', image: require('./assets/images/gatherings.jpeg') },
        { name: 'Arts', image: require('./assets/images/lifestyle-working-arts-crafts.jpg') },
    ];

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocation('Permission denied');
                setLoading(false);
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            let coords = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });

            if (coords.length > 0) {
                setLocation(`${coords[0].city}`);
            } else {
                setLocation('Location not found');
            }
            setLoading(false);
        })();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 }}>

            {/* Location */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 70 }}>
                <View>
                    <AppText style={{ fontSize: 16, color: '#888' }}>Location</AppText>
                    {loading ? (
                        <ActivityIndicator size="small" color="black" />
                    ) : (
                        <AppText weight="bold" style={{ fontSize: 19 }}>{location}</AppText>
                    )}
                </View>
                <Ionicons name="notifications-outline" size={24} color="black" />
            </View>

            {/* Search bar */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 10, padding: 10, marginVertical: 15 }}>
                <Ionicons name="search" size={20} color="#888" style={{ marginRight: 10 }} />
                <TextInput placeholder="Search Events" style={{ flex: 1, fontFamily: 'Poppins_400Regular' }} />
                <MaterialIcons name="tune" size={20} color="#888" />
            </View>


            <View style={{ marginBottom: 20 }}>
                {/* Categories */}
                <AppText weight="bold" style={{ fontSize: 30, marginBottom: 10, marginTop: 15 }}>Popular Categories</AppText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                    {categoryData.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                height: 200,
                                width: 300,
                                borderRadius: 15,
                                marginRight: 15,
                                overflow: 'hidden',
                            }}
                            onPress={() => navigation.navigate('CategoryEvents', { category: item.name })}
                        >
                            <ImageBackground
                                source={item.image}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                imageStyle={{ borderRadius: 15 }}
                            >
                                {/* Black Overlay */}
                                <View
                                    style={{
                                        ...StyleSheet.absoluteFillObject,
                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                        borderRadius: 15,
                                    }}
                                />
                                <AppText weight="bold" style={{
                                    color: '#fff',
                                    fontSize: 35,
                                    textAlign: 'center',
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderRadius: 10,
                                }}>
                                    {item.name}
                                </AppText>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Upcoming Events */}
            <AppText weight="bold" style={{ fontSize: 28, marginTop: 30, marginBottom: 15 }}>
                Upcoming Events
            </AppText>

            <ScrollView vertical showsHorizontalScrollIndicator={false}>
                <View
                    style={{
                        width: 370,
                        height: 95,
                        borderRadius: 15,
                        marginRight: 15,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <BlurView
                        intensity={50}
                        tint="dark"
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            borderRadius: 15,
                            overflow: 'hidden',
                        }}
                    >
                        <View
                            style={{
                                ...StyleSheet.absoluteFillObject,
                                backgroundColor: 'rgba(255, 255, 255, 0.83)',
                            }}
                        />
                    </BlurView>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('EventDetails')}
                        style={{ flex: 1 }}
                    >
                        <View style={{ flex: 1, padding: 15, justifyContent: 'flex-end' }}>
                            <AppText weight="bold" style={{ fontSize: 19, color: 'black', marginBottom: 3 }}>
                                Jaipur Literature Fest
                            </AppText>
                            <AppText style={{ color: '#4F4F4F' }}>
                                Jaipur, Rajasthan
                            </AppText>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>



            {/* Bottom Navigation */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', bottom: 20, left: 0, right: 0, padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' }}>
                <Ionicons name="home" size={24} color="#ff7f50" />
                <Ionicons name="heart-outline" size={24} color="#888" />
                <Ionicons name="person-outline" size={24} color="#888" />
            </View>
        </View >
    );
};

export default HomeScreen;
