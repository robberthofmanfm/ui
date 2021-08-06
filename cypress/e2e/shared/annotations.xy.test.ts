import {clearLocalStorage, setupData} from '../util/annotationsSetup'

describe('The Annotations UI functionality, on a graph (xy line) graph type', () => {
  beforeEach(() => setupData(cy))
  afterEach(clearLocalStorage)

  it('can create an annotation on the xy line graph', () => {
    cy.getByTestID('cell blah').within(() => {
      cy.getByTestID('giraffe-inner-plot').click({shiftKey: true})
    })

    cy.getByTestID('overlay--container').within(() => {
      cy.getByTestID('edit-annotation-message').should('be.visible')

      cy.getByTestID('edit-annotation-message')
        .click()
        .focused()
        .type('im a hippopotamus')
      cy.getByTestID('annotation-submit-button').click()
    })

    // reload to make sure the annotation was added in the backend as well.
    cy.reload()
    cy.getByTestID('toggle-annotations-controls').click()

    // we need to see if the annotations got created and that the tooltip says "I'm a hippopotamus"
    cy.getByTestID('cell blah').within(() => {
      cy.getByTestID('giraffe-inner-plot').trigger('mouseover')
    })
    cy.getByTestID('giraffe-annotation-tooltip').contains('im a hippopotamus')
  })

  it('can edit an annotation  for the xy line graph', () => {
    cy.getByTestID('cell blah').within(() => {
      cy.getByTestID('giraffe-inner-plot').click({shiftKey: true})
    })

    cy.getByTestID('overlay--container').within(() => {
      cy.getByTestID('edit-annotation-message').should('be.visible')

      cy.getByTestID('edit-annotation-message')
        .click()
        .focused()
        .type('im a hippopotamus')
      cy.getByTestID('annotation-submit-button').click()
    })

    // should have the annotation created , lets click it to show the modal.
    cy.getByTestID('cell blah').within(() => {
      // we have 2 line layers by the same id, we only want to click on the first
      cy.get('line')
        .first()
        .click({force: true})
    })

    cy.getByTestID('edit-annotation-message').should(
      'have.length.of.at.least',
      1
    )
    cy.getByTestID('edit-annotation-message').clear()
    cy.getByTestID('edit-annotation-message').type(
      'lets edit this annotation...'
    )

    cy.getByTestID('annotation-submit-button').click()

    // reload to make sure the annotation was edited in the backend as well.
    cy.reload()
    cy.getByTestID('toggle-annotations-controls').click()

    // annotation tooltip should say the new name
    cy.getByTestID('cell blah').within(() => {
      cy.getByTestID('giraffe-inner-plot').trigger('mouseover')
    })
    cy.getByTestID('giraffe-annotation-tooltip').contains(
      'lets edit this annotation...'
    )
  })

  it('can delete an annotation  for the xy line graph', () => {
    cy.getByTestID('cell blah').within(() => {
      cy.getByTestID('giraffe-inner-plot').click({shiftKey: true})
    })

    cy.getByTestID('overlay--container').within(() => {
      cy.getByTestID('edit-annotation-message')
        .should('be.visible')
        .click()
        .focused()
        .type('im a hippopotamus')
      cy.getByTestID('annotation-submit-button').click()
    })
    // should have the annotation created , lets click it to show the modal.
    cy.getByTestID('cell blah').within(() => {
      // we have 2 line layers by the same id, we only want to click on the first
      cy.get('line')
        .first()
        .click({force: true})
    })

    cy.getByTestID('delete-annotation-button').should('be.visible')
    cy.getByTestID('delete-annotation-button')
      .children()
      .debug()
    cy.getByTestID('delete-annotation-button').click()

    // reload to make sure the annotation was deleted from the backend as well.
    cy.reload()
    cy.getByTestID('toggle-annotations-controls').click()

    // annotation line should not exist in the dashboard cell
    cy.getByTestID('cell blah').within(() => {
      cy.get('line').should('not.exist')
    })
  })

  it('can add a range annotation for the xy line graph', () => {
    cy.getByTestID('cell blah').within(() => {
      cy.getByTestID(`giraffe-layer-line`).then(([canvas]) => {
        const {width, height} = canvas

        cy.wrap(canvas).trigger('mousedown', {
          x: width / 3,
          y: height / 2,
          force: true,
          shiftKey: true,
        })
        cy.wrap(canvas).trigger('mousemove', {
          x: (width * 2) / 3,
          y: height / 2,
          force: true,
          shiftKey: true,
        })
        cy.wrap(canvas).trigger('mouseup', {force: true, shiftKey: true})
      })
    })

    cy.getByTestID('overlay--container').within(() => {
      cy.getByTestID('edit-annotation-message')
        .should('be.visible')
        .click()
        .focused()
        .type('range annotation here!')

      // make sure the two times (start and end) are not equal:
      cy.getByTestID('endTime-testID')
        .invoke('val')
        .then(endTimeValue => {
          cy.getByTestID('startTime-testID')
            .invoke('val')
            .then(startTimeValue => {
              expect(endTimeValue).to.not.equal(startTimeValue)
            })
        })

      cy.getByTestID('annotation-submit-button').click()
    })

    cy.getByTestID('cell blah').within(() => {
      cy.getByTestID('giraffe-inner-plot').trigger('mouseover')
    })
    cy.getByTestID('giraffe-annotation-tooltip').contains(
      'range annotation here!'
    )
  })

  it('can add and edit a range annotation for the xy line graph', () => {
    cy.getByTestID('cell blah').within(() => {
      cy.getByTestID(`giraffe-layer-line`).then(([canvas]) => {
        const {width, height} = canvas

        cy.wrap(canvas).trigger('mousedown', {
          x: width / 3,
          y: height / 2,
          force: true,
          shiftKey: true,
        })
        cy.wrap(canvas).trigger('mousemove', {
          x: (width * 2) / 3,
          y: height / 2,
          force: true,
          shiftKey: true,
        })
        cy.wrap(canvas).trigger('mouseup', {force: true, shiftKey: true})
      })
    })

    cy.getByTestID('overlay--container').within(() => {
      cy.getByTestID('edit-annotation-message')
        .should('be.visible')
        .click()
        .focused()
        .type('range annotation here!')

      // make sure the two times (start and end) are not equal:
      cy.getByTestID('endTime-testID')
        .invoke('val')
        .then(endTimeValue => {
          cy.getByTestID('startTime-testID')
            .invoke('val')
            .then(startTimeValue => {
              expect(endTimeValue).to.not.equal(startTimeValue)
            })
        })

      cy.getByTestID('annotation-submit-button').click()
    })

    cy.getByTestID('cell blah').within(() => {
      // we have 2 line layers by the same id, we only want to click on the first
      cy.get('line')
        .first()
        .click({force: true})
    })

    cy.getByTestID('edit-annotation-message')
      .clear()
      .type('editing the text here for the range annotation')

    cy.getByTestID('endTime-testID')
      .invoke('val')
      .then(endTimeValue => {
        cy.getByTestID('startTime-testID')
          .invoke('val')
          .then(startTimeValue => {
            expect(endTimeValue).to.not.equal(startTimeValue)
          })
      })

    cy.getByTestID('annotation-submit-button').click()

    // reload to make sure the annotation was edited in the backend as well.
    cy.reload()
    cy.getByTestID('toggle-annotations-controls').click()

    cy.getByTestID('cell blah').within(() => {
      cy.getByTestID('giraffe-inner-plot').trigger('mouseover')
    })
    cy.getByTestID('giraffe-annotation-tooltip').contains(
      'editing the text here for the range annotation'
    )
  })

  it('can add and then delete a range annotation for the xy line graph', () => {
    cy.getByTestID('cell blah').within(() => {
      cy.getByTestID(`giraffe-layer-line`).then(([canvas]) => {
        const {width, height} = canvas

        cy.wrap(canvas).trigger('mousedown', {
          x: width / 3,
          y: height / 2,
          force: true,
          shiftKey: true,
        })
        cy.wrap(canvas).trigger('mousemove', {
          x: (width * 2) / 3,
          y: height / 2,
          force: true,
          shiftKey: true,
        })
        cy.wrap(canvas).trigger('mouseup', {force: true, shiftKey: true})
      })
    })

    cy.getByTestID('overlay--container').within(() => {
      cy.getByTestID('edit-annotation-message')
        .should('be.visible')
        .click()
        .focused()
        .type('range annotation here!')

      // make sure the two times (start and end) are not equal:
      cy.getByTestID('endTime-testID')
        .invoke('val')
        .then(endTimeValue => {
          cy.getByTestID('startTime-testID')
            .invoke('val')
            .then(startTimeValue => {
              expect(endTimeValue).to.not.equal(startTimeValue)
            })
        })
      cy.getByTestID('annotation-submit-button').click()
    })
    // should have the annotation created , lets click it to show the modal.
    cy.getByTestID('cell blah').within(() => {
      // we have 2 line layers by the same id, we only want to click on the first
      cy.get('line')
        .first()
        .click({force: true})
    })

    cy.getByTestID('delete-annotation-button').click()

    // reload to make sure the annotation was deleted from the backend as well.
    cy.reload()
    cy.getByTestID('toggle-annotations-controls').click()

    // annotation line should not exist in the dashboard cell
    cy.getByTestID('cell blah').within(() => {
      cy.get('line').should('not.exist')
    })
  })
})
