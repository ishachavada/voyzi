import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import AppText from './AppText';

export default function CreateEventScreen() {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [images, setImages] = useState([]);

    const pickImage = async () => {
        if (images.length >= 5) return;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsMultipleSelection: false,
            quality: 1,
        });
        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const showDatePicker = () => {
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: startDate,
                onChange: (event, date) => {
                    if (date) setStartDate(date);
                },
                mode: 'date',
                is24Hour: true,
            });
        }
    };

    const showTimePicker = () => {
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: startDate,
                onChange: (event, time) => {
                    if (time) {
                        const updated = new Date(startDate);
                        updated.setHours(time.getHours());
                        updated.setMinutes(time.getMinutes());
                        setStartDate(updated);
                    }
                },
                mode: 'time',
                is24Hour: true,
            });
        }
    };

    const formatDate = (date) =>
        date.toLocaleString('en-IN', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });

    const handleSubmit = () => {
        const eventData = {
            eventName,
            description,
            location,
            organizer,
            startDate: startDate.toISOString(),
            images,
        };
        console.log('Submitted:', eventData);
    };

    return (
        <ImageBackground
            source={require('./assets/images/bg_gradient.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <BlurView intensity={50} tint="light" style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <AppText weight="bold" style={{
                        fontSize: 24,
                        marginBottom: 20,
                        marginTop: 50,
                        color: 'black',
                        textAlign: 'center'
                    }}>
                        Create Your Event
                    </AppText>

                    <AppText weight="bold" style={{ marginBottom: 5, color: 'black' }}>Event Name</AppText>
                    <TextInput
                        value={eventName}
                        onChangeText={setEventName}
                        placeholder="Enter event name"
                        style={styles.input}
                        placeholderTextColor="#666"
                    />

                    <AppText weight="bold" style={{ marginBottom: 5, color: 'black' }}>Description</AppText>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter event description"
                        multiline
                        style={[styles.input, { height: 100 }]}
                        placeholderTextColor="#666"
                    />

                    <AppText weight="bold" style={{ marginBottom: 5, color: 'black' }}>Start Date</AppText>
                    <TouchableOpacity onPress={showDatePicker}>
                        <AppText style={styles.dateText}>{formatDate(startDate)}</AppText>
                    </TouchableOpacity>

                    <AppText weight="bold" style={{ marginBottom: 5, color: 'black' }}>Start Time</AppText>
                    <TouchableOpacity onPress={showTimePicker}>
                        <AppText style={styles.dateText}>
                            {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </AppText>
                    </TouchableOpacity>

                    <AppText weight="bold" style={{ marginBottom: 5, color: 'black' }}>Location</AppText>
                    <TextInput
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Enter location"
                        style={styles.input}
                        placeholderTextColor="#666"
                    />

                    <AppText weight="bold" style={{ marginBottom: 5, color: 'black' }}>Organizer Name</AppText>
                    <TextInput
                        value={organizer}
                        onChangeText={setOrganizer}
                        placeholder="Organizer or company"
                        style={styles.input}
                        placeholderTextColor="#666"
                    />

                    <AppText weight="bold" style={{ marginBottom: 10, color: 'black' }}>Upload Images (max 5)</AppText>
                    <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                        <AppText style={styles.imageBtnText}>Pick Image</AppText>
                    </TouchableOpacity>

                    <ScrollView horizontal>
                        {images.map((uri, index) => (
                            <Image
                                key={index}
                                source={{ uri }}
                                style={{
                                    width: 80,
                                    height: 80,
                                    marginRight: 10,
                                    marginTop: 10,
                                    borderRadius: 8,
                                }}
                            />
                        ))}
                        {images.length === 0 && (
                            <AppText style={{ marginTop: 10, color: '#444' }}>No images selected.</AppText>
                        )}
                    </ScrollView>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 15,
                            paddingVertical: 14,
                            alignItems: 'center',
                            marginTop: 20,
                        }}
                    >
                        <AppText weight="bold" style={{ color: 'black', fontSize: 16 }}>
                            Submit Event
                        </AppText>
                    </TouchableOpacity>
                </ScrollView>
            </BlurView>
        </ImageBackground>
    );
}

const styles = {
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: 'black',
    },
    dateText: {
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 10,
        marginBottom: 15,
        color: 'black',
    },
    imageBtn: {
        backgroundColor: 'white',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'flex-start',
        width: 120,
        height: 50,
    },
    imageBtnText: {
        color: 'black',
        fontSize: 14,
    },
};
