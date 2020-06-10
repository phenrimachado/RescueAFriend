import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios'
import api from '../../services/api';

import Dropzone from '../../components/Dropzone/index';

import './styles.css';

interface Friend{
  id: number;
  species: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string
}

interface IBGECitiesResponse {
  nome: string
}

const CreatePoint = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    whatsapp: ''
  })

  const [textArea, setTextArea] = useState('');

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const [selectedUf, setSelectefUf] = useState('0');
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [selectedCity, setSelectefCity] = useState('0');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api.get('friends').then(response => {
      setFriends(response.data);
    })
  }, []);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      ufInitials.sort();
      setUfs(ufInitials);
    })
  }, []);

  useEffect(() => {
    if(selectedUf === '0') {
      return;
    }

    axios.get<IBGECitiesResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response => {
      const citiesNames = response.data.map(city => city.nome);
      setCities(citiesNames);
    })
  }, [selectedUf])

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectefUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectefCity(city);
  }

  function handleMapClick(event :LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    setTextArea(value);
    console.log(value);
  }

  function handleSelectFriend(id: number) {
    const alreadySelected = selectedFriends.findIndex(item => item == id); 

    if(alreadySelected >= 0) {
      const filteredFriends = selectedFriends.filter(item => item != id);
      setSelectedFriends(filteredFriends);
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, age, email, whatsapp } = formData;
    const description = textArea;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const friends = selectedFriends;

    const data = new FormData();
    
    data.append('name', name);
    data.append('age', age);
    data.append('description', description);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('friends', friends.join(','));

    if(selectedFile) {
      data.append('image', selectedFile);
    }

    console.log(data);

    await api.post('points', data);

    history.push('/submit-done');
  }
  
  return (
    <div id="page-create-point">
      <header>
        {/* <img src={logo} alt="Logo Ecoleta"/> */}
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
        
        <h1 className="logo">RescueA<strong>Friend</strong></h1>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do(s) <br />novo(s) amiguinho(s)</h1>

        <Dropzone onFileUpload={setSelectedFile}/>

        <fieldset>
          <legend>
            <h2>Dados pessoais</h2>
          </legend>

          <div className="field-group">
            <div className="field">
              <label htmlFor="name">Nome do(s) amiguinho(s)</label>
              <input 
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="age">Idade</label>
              <input type="text"
                name="age"
                id="age"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="description">Descrição sobre seu(s) amiguinho(s)</label>
            <textarea
              name="description"
              id="description" 
              value={textArea}
              onChange={handleTextAreaChange} 
              />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail para contato</label>
              <input 
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp para contato</label>
              <input 
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Qual a espécie do(s) seu(s) bichinho(s)?</h2>
            <span>
              Selecione um ou mais ítens abaixo
            </span>
          </legend>

          <ul className="items-grid">
            {friends.map(friend => (
              <li className={selectedFriends.includes(friend.id) ? 'selected' : ''} key={friend.id} onClick={() => handleSelectFriend(friend.id)}>
                <img src={friend.image_url} alt={friend.species}/>
                <span>{friend.species}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>
              Selecione o endereço no mapa
            </span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer 
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition}/>
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select 
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectUf}>

                <option value="0">Selecione uma UF</option>

                {ufs.map(uf => {
                  return <option key={uf} value={uf}>{uf}</option>
                })}

              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select 
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}>

                <option value="0">Selecione uma Cidade</option>

                {cities.map(city => {
                  return <option key={city} value={city}>{city}</option>
                })}

              </select>
            </div>
          </div>
        </fieldset>

        <button type="submit">
          Cadastrar amiguinho
        </button>
      </form>
    </div>
  )
}

export default CreatePoint;