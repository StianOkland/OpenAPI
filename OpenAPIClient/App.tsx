import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Alert,
  StyleSheet,
  Button,
} from 'react-native';
import {Picker} from '@react-native-community/picker'
import {enhetApi} from './api';

const App = () => {
  const [names, setNames] = useState([]);
  const [schools, setSchools] = useState({})
  const [status, setStatus] = useState('Ingen skoler er hentet')
  const [statusNavn, setNavnstatus] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('')
  const [orgnr, setOrg] = useState('')
  const [fylkesnr, setFylke] = useState('')
  const [kommunenr, setKomunne] = useState('')
  const [lastSelected, setLastselected] = useState(new Array('','',''));





  const getSchools = async () => {

    try {
      const fetchedgschool = await enhetApi.getEnheterEndretEtterDato('1800.01.01');
      setSchools(fetchedgschool.data.filter(function(item) {
        if(item.ErGrunnskole == true || item.ErVideregaaendeSkole == true){
          return item;
        }
      }).map(function({Navn, Orgnr, Kommunenr, Fylkesnr}) {
        setStatus('Skoler er tilgjengelig, hent navn')
        return {Navn, Orgnr, Kommunenr, Fylkesnr}
      }));


    } catch (error) {
      console.warn(error)
      Alert.alert('An error occurred');
    }
  };
  

  const addNames = () => {
    for(let i = 0; i < Object.keys(schools).length;) {
      names.push(schools[i]["Navn"])
      i += 1
    }
    setNavnstatus('Navn er nå hentet, velg skole fra menyen')
  }

  const selectChange = (value) => {
    setLastselected([value].concat(lastSelected))
    for(let i = 0; i < Object.keys(schools).length;) {
      if(schools[i]["Navn"] == value.toString()) {
        setOrg(schools[i]["Orgnr"])
        setKomunne(schools[i]["Kommunenr"])
        setFylke(schools[i]["Fylkesnr"])
      }
      i += 1
    }

    setSelectedSchool(value)
  }

  
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text style={styles.schools}>Velg din skole?</Text>

          <Button title="Hent skoler" onPress={() => getSchools()} />
          <View style={styles.space}/>
          <Button title="Skole navn" onPress={() => addNames()} />

          <Picker
            selectedValue={selectedSchool}
            onValueChange={(itemValue) => selectChange(itemValue)}
          >

            <Picker.Item label={lastSelected[0]} value={lastSelected[0]} />
            <Picker.Item label={lastSelected[1]} value={lastSelected[1]} />
            <Picker.Item label={lastSelected[2]} value={lastSelected[2]} />
            <Picker.Item label={''} value={''} />

            {names.map(name => {
              return (<Picker.Item label={name} value={name} key={name} />)
            })}
            
          </Picker>

          <Text style={styles.info}>{status}</Text>
          <Text style={styles.info}>{statusNavn}</Text>
          <Text style={styles.schools}>Navn: {selectedSchool}</Text>
          <Text style={styles.schools}>Orgnr: {orgnr}</Text>
          <Text style={styles.schools}>Fylkesnr: {fylkesnr}</Text>
          <Text style={styles.schools}>kommunenr: {kommunenr}</Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 20,
    margin: 20,
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '900',
  },
  info: {
    fontSize: 15,
    padding: 10,
    marginTop: 10,
  },
  schools: {
    fontSize: 20,
    padding: 10,
    marginTop: 10,
  },
  space: {
    width: 10,
    height: 10
  }
});

export default App;