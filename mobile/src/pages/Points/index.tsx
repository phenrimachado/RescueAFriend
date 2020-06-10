import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Friend {
  id: number,
  species: string,
  image_url: string
}

interface Point {
  id: number,
  image: string,
  image_url: string,
  name: string,
  latitude: number,
  longitude: number,
}

interface Location {
  uf: string,
  city: string
}


const Points: React.FC = () => {
  const navigation = useNavigation(); 
  const route = useRoute();

  const routeParams = route.params as Location;

  const [friends, setFriends] = useState<Friend[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    api.get('points', {
      params: {
        uf: routeParams.uf,
        city: routeParams.city,
        friends: selectedFriends
      }
    }).then(response => {
        setPoints(response.data);
        console.log(response.data);
      });
  }, [selectedFriends]);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();
      
      if(status !== 'granted') {
        Alert.alert('Ooops...', 'Precisamos de sua permissão para obter a localização.');
        return;
      } 

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInitialPosition([ latitude, longitude ]);
    }

    loadPosition();
  }, []);

  useEffect(() => {
    api.get('friends').then(response => {
      setFriends(response.data);
    })
  }, []);

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { id });
  }

  function handleNavigationBack() {
    navigation.goBack();
  }

  function handleSelectFriend(id: number) {
    const alreadySelected = selectedFriends.findIndex(friend => friend === id); 

    if(alreadySelected >= 0) {
      const filteredFriends = selectedFriends.filter(friend => friend !== id);
      setSelectedFriends(filteredFriends);
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  }
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um amiguinho.</Text>

        <View style={styles.mapContainer}>
          { initialPosition[0] !== 0 && (
            <MapView
            style={styles.map}
            initialRegion={{
              latitude: initialPosition[0],
              longitude: initialPosition[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
              }}
            >
            {points.map((point) => (
              <Marker 
                key={String(point.id)}
                style={styles.mapMarker}
                onPress={() => handleNavigateToDetail(point.id)}
                coordinate={{ 
                  latitude: point.latitude,
                  longitude: point.longitude
                }}
                >

                <View style={styles.mapMarkerContainer}>
                  <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                  <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32}}>

          {friends.map(friend => (
              <TouchableOpacity
              key={String(friend.id)}
              style={[
                styles.item,
                selectedFriends.includes(friend.id) ? styles.selectedItem : {}
              ]}
              onPress={() => handleSelectFriend(friend.id)}
              activeOpacity={0.6}>
                <SvgUri width={42} height={42} uri={friend.image_url} />
                <Text style={styles.itemTitle}>{friend.species}</Text>
              </TouchableOpacity>
            ))
          }

        </ScrollView>
      </View>
    </>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;