import dayjs from "dayjs"

describe('TESTS ABOUT WEATHER ALERTS', () => {
    it('T1: No Alerts',() => {
        
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("h@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click()
        cy.url().should('include','/hiker')
        cy.get("#start-SentieroperilROCCIAMELONE").click()
        cy.get("#confirmStart").click()
        cy.visit("http://localhost:3000/hiker/").reload()
        cy.get("#modalAlerts").should("not.exist")
    })

    it("T2: Failure on alert without position", () => {
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("pm@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click()
        cy.url().should('include','/platformmanager')
        cy.visit("http://localhost:3000/platformmanager/weatheralert")
        cy.get("#latitudeInput").clear({force: true})
        cy.get("#longitudeInput").clear({force: true})
        cy.get('#conditionInput').select(1)
        cy.get("#updateAlerts").click()
        cy.get("#error") 
    })

    it("T3: Failure on alert without radius", () => {
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("pm@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click()
        cy.url().should('include','/platformmanager')
        cy.visit("http://localhost:3000/platformmanager/weatheralert")
        cy.get("#latitudeInput").clear({force: true}).type('46.88604',{force: true})
        cy.get("#longitudeInput").clear({force: true}).type('8.847677',{force: true})
        cy.get('#conditionInput').select(1)
        cy.get("#updateAlerts").click()
        cy.get("#error") 
    })

    it("T4: Create alert", () => {
        
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("pm@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click()
        cy.url().should('include','/platformmanager')
        cy.visit("http://localhost:3000/platformmanager/weatheralert")
        cy.get("#latitudeInput").clear({force: true}).type('46.88604',{force: true})
        cy.get("#longitudeInput").clear({force: true}).type('8.847677',{force: true})
        cy.get("#radiusInput").clear({force: true}).type(500,{force: true})
        cy.get('#conditionInput').select(1)
        cy.get("#updateAlerts").click()
        cy.get("#success") 
    },
    )
    it("T5: Create alert", () => {
        
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("pm@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click()
        cy.url().should('include','/platformmanager')
        cy.visit("http://localhost:3000/platformmanager/weatheralert")
        cy.get("#latitudeInput").clear({force: true}).type('46.88604',{force: true})
        cy.get("#longitudeInput").clear({force: true}).type('8.847677',{force: true})
        cy.get("#radiusInput").clear({force: true}).type(500,{force: true})
        cy.get('#conditionInput').select(1)
        cy.get("#updateAlerts").click()
        cy.get("#success") 
    },
    )

    it("T6: An Alerts", () => {
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("h@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click()
        cy.url().should('include','/hiker')
        cy.get("#modalAlerts").should("exist")
    })

    it('[NOT A TEST] End hike', () => {

        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("h@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click().wait(1000)
        cy.visit("http://localhost:3000/hiker/ongoinghike")
        cy.get("#closeAlerts").click()
        cy.get("#endHike").click()
        cy.get("#datetimePicker input").first().clear().type(dayjs().add(1,'h').format("MM/DD/YYYY hh:mm A"))
        cy.get("#confirmEnd").click()

    })

})