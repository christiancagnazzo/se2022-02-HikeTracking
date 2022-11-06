import {Navbar, Container, Nav, Button} from 'react-bootstrap';

function MyNavbar2(props){

      return ( props.loggedIn ? <NavLogout logout={props.logout}/> : <NavLogin login={props.login}/>);

  function NavLogin(props){
    return(
    <Navbar fixed="top" bg="dark" variant="dark">
        <Container fluid>
             <Nav>
             <> 
              <Navbar.Brand>Welcome {props.userPower}</Navbar.Brand> 
              <Button onClick={()=> props.login()} as="input" type="button" value="Login" variant='dark' size='sm'/>{' '}   
            </>
            <Button onClick={()=> props.signIn()} as="input" type="button" value="Sign In" variant='dark' size='sm'/>{' '} 
            </Nav>   
        </Container>
      </Navbar>
    )
  }

  function NavLogout(props){
    return(
      <Navbar fixed="top" bg="dark" variant="dark">
          <Container fluid>
               <Nav>
               <> 
                <Navbar.Brand>Welcome {props.userPower}</Navbar.Brand> 
                <Button onClick={()=> props.logout()} as="input" type="button" value="Logout" variant='dark' size='sm'/>{' '}   
              </>
              </Nav>   
          </Container>
        </Navbar>
      )
  }
  
}

export default MyNavbar2;