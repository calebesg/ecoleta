import React, { useState, useEffect } from 'react'
import { View, Text, Image, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select'

import ibge from '../../services/ibge'

interface Uf {
  nome: string,
  sigla: string
}

interface City {
  nome: string
}

const Home = () => {
  const [ufs, setUfs] = useState<Uf[]>([])
  const [cities, setCities] = useState<City[]>([])

  const [selectedUf, setSelectedUf] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    ibge.get('/').then(response => {
      setUfs(response.data)
    })
  }, [])

  useEffect(() => {
    ibge.get(`/${selectedUf}/distritos?orderBy=nome`).then(response => {
      setCities(response.data)
    })
  }, [selectedUf])

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    })
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ImageBackground 
        style={styles.container}
        source={require('../../assets/home-background.png')}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu Marcketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiênte.</Text>
          </View>
        </View>

        <View style={styles.footer}>

          <RNPickerSelect 
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            placeholder={{ label: 'Uf' }}
            value={selectedUf}
            onValueChange={value => setSelectedUf(value)}
            Icon={() => <Icon name="chevron-down" size={24} color="gray" />}
            items={ufs.map(uf => (
              {
                label: uf.nome,
                value: uf.sigla 
              })
            )}
          />

          <RNPickerSelect
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            placeholder={{ label: 'Cidade' }}
            value={selectedCity}
            onValueChange={value => setSelectedCity(value)}
            Icon={() => <Icon name="chevron-down" size={24} color="gray" />}
            items={cities.map(city => (
              { 
                label: city.nome, 
                value: city.nome 
              }) 
            )}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderRadius: 10,
    color: 'black',

    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingRight: 30,
    marginBottom: 8,
  },

  inputAndroid: {
    fontSize: 16,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderRadius: 10,
    color: 'black',
    
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingRight: 30,
    marginBottom: 8,
  },

  iconContainer: {
    top: 18,
    right: 12,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32, 
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
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

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
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
})

export default Home
