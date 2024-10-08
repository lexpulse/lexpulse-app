import { ActivityIndicator, View, Text, TextInput, ScrollView, TouchableOpacity, ImageBackground, Image, Dimensions, KeyboardAvoidingView, Modal, Switch } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/color'
import style from '../theme/style'
import themeContext from '../theme/themeContex'
import { useNavigation } from '@react-navigation/native';
import { AppBar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Avatar } from 'react-native-paper'
import OtpInputs from 'react-native-otp-inputs'
import Clipboard from '@react-native-clipboard/clipboard'
import { SafeAreaView } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet';
import { EventRegister } from 'react-native-event-listeners'
import { ENDPOINTS } from '../api/constants';
import axios from 'axios';
import { AuthContext } from '../../App';


const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Profile() {
    const theme = useContext(themeContext);
    const { signOut } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const [darkMode, setDarkMode] = useState('false');
    
    const [loading, onLoading] = useState(true);
    const [error, onError] = useState('');
    const [profile, setProfile] = useState({});
    const [isvisible, setIsVisible] = useState(false)

    const fetchData = async () => {
        const jsonValue = await AsyncStorage.getItem('userDetails');
        const parsedValue = JSON.parse(jsonValue);
        
        try {
            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${parsedValue.token}`
                }
            };
            
            var url = `${ENDPOINTS.signup}/${parsedValue.user.id}`;
        
            axios.get(url, config)
            .then((res) => {
                onLoading(false);
                setProfile(res.data.data);
            })
            .catch(error => {
                
                if (error.response) {
                    if(error.response.status === 403) {
                        signOut();
                        return;
                    }

                    onLoading(false);
                    onError(error.response.data.msg);
                } else if (error.request) {
                    console.log(error.request);
                    onLoading(false);
                    onError('Problem signing in. Please try later!');
                } else {
                    onLoading(false);
                    onError('Problem signing in. Please try later!');
                }
            });
            
        } catch (error) {
            onLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchDataAndHandleErrors = async () => {
            try {
                await fetchData();
            } catch (error) {
                console.log('Error in fetchData:', error);
                // Handle errors here if needed
            }
        };
    
        fetchDataAndHandleErrors();
    }, [fetchData]);

    const logOut = () => {
        AsyncStorage.removeItem('userDetails');
        navigation.navigate("Login");
    };

    return (
        <SafeAreaView style={[style.area, { backgroundColor: theme.bg }]}>
            <View style={[style.main, { backgroundColor: theme.bg, marginTop: 30 }]}>
                <View style={{ backgroundColor: theme.bg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../../assets/image/logo1.png')} resizeMode='stretch' style={{ height: height / 35, width: width / 15 }} />
                        <Text style={[style.apptitle, { color: theme.txt, marginLeft: 10 }]}>Profile</Text>
                    </View>
                    {/* <TouchableOpacity 
                        style={{ flexDirection: 'row', alignItems: 'center' }} 
                        onPress={
                            () => {
                                setDarkMode(!darkMode);
                                EventRegister.emit('ChangeTheme', darkMode)
                            }
                        }>
                        {
                            darkMode ? (
                                <Icon name='sunny-outline' color={Colors.secondary} size={25} style={{ marginRight: 5 }} />
                            ) : (
                                <Icon name='moon-outline' color={Colors.active} size={25} style={{ marginRight: 5 }} />
                            )
                        }
                    </TouchableOpacity> */}
                </View>
                {
                    loading ? (
                        <View style={{ width: '100%', height: '100%', paddingTop: '30%' }}>
                            <ActivityIndicator size="large" color="#584CF4" />
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            {
                                profile ? (
                                    profile?.user ? (
                                        profile?.user?.image[0] ? (
                                            <Image source={{ uri: profile?.user?.image[0] }} resizeMode='stretch' style={{ height: height / 7, width: width / 3.2, borderRadius: 100 }} />
                                        ) : (
                                            <Image source={require('../../assets/image/user.png')} resizeMode='stretch' style={{ height: height / 7, width: width / 3.2 }} />
                                        )
                                    ) : (
                                        <Image source={require('../../assets/image/user.png')} resizeMode='stretch' style={{ height: height / 7, width: width / 3.2, borderRadius: 100 }} />
                                    )
                                ) : (
                                    <Image source={require('../../assets/image/user.png')} resizeMode='stretch' style={{ height: height / 7, width: width / 3.2 }} />
                                )
                            }
                            <Text style={[style.title, { color: theme.txt, marginTop: 15, marginBottom: 10 }]}>{`${profile?.user?.firstName} ${profile?.user?.lastName}`}</Text>
                            <Text style={[style.r12, { color: theme.txt, marginLeft: 10 }]}>{profile?.user?.email}</Text>
                        </View>
                    )
                }
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[style.divider, { backgroundColor: theme.border, marginVertical: 15 }]}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[style.title, { color: theme.txt, }]}></Text>
                            <Text style={[style.r16, { color: theme.disable2, marginTop: 10 }]}></Text>
                        </View>
                        <View style={[style.verticaldivider, { backgroundColor: theme.border, height: '80%' }]}></View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[style.title, { color: theme.txt, }]}>{profile?.points ? (profile?.points?.newBalance) : ('0')}</Text>
                            <Text style={[style.r16, { color: theme.disable2, marginTop: 10 }]}>Points Earned</Text>
                        </View>
                        <View style={[style.verticaldivider, { backgroundColor: theme.border, height: '80%' }]}></View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[style.title, { color: theme.txt, }]}></Text>
                            <Text style={[style.r16, { color: theme.disable2, marginTop: 10 }]}></Text>
                        </View>
                    </View>
                    <View style={[style.divider, { backgroundColor: theme.border, marginVertical: 15 }]}></View>

                    {/* <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icons name='calendar-month-outline' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Manage Events</Text>
                        </View>
                        <Icons name='chevron-right' color={theme.txt} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='chatbubble-ellipses-outline' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Message Center</Text>
                        </View>
                        <Icons name='chevron-right' color={theme.txt} size={30} />
                    </TouchableOpacity>

                    <View style={[style.divider, { backgroundColor: theme.border, marginVertical: 15 }]}></View> */}

                    <TouchableOpacity onPress={() => navigation.navigate('Profile2', { profile: profile })}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icons name='account-outline' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Update Profile</Text>
                        </View>
                        <Icons name='chevron-right' color={theme.txt} size={30} />
                    </TouchableOpacity>

                    {/* <TouchableOpacity onPress={() => navigation.navigate('Notification')}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icons name='bell-outline' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Notification</Text>
                        </View>
                        <Icons name='chevron-right' color={theme.txt} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Payment')}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icons name='wallet-outline' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Payments</Text>
                        </View>
                        <Icons name='chevron-right' color={theme.txt} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Linkaccount')}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icons name='swap-vertical' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Linked Account</Text>
                        </View>
                        <Icons name='chevron-right' color={theme.txt} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icons name='ticket' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Ticket Issue</Text>
                        </View>
                        <Icons name='chevron-right' color={theme.txt} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Security')}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='shield-checkmark-outline' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Security</Text>
                        </View>
                        <Icons name='chevron-right' color={theme.txt} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Language')}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icons name='google-circles-communities' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Language</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10, marginRight: 5 }]}>English(US)</Text>
                            <Icons name='chevron-right' color={theme.txt} size={30} />
                        </View>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icons name='eye-outline' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Dark Mode</Text>
                        </View>
                        <View style={{ marginRight: 6 }}>
                            <Switch
                                value={darkMode}
                                onValueChange={
                                    (value) => {
                                        setDarkMode(value);
                                        EventRegister.emit('ChangeTheme', value)
                                    }
                                }
                            />
                        </View>

                    </TouchableOpacity> */}

                    <TouchableOpacity onPress={() => navigation.navigate('Helpcenter')}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='information-circle-outline' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Help Center</Text>
                        </View>
                        <Icons name='chevron-right' color={theme.txt} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Invited')}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icons name='account-group-outline' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Invite Friends</Text>
                        </View>
                        <Icons name='chevron-right' color={theme.txt} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsVisible(true)}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icons name='logout' size={25} color="#F75555" />
                            <Text style={[style.b18, { color: '#F75555', marginLeft: 10 }]}>Log Out</Text>
                        </View>
                        {/* <Icons name='chevron-right' color={theme.txt} size={30} /> */}
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='star-outline' size={25} color={theme.txt} />
                            <Text style={[style.b18, { color: theme.txt, marginLeft: 10 }]}>Rate Us</Text>
                        </View>
                        <Icons name='chevron-right' color={theme.txt} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.RBSheet8.open()}
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 90 }}>
                        <RBSheet ref={ref => {
                            this.RBSheet8 = ref;
                        }}
                            height={200}
                            openDuration={100}
                            customStyles={{
                                container: {
                                    borderTopRightRadius: 20,
                                    borderTopLeftRadius: 20,
                                    backgroundColor: theme.bg
                                }
                            }}>
                            <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                                <Text style={[style.apptitle, { textAlign: 'center', color: '#F75555' }]}>Logout</Text>
                                <View style={[style.divider, { marginVertical: 15, backgroundColor: theme.border }]}></View>
                                <Text style={[style.subtitle, { textAlign: 'center', color: theme.txt }]}>Are you sure you want to log out?</Text>
                                <View style={{ marginVertical: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity onPress={() => this.RBSheet8.close()}
                                            style={[style.btn, { backgroundColor: theme.btn }]}>
                                            <Text style={[style.btntxt, { color: Colors.primary }]}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginHorizontal: 10 }}></View>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity onPress={() => { this.RBSheet8.close(), signOut() }}
                                        style={[style.btn,]}>
                                            <Text style={[style.btntxt, { color: Colors.secondary }]}>Yes, Logout</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </RBSheet>
                        <View style={{ flexDirection: 'row' }}>
                            <Icons name='logout' size={25} color="#F75555" />
                            <Text style={[style.b18, { color: '#F75555', marginLeft: 10 }]}>Log Out</Text>
                        </View>
                    </TouchableOpacity> */}
                </ScrollView>

                <Modal transparent={true} visible={isvisible}>
                    <View style={{
                        flex: 1,
                        backgroundColor: '#000000aa',
                        transparent: 'true'
                    }}>
                        <View style={[style.modalcontainer, { backgroundColor: theme.bg, width: width - 40, borderRadius: 30 ,marginVertical:110}]}>
                            <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => { setIsVisible(false) }}>
                                        <Icon name='close' size={20} color={theme.txt} />
                                    </TouchableOpacity>
                                </View>
                                <Image source={require('../../assets/image/logout.png')} resizeMode='stretch' style={{ height: height / 5.5, width: width / 2.5, alignSelf: 'center', marginTop: 10 }} />
                                <Text style={[style.apptitle, { color: Colors.primary, textAlign: 'center', marginTop: 20 }]}>See you soon!</Text>
                                <Text style={[style.r16, { color: theme.txt, textAlign: 'center', marginTop: 10 }]}>Are you sure you want to log out?</Text>
                                <View style={{ marginTop: 20 }}>
                                    <TouchableOpacity onPress={() => {setIsVisible(false), signOut()}}
                                        style={style.btn}>
                                        <Text style={style.btntxt}>Yes, Logout</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <TouchableOpacity onPress={() => setIsVisible(false)}
                                        style={[style.btn,{backgroundColor:theme.btn}]}>
                                        <Text style={[style.btntxt,{color:Colors.primary}]}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>


            </View>
        </SafeAreaView>
    )
}