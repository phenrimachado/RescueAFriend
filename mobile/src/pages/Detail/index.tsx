import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, Linking} from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer'
import Constants from 'expo-constants';
import { RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';

interface Params {
  point_id: number;
}

interface Data {
  point: {
    image: string,
    image_url: string,
    name: string,
    age: string,
    description: string,
    uf: string,
    city: string,
    whatsapp: string,
    email: string,
  }
  friends: {
    species: string
  }[];
}


const Detail = () => {

  const navigation = useNavigation();
  const route = useRoute();

  const id = route.params as Params;
  
  const [data, setData] = useState<Data>({} as Data);

  useEffect(() => {
    api.get(`points/${id.id}`).then(response => {
      setData(response.data);
      console.log(response.data);
    })
  },[]);

  function handleNavigationBack() {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Tenho interesse em adotar o seu amiguinho.',
      recipients: [data.point.email],
    })
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse em adotar o seu amiguinho.`);
  }

  if(!data.point) {
    return null;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        
        <Image style={styles.pointImage} source={{ uri: `http://192.168.0.101:3333/uploads/${data.point.image}` }} />
      
        <Text style={styles.pointName}>{data.point.name}, {data.point.age}</Text>
        <Text style={styles.pointItems}>
          {data.friends[0].species}
        </Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>{data.point.description}</Text>
        </View>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>    
          <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#FFF"/>
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#FFF"/>
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight
  },

  pointImage: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  descriptionContainer: {
    marginTop: 15
  },

  descriptionTitle: {
    color: '#322153',
    fontSize: 20,
    fontFamily: 'Roboto_500Medium',
    marginBottom: 5
  },

  descriptionText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 20,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;