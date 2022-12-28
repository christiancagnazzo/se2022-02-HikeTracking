import { Col, Row } from "react-bootstrap"
import dayjs from "dayjs"
function createRows(objects, cards){
    let rows = []
  for (let i = 0; i < Math.ceil(objects.length / 3); i++) {
    let cols = []
    let j
    for (j = 0; j < 3 && cards.length; j++) {
      cols.push(cards.pop())
    }
    for (; j < 3; j++) {
      cols.push(<Col className="pb-4 px-0" key={j}></Col>)
    }
    rows.push(<Row className='px-0' key={i}>{cols}</Row>)
  }
  return rows
}

function updateActive(idx, relocation, lengthOption, setActive, navigate) {
    let active = []
    for(let i = 0; i < lengthOption; i++){
      if(i === idx){
        active.push(true)
      }
      else {
        active.push(false)
      }
    }
    setActive(active)
    navigate(relocation)
}



const UTILS = {createRows, updateActive}
export default UTILS