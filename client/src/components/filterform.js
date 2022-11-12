import { Container, Form, Row, Button, Card, InputGroup, Col, Alert } from "react-bootstrap"
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import API from '../API';
import Map from './map'

const  province_dic = {     
    'AG' : 'Agrigento',
    'AL' : 'Alessandria',
    'AN' : 'Ancona',
    'AO' : 'Aosta',
    'AR' : 'Arezzo',
    'AP' : 'Ascoli Piceno',
    'AT' : 'Asti',
    'AV' : 'Avellino',
    'BA' : 'Bari',
    'BT' : 'Barletta-Andria-Trani',
    'BL' : 'Belluno',
    'BN' : 'Benevento',
    'BG' : 'Bergamo',
    'BI' : 'Biella',
    'BO' : 'Bologna',
    'BZ' : 'Bolzano',
    'BS' : 'Brescia',
    'BR' : 'Brindisi',
    'CA' : 'Cagliari',
    'CL' : 'Caltanissetta',
    'CB' : 'Campobasso',
    'CI' : 'Carbonia-Iglesias',
    'CE' : 'Caserta',
    'CT' : 'Catania',
    'CZ' : 'Catanzaro',
    'CH' : 'Chieti',
    'CO' : 'Como',
    'CS' : 'Cosenza',
    'CR' : 'Cremona',
    'KR' : 'Crotone',
    'CN' : 'Cuneo',
    'EN' : 'Enna',
    'FM' : 'Fermo',
    'FE' : 'Ferrara',
    'FI' : 'Firenze',
    'FG' : 'Foggia',
    'FC' : 'Forlì-Cesena',
    'FR' : 'Frosinone',
    'GE' : 'Genova',
    'GO' : 'Gorizia',
    'GR' : 'Grosseto',
    'IM' : 'Imperia',
    'IS' : 'Isernia',
    'SP' : 'La Spezia',
    'AQ' : 'L\'Aquila',
    'LT' : 'Latina',
    'LE' : 'Lecce',
    'LC' : 'Lecco',
    'LI' : 'Livorno',
    'LO' : 'Lodi',
    'LU' : 'Lucca',
    'MC' : 'Macerata',
    'MN' : 'Mantova',
    'MS' : 'Massa-Carrara',
    'MT' : 'Matera',
    'ME' : 'Messina',
    'MI' : 'Milano',
    'MO' : 'Modena',
    'MB' : 'Monza e della Brianza',
    'NA' : 'Napoli',
    'NO' : 'Novara',
    'NU' : 'Nuoro',
    'OT' : 'Olbia-Tempio',
    'OR' : 'Oristano',
    'PD' : 'Padova',
    'PA' : 'Palermo',
    'PR' : 'Parma',
    'PV' : 'Pavia',
    'PG' : 'Perugia',
    'PU' : 'Pesaro e Urbino',
    'PE' : 'Pescara',
    'PC' : 'Piacenza',
    'PI' : 'Pisa',
    'PT' : 'Pistoia',
    'PN' : 'Pordenone',
    'PZ' : 'Potenza',
    'PO' : 'Prato',
    'RG' : 'Ragusa',
    'RA' : 'Ravenna',
    'RC' : 'Reggio Calabria',
    'RE' : 'Reggio Emilia',
    'RI' : 'Rieti',
    'RN' : 'Rimini',
    'RM' : 'Roma',
    'RO' : 'Rovigo',
    'SA' : 'Salerno',
    'VS' : 'Medio Campidano',
    'SS' : 'Sassari',
    'SV' : 'Savona',
    'SI' : 'Siena',
    'SR' : 'Siracusa',
    'SO' : 'Sondrio',
    'TA' : 'Taranto',
    'TE' : 'Teramo',
    'TR' : 'Terni',
    'TO' : 'Torino',
    'OG' : 'Ogliastra',
    'TP' : 'Trapani',
    'TN' : 'Trento',
    'TV' : 'Treviso',
    'TS' : 'Trieste',
    'UD' : 'Udine',
    'VA' : 'Varese',
    'VE' : 'Venezia',
    'VB' : 'Verbano-Cusio-Ossola',
    'VC' : 'Vercelli',
    'VR' : 'Verona',
    'VV' : 'Vibo Valentia',
    'VI' : 'Vicenza',
    'VT' : 'Viterbo',
  };
  

function FilterForm(props) {
  const [minLength, setMinLength] = useState('')
  const [maxLength, setMaxLength] = useState('')

  const [minTime, setMinTime] = useState('')
  const [maxTime, setMaxTime] = useState('')

  const [minAscent, setMinAscent] = useState('')
  const [maxAscent, setMaxAscent] = useState('')

  const [difficulty, setDifficulty] = useState(2)

  const[province, setProvince] = useState('')
  const navigate = useNavigate();

  let token = localStorage.getItem("token");
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const filter = {
        minLength: minLength,
        maxLength: maxLength,
        minTime: minTime,
        maxTime: maxTime,
        minAscent: minAscent,
        maxAscent: maxAscent,
        difficulty: difficulty,
        province: province

    }
    props.applyFilter(filter)
    props.changeSel("hikes")
    
  }

  const checkNum = (num, callback) => {
    if (!isNaN(num)) {
      return callback(num);
    }
    return false
  }
  

  

  
  return (<Container className="below-nav">
    {' '}
    <Card body>
      <Form>
      <Row>
      <Form.Label htmlFor="basic-url">Length (in kms)</Form.Label>
      <Col>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default" >
            Min
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={minLength}
            onChange={(e) => checkNum(e.target.value, setMinLength)}
          />
        </InputGroup>
      </Col>
      <Col>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Max
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={maxLength}
            onChange={(e) => checkNum(e.target.value, setMaxLength)}
          />
        </InputGroup>
      </Col>
    </Row>
        
    <Row>
      <Form.Label htmlFor="basic-url">Expected time (in min)</Form.Label>
      <Col>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default" >
            Min
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={minTime}
            onChange={(e) => checkNum(e.target.value, setMinTime)}
            
          />
        </InputGroup>
      </Col>
      <Col>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Max
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={maxTime}
            onChange={(e) => checkNum(e.target.value, setMaxTime)}
          />
        </InputGroup>
      </Col>
    </Row>
    <Row>
      <Form.Label htmlFor="basic-url">Ascent (in meters)</Form.Label>
      <Col>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default" >
            Min
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={minAscent}
            onChange={(e) => checkNum(e.target.value, setMinAscent)}
            
          />
        </InputGroup>
      </Col>
      <Col>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Max
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={maxAscent}
            onChange={(e) => checkNum(e.target.value, setMaxAscent)}
          />
        </InputGroup>
      </Col>
    </Row>
    <Form.Group className="mb-3" controlId="ascent">
        <Form.Label>Difficulty</Form.Label>
        
        <Form.Select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option value="All">All</option>
        <option value="Tourist">Tourist</option>
        <option value="Hiker">Hiker</option>
        <option value="Pro Hiker">Pro Hiker</option>
        </Form.Select>
    </Form.Group>
    <Form.Group className="mb-3" controlId="title">
          <Form.Label>Province</Form.Label>
          <Form.Select value={province} onChange={e => setProvince(e.target.value)}>
          {Object.values(province_dic).sort().map((p) => <option value={p}>{p}</option>)}
          </Form.Select>
          
    </Form.Group>
       

        
        {' '}
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Apply
        </Button>
      </Form>
    </Card>
  </Container>)

}



export default FilterForm