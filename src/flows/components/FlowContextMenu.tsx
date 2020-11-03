// Libraries
import React, {FC, useContext} from 'react'

// Components
import {
  ButtonShape,
  ComponentColor,
  IconFont,
  ConfirmationButton,
  ComponentSize,
} from '@influxdata/clockface'
import {FlowListContext} from 'src/flows/context/flow.list'

interface Props {
  id: string
  name: string
}

const FlowContextMenu: FC<Props> = ({id, name}) => {
  const {remove} = useContext(FlowListContext)

  const handleDelete = () => {
    remove(id)
  }

  return (
    <ConfirmationButton
      icon={IconFont.Trash}
      onConfirm={handleDelete}
      shape={ButtonShape.Square}
      size={ComponentSize.ExtraSmall}
      color={ComponentColor.Danger}
      confirmationButtonText="Confirm"
      confirmationLabel="Really delete Flow?"
      testID={`${name} delete-flow`}
    />
  )
}

export default FlowContextMenu
