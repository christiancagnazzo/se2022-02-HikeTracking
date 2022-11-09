import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import { Icon } from 'leaflet'

var myIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function Map(props){
    
    return (
        <MapContainer center={[40.94164220957352, 14.873917701550964]} zoom={13} scrollWheelZoom={false} style={{height: '400px'}} onClick={(e) => console.log(e) }>
            <Click></Click>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={props.sp} icon={myIcon} >
      <Popup>
          Start point
      </Popup>
      </Marker>
      <Marker position={props.ep} icon={myIcon} >
      <Popup>
          End point
      </Popup>
      </Marker>
        </MapContainer>
    )
}

function Click(props){
    const [position, setPosition] = useState([0,0])
   

    const map = useMapEvents({
        click: (e) => {
            
          //setPosition(e.latlng['lat'], e.latlng['lng'])
        },
        
      })
      return <Marker position={position} icon={myIcon} >
      <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
      </Marker>
}
export default Map