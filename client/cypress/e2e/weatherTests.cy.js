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
        cy.get("#modalAlerts").should("not.exists")
    })

    it("T2: Create alert", () => {
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("pm@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click()
        cy.url().should('include','/platformmanager')
        cy.visit("http://localhost:3000/platformmanager/weatheralert")
        cy.get("#latitudeInput").clear().type(46.88604)
        cy.get("#longituteInput").clear().type(8.847677)
        cy.get("#radiusInput").clear().type(500)
        cy.get('#conditionInput').select(1)
        cy.get("#updateAlerts").click()
        cy.get("success")
    },
    )

    it("T3: An Alerts", () => {
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("h@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click()
        cy.url().should('include','/hiker')
        cy.get("#modalAlerts").should("exist")
    })

})