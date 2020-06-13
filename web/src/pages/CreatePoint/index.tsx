import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'

import Dropzone from '../../components/Dropzone'

import api from '../../services/api'
import ibge from '../../services/ibge'

import './styles.css'

import logo from '../../assets/logo.svg'

interface Item {
  id: number,
  title: string,
  image_url: string
}

interface UF {
  nome: string,
  sigla: string
}

interface City {
  id: number,
  nome: string
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<UF[]>([])
  const [cities, setCities] = useState<City[]>([])

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

  const [inputData, setInputData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  const [selectedUf, setSelectedUf] = useState<string>('0')
  const [selectedCity, setSelectedCity] = useState<string>('0')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
  const [selectedFile, setSelectedFile] = useState<File>()

  const history = useHistory()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      
      setInitialPosition([latitude, longitude])
    })
  }, [])

  useEffect(() => {
    api.get('/items').then(response => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    ibge.get('/').then(response => {
      setUfs(response.data)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      return
    }

    ibge.get(`/${selectedUf}/distritos?orderBy=nome`).then(response => {
      setCities(response.data)
    })
  }, [selectedUf])

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value

    if (uf !== '0') {
      setSelectedUf(uf)
    }
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value

    if (city !== '0') {
      setSelectedCity(city)
    }
  }

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng

    setSelectedPosition([lat, lng])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setInputData({ ...inputData, [name]: value })
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if (alreadySelected < 0) {
      setSelectedItems([ ...selectedItems, id ])
      return
    }

    const filteredItems = selectedItems.filter(item => item !== id)
    setSelectedItems(filteredItems)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const { name, email, whatsapp } = inputData
    const uf = selectedUf
    const city = selectedCity
    const [latitude, longitude] = selectedPosition
    const items = selectedItems

    const data = new FormData()

   
    data.append('name', name)
    data.append('email', email)
    data.append('whatsapp', whatsapp)
    data.append('uf', uf)
    data.append('city', city)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('items', items.join(','))

    selectedFile && data.append('image', selectedFile)

    await api.post('/points', data)

    alert('Ponto de coleta criado com successo!')

    history.push('/')
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do<br/>ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend><h2>Dados</h2></legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input 
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input 
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
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
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map 
            center={initialPosition} 
            zoom={16} 
            onClick={handleMapClick} 
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition}>
              <Popup>
                About point information
              </Popup>
            </Marker>
          </Map>

          <div className="field-group">

            <div className="field">
              <label htmlFor="uf">Estado</label>
              <select 
                name="uf" 
                id="uf"
                value={selectedUf} 
                onChange={handleSelectUf}
              >
                <option value="0">Selecione um estado</option>
                {ufs.map(uf => (
                  <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Selecione uma cidade</label>
              <select 
                name="city" 
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city.id} value={city.nome}>{city.nome}</option>
                ))}
              </select>
            </div>

          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de Coletas</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li 
                key={item.id} 
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto</button>
      </form>
    </div>
  )
}

export default CreatePoint
