import React, {PureComponent} from 'react'
import _ from 'lodash'

import Container from 'src/shared/components/overlay/OverlayContainer'
import Heading from 'src/shared/components/overlay/OverlayHeading'
import Body from 'src/shared/components/overlay/OverlayBody'
import DragAndDrop from 'src/shared/components/DragAndDrop'
import {notifyDashboardImportFailed} from 'src/shared/copy/notifications'

import {Dashboard} from 'src/types'
import {Notification} from 'src/types/notifications'

interface Props {
  onDismissOverlay: () => void
  onImportDashboard: (dashboard: Dashboard) => void
  notify: (message: Notification) => void
}

interface State {
  isImportable: boolean
}

class ImportDashboardOverlay extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isImportable: false,
    }
  }

  public render() {
    const {onDismissOverlay} = this.props

    return (
      <Container maxWidth={800}>
        <Heading title="Import Dashboard" onDismiss={onDismissOverlay} />
        <Body>
          <DragAndDrop
            submitText="Upload Dashboard"
            fileTypesToAccept={this.validFileExtension}
            handleSubmit={this.handleUploadDashboard}
          />
        </Body>
      </Container>
    )
  }

  private get validFileExtension(): string {
    return '.json'
  }

  private handleUploadDashboard = (
    uploadContent: string,
    fileName: string
  ): void => {
    const {onImportDashboard, onDismissOverlay} = this.props
    const fileExtensionRegex = new RegExp(`${this.validFileExtension}$`)
    if (!fileName.match(fileExtensionRegex)) {
      this.props.notify(
        notifyDashboardImportFailed(fileName, 'Please import a JSON file')
      )
      return
    }

    try {
      const {dashboard} = JSON.parse(uploadContent)

      if (!_.isEmpty(dashboard)) {
        onImportDashboard(dashboard)
      } else {
        this.props.notify(
          notifyDashboardImportFailed(fileName, 'No dashboard found in file')
        )
      }
    } catch (error) {
      this.props.notify(notifyDashboardImportFailed(fileName, error))
    }

    onDismissOverlay()
  }
}

export default ImportDashboardOverlay
