import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import InputSelect from '../../components/InputSelect';

const Home = () => {
  const navigation = useNavigation();

  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');

  function handleNavigationToPoints() {

    navigation.navigate('Points', {
      uf,
      city
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../../assets/garrafa-pet.png')}
        style={styles.container}
        imageStyle={{ 
          width: 250,
          height: 250, 
          opacity: 0.03,
          marginTop: 30
          }}>
        <View style={styles.main}>
          <Text style={styles.logo}>RescueA<Text style={styles.logoGreen}>Friend</Text></Text>
          <View>
            <Text style={styles.title}>Adote, ajude e conheça novos amiguinhos</Text>
            <Text style={styles.description}>Facilitamos pessoas a encontrarem animais que estão precisando de uma ajudinha, de um novo dono ou e de novos amigos.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          
        <TextInput
            style={styles.input}
            placeholder="Digite a UF"
            value={uf}
            onChangeText={setUf}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Digite a Cidade"
            value={city}
            onChangeText={setCity}
            autoCorrect={false}
          />

          <RectButton style={styles.button}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24}/>
              </Text>
            </View>
            <Text style={styles.buttonText} onPress={handleNavigationToPoints}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  logo: {
    fontSize: 36,
    fontFamily: 'Ubuntu_700Bold',
    color: '#322153',
  },

  logoGreen: {
    color: '#34CB79',
    fontStyle: "italic"
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 60,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;