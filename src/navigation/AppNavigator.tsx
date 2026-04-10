import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Villa, Restaurant, Wahana, DiningItem, Event } from '../types';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VillaDetailScreen from '../screens/VillaDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import PaymentScreen from '../screens/PaymentScreen';
import BookingSuccessScreen from '../screens/BookingSuccessScreen';
import MapViewScreen from '../screens/MapViewScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import SearchScreen from '../screens/SearchScreen';
import FnBScreen from '../screens/FnBScreen';
import FnBOrderScreen from '../screens/FnBOrderScreen';
import FnBCartScreen from '../screens/FnBCartScreen';
import WahanaListScreen from '../screens/WahanaListScreen';
import WahanaDetailScreen from '../screens/WahanaDetailScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventsScreen from '../screens/EventsScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import PaymentHistoryScreen from '../screens/PaymentHistoryScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import PrivacySecurityScreen from '../screens/PrivacySecurityScreen';
import LanguageRegionScreen from '../screens/LanguageRegionScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import TermsPoliciesScreen from '../screens/TermsPoliciesScreen';

// Navigation
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                onLogin={() => setIsAuthenticated(true)}
                onNavigateRegister={() => props.navigation.navigate('Register')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => (
              <RegisterScreen
                onRegister={() => setIsAuthenticated(true)}
                onNavigateLogin={() => props.navigation.goBack()}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MainTabs">
          {(props) => (
            <BottomTabNavigator
              onNavigateVilla={(villa: Villa) =>
                props.navigation.navigate('VillaDetail', { villa })
              }
              onNavigateSearch={() => props.navigation.navigate('Search')}
              onNavigateEvent={(event: Event) =>
                props.navigation.navigate('EventDetail', { event })
              }
              onNavigateFnB={() => props.navigation.navigate('FnB')}
              onNavigateWahana={() => props.navigation.navigate('WahanaList')}
              onNavigateMap={() => props.navigation.navigate('MapView')}
              onNavigateEvents={() => props.navigation.navigate('Events')}
              onNavigateRestaurant={(restaurant: Restaurant) =>
                props.navigation.navigate('FnBOrder', { restaurant })
              }
              onNavigateWahanaDetail={(wahana: Wahana) =>
                props.navigation.navigate('WahanaDetail', { wahana })
              }
              onNavigatePersonalInfo={() => props.navigation.navigate('PersonalInfo')}
              onNavigatePaymentHistory={() => props.navigation.navigate('PaymentHistory')}
              onNavigateNotifications={() => props.navigation.navigate('Notifications')}
              onNavigateChat={() => props.navigation.navigate('ChatList')}
              onNavigatePrivacy={() => props.navigation.navigate('Privacy')}
              onNavigateLanguage={() => props.navigation.navigate('Language')}
              onNavigateHelp={() => props.navigation.navigate('Help')}
              onNavigateTerms={() => props.navigation.navigate('Terms')}
              onSignOut={() => setIsAuthenticated(false)}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="VillaDetail" options={{ animation: 'fade_from_bottom' }}>
          {(props: any) => (
            <VillaDetailScreen
              villa={props.route.params.villa}
              resortName="MDLAND Bengkulu"
              onBack={() => props.navigation.goBack()}
              onBook={() =>
                props.navigation.navigate('Booking', {
                  villa: props.route.params.villa,
                })
              }
              onChat={() =>
                props.navigation.navigate('ChatRoom', {
                  contact: {
                    id: `villa-${props.route.params.villa.id}`,
                    name: props.route.params.villa.name,
                    avatar: props.route.params.villa.images[0],
                    role: 'Villa Host',
                    category: 'villa',
                    lastMessage: '',
                    lastTime: '',
                    unread: 0,
                    online: true,
                  },
                })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Booking" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <BookingScreen
              villa={props.route.params.villa}
              resortName="MDLAND Bengkulu"
              onBack={() => props.navigation.goBack()}
              onProceedPayment={(_checkIn, _checkOut, _guests, totalPrice) =>
                props.navigation.navigate('Payment', {
                  totalPrice,
                  type: 'villa',
                  itemName: props.route.params.villa.name,
                })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Payment" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <PaymentScreen
              totalPrice={props.route.params.totalPrice}
              onBack={() => props.navigation.goBack()}
              onConfirm={() => props.navigation.navigate('BookingSuccess')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="BookingSuccess" options={{ animation: 'fade_from_bottom' }}>
          {(props: any) => (
            <BookingSuccessScreen
              onGoHome={() => props.navigation.popToTop()}
              onViewBookings={() => {
                props.navigation.popToTop();
                props.navigation.navigate('MyBookings');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="MapView" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <MapViewScreen
              onBack={() => props.navigation.goBack()}
              onSearch={() => props.navigation.navigate('Search')}
              onNavigateVilla={(villa: Villa) => props.navigation.navigate('VillaDetail', { villa })}
              onNavigateRestaurant={(restaurant: Restaurant) => props.navigation.navigate('FnBOrder', { restaurant })}
              onNavigateWahana={(wahana: Wahana) => props.navigation.navigate('WahanaDetail', { wahana })}
              onNavigateEvent={(event: Event) => props.navigation.navigate('EventDetail', { event })}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} />

        {/* Events Flow */}
        <Stack.Screen name="Events" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <EventsScreen
              onBack={() => props.navigation.goBack()}
              onNavigateEvent={(event: Event) =>
                props.navigation.navigate('EventDetail', { event })
              }
            />
          )}
        </Stack.Screen>

        {/* F&B Flow */}
        <Stack.Screen name="FnB" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <FnBScreen
              onBack={() => props.navigation.goBack()}
              onNavigateOrder={(restaurant: Restaurant) =>
                props.navigation.navigate('FnBOrder', { restaurant })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="FnBOrder" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <FnBOrderScreen
              restaurant={props.route.params.restaurant}
              onBack={() => props.navigation.goBack()}
              onCheckout={(items, total) =>
                props.navigation.navigate('FnBCart', { items, total })
              }
              onChat={() =>
                props.navigation.navigate('ChatRoom', {
                  contact: {
                    id: `resto-${props.route.params.restaurant.id}`,
                    name: props.route.params.restaurant.name,
                    avatar: props.route.params.restaurant.image,
                    role: 'Restaurant Manager',
                    category: 'restaurant',
                    lastMessage: '',
                    lastTime: '',
                    unread: 0,
                    online: true,
                  },
                })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="FnBCart" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <FnBCartScreen
              items={props.route.params.items}
              total={props.route.params.total}
              onBack={() => props.navigation.goBack()}
              onConfirm={() => props.navigation.navigate('BookingSuccess')}
            />
          )}
        </Stack.Screen>

        {/* Wahana Flow */}
        <Stack.Screen name="WahanaList" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <WahanaListScreen
              onBack={() => props.navigation.goBack()}
              onSelectWahana={(wahana: Wahana) =>
                props.navigation.navigate('WahanaDetail', { wahana })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="WahanaDetail" options={{ animation: 'fade_from_bottom' }}>
          {(props: any) => (
            <WahanaDetailScreen
              wahana={props.route.params.wahana}
              onBack={() => props.navigation.goBack()}
              onBuyTicket={(_wahana: Wahana, _qty: number, total: number) =>
                props.navigation.navigate('Payment', {
                  totalPrice: total,
                  type: 'wahana',
                  itemName: _wahana.name,
                })
              }
              onChat={() =>
                props.navigation.navigate('ChatRoom', {
                  contact: {
                    id: `wahana-${props.route.params.wahana.id}`,
                    name: props.route.params.wahana.name,
                    avatar: props.route.params.wahana.image,
                    role: 'Wahana Operator',
                    category: 'wahana',
                    lastMessage: '',
                    lastTime: '',
                    unread: 0,
                    online: true,
                  },
                })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Search" options={{ animation: 'fade' }}>
          {(props: any) => (
            <SearchScreen onBack={() => props.navigation.goBack()} />
          )}
        </Stack.Screen>

        {/* Event Detail */}
        <Stack.Screen name="EventDetail" options={{ animation: 'fade_from_bottom' }}>
          {(props: any) => (
            <EventDetailScreen
              event={props.route.params.event}
              onBack={() => props.navigation.goBack()}
              onBuyTicket={(_event: Event, _qty: number, total: number) =>
                props.navigation.navigate('Payment', {
                  totalPrice: total,
                  type: 'event',
                  itemName: _event.title,
                })
              }
              onChat={() =>
                props.navigation.navigate('ChatRoom', {
                  contact: {
                    id: `event-${props.route.params.event.id}`,
                    name: props.route.params.event.title,
                    avatar: props.route.params.event.image,
                    role: 'Event Organizer',
                    category: 'event',
                    lastMessage: '',
                    lastTime: '',
                    unread: 0,
                    online: true,
                  },
                })
              }
            />
          )}
        </Stack.Screen>

        {/* Profile Sub-Screens */}
        <Stack.Screen name="PersonalInfo" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <PersonalInfoScreen onBack={() => props.navigation.goBack()} />
          )}
        </Stack.Screen>

        <Stack.Screen name="PaymentHistory" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <PaymentHistoryScreen onBack={() => props.navigation.goBack()} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Notifications" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <NotificationsScreen onBack={() => props.navigation.goBack()} />
          )}
        </Stack.Screen>

        {/* Chat Flow */}
        <Stack.Screen name="ChatList" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <ChatListScreen
              onBack={() => props.navigation.goBack()}
              onOpenChat={(contact) =>
                props.navigation.navigate('ChatRoom', { contact })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="ChatRoom" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <ChatRoomScreen
              contact={props.route.params.contact}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        {/* Settings Sub-Screens */}
        <Stack.Screen name="Privacy" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <PrivacySecurityScreen onBack={() => props.navigation.goBack()} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Language" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <LanguageRegionScreen onBack={() => props.navigation.goBack()} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Help" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <HelpSupportScreen onBack={() => props.navigation.goBack()} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Terms" options={{ animation: 'slide_from_right' }}>
          {(props: any) => (
            <TermsPoliciesScreen onBack={() => props.navigation.goBack()} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
