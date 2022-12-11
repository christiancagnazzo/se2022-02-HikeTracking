import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { Icon } from 'leaflet'
import GpxParser from 'gpxparser';

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

const myIconTp = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [20, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function Map(props){
    const [positions, setPositions] = useState([])
    
    const rpList = props.rpList.map((pos,idx) => {
        return <Marker position={[pos['reference_point_lat'],pos['reference_point_lng']]} icon={myIconRp} key={idx}>
            <Popup>
                Reference Point: {pos['reference_point_address']}
            </Popup>
        </Marker>
    })
    const trackPoints = props.trackPoints? props.trackPoints.map((pos,idx) => {
        return <Marker position={[pos['lat'],pos['lon']]} icon={myIconTp} key={idx}  eventHandlers={{
            click: (e) => {
              props.updateTrackPoints(idx)
            },
          }}>
        </Marker>
    }) : ''
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
            End point: {props.epAddress}
        </Popup>
        </Marker>)
    useEffect(() => {
        if (props.gpxFile !== ''){ 
            const gpx = new GpxParser()
            gpx.parse(props.gpxFile)
            const pos = gpx.tracks[0].points.map(p => [p.lat, p.lon])
            setPositions(pos)
            if(props.setLength){
                const elevation = gpx.tracks[0].elevation.max
                const distance = gpx.tracks[0].distance.total
                props.setSp(pos[0])
                props.setEp(pos[pos.length-1])
                props.setLength(parseInt(distance))
                props.setAscent(parseInt(elevation))
                let rp = [];
                for (var i = 1; i < gpx.tracks[0].points.length - 1; i+=2) {
                    rp[i - 1] = gpx.tracks[0].points[i];
                }
                props.setTrackPoints(rp)

            }
        }
    },[props.gpxFile])
    
    const center = props.sp !== ["",""] ? props.sp : [45.07104275068942, 7.677664908245942]
    return (
        <MapContainer center={[45.07104275068942, 7.677664908245942]} zoom={13} scrollWheelZoom={false} style={{height: '400px'}} >
            <Click sp={props.sp}></Click>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {spMarker}
            {epMarker}
            {rpList}
            {trackPoints}
            <Polyline
                pathOptions={{ fillColor: 'red', color: 'blue' }}
                positions={
                positions
            }
            />
        </MapContainer>
    )
}

function Click(props){
    const map = useMapEvents({
        
        
      })
      return null
}
export default Map