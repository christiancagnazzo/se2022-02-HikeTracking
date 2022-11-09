import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import { Icon } from 'leaflet'

const myIconSp = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


const myIconEp = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const myIconRp = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [20, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function Map(props){
    const rpList = props.rpList.map((pos) => {
        
        return <Marker position={[pos['lat'],pos['lng']]} icon={myIconRp}>
            <Popup>
                Reference Point: {pos['address']}
            </Popup>
        </Marker>
    })

    let spMarker = null
    if(props.sp[0]!=='' && props.sp[1]!=='')
        spMarker =(<Marker position={props.sp} icon={myIconSp} >
        <Popup>
            Start point: {props.spAddress}
        </Popup>
        </Marker>)
    let epMarker = null
    if(props.ep[0]!=='' && props.ep[1]!=='')
        epMarker =(<Marker position={props.ep} icon={myIconEp} >
        <Popup>
            Start point: {props.epAddress}
        </Popup>
        </Marker>)
    return (
        <MapContainer center={props.sp} zoom={5} scrollWheelZoom={false} style={{height: '400px'}} onClick={(e) => console.log(e) }>
            <Click sp={props.sp}></Click>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {spMarker}
            {epMarker}
            {rpList}
        </MapContainer>
    )
}

function Click(props){
    const [position, setPosition] = useState([0,0])
   
    const map = useMapEvents({
        click: (e) => {
            map.flyTo(props.sp)
        },
        
      })
      return null
}
export default Map