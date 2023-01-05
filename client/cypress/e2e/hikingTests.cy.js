import dayjs from "dayjs"
describe('Tests about hiking [REQUIRES DEFAULT DATABASE POPULATION]',() => {
    
    const now = dayjs()
     
    it('T1: Successfull starting', () => {
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("h@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click()
        cy.url().should('include','/hiker')
        cy.get("#start-SentieroperilROCCIAMELONE").click()
        cy.get("#confirmStart").click()
        cy.url().should('include','/hiker/ongoinghike')
    })
    it('T2: Failure on starting an hike while exists an ongoiong one', () => {
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("h@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click()
        cy.url().should('include','/hiker')
        cy.get("#start-PiccianoTappa77").click()
        cy.get("#confirmStart").click()
        cy.get("#error")
    })

    it('T3: Failure on updating position back in time', () => {
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("h@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click().wait(1000)
        
        cy.visit("http://localhost:3000/hiker/ongoinghike")
        cy.get("#referencePoints").select(1)
        cy.get("#updatePosition").click()
        cy.get("#datetimePicker input").first().clear().type(now.add(-0.5,'h').format("DD/MM/YYYY HH:mm"))
        cy.get("#confirmUpdate").click()
        cy.get("#error")

    })

    it('T4: Successfull reference point reached', () => {
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("h@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click().wait(1000)
        
        cy.visit("http://localhost:3000/hiker/ongoinghike")
        cy.get("#referencePoints").select(1)
        cy.get("#updatePosition").click()
        cy.get("#datetimePicker input").first().clear().type(now.add(0.5,'h').format("DD/MM/YYYY HH:mm"))
        cy.get("#confirmUpdate").click()
        cy.get("#success")

    })

    it('T5: Failure on ending back in time', () => {
    
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("h@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click().wait(1000)
        
        cy.visit("http://localhost:3000/hiker/ongoinghike")
        cy.get("#endHike").click()
        cy.get("#datetimePicker input").first().clear().type(now.add(-1,'h').format("DD/MM/YYYY HH:mm"))
        cy.get("#confirmEnd").click()

    })

    it('T6: Successfull ending', () => {
        
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("h@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click().wait(1000)
        
        cy.visit("http://localhost:3000/hiker/ongoinghike")
        cy.get("#endHike").click()
        cy.get("#datetimePicker input").first().clear().type(now.add(1,'h').format("DD/MM/YYYY HH:mm"))
        cy.get("#confirmEnd").click()
        cy.url().should('include','/records')

    })

    it('T7: Completed hikes', () => {
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("h@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click().wait(1000)
        cy.visit("http://localhost:3000/hiker/records").wait(1000)
        cy.contains("Sentiero per il ROCCIAMELONE")
        cy.contains(dayjs().format("DD/MM/YYYY"))
    })


    it('T8: Visit statistics', () => {
        cy.visit("http://localhost:3000/")
        cy.get("#login").click()
        cy.get("#username").clear().type("h@mail.com")
        cy.get("#password").clear().type("1234")
        cy.get("#loginSubmit").click().wait(1000)
        cy.visit("http://localhost:3000/hiker/performancestats").wait(1000)
        cy.contains("Total nr of hikes finished")
        cy.contains("Total nr of kms walked")
        cy.contains("Fastest paced hike (min/km)")
        cy.contains("Average pace (min/km)")
        cy.contains("Average vertical ascent speed (m/hour)")
        cy.contains("Longest (hours) hike completed")
        cy.contains("Shortest (hours) hike completed")
        cy.contains("Longest (km) hike completed")
        cy.contains("Shortest (km) hike completed")
        cy.contains("Highest altitude reached")

    })

   

    
})