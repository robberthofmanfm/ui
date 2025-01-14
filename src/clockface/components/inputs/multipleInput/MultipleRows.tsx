// Libraries
import React, {SFC} from 'react'
import {nanoid} from 'nanoid'

// Components
import Row from 'src/clockface/components/inputs/multipleInput/Row'

interface Item {
  text?: string
  name?: string
}

interface RowsProps {
  tags: Item[]
  confirmText?: string
  onDeleteTag?: (item: Item) => void
  onChange?: (index: number, value: string) => void
}

const Rows: SFC<RowsProps> = ({tags, onDeleteTag, onChange}) => {
  return (
    <div className="input-tag-list" data-testid="multiple-rows">
      {tags.map(item => {
        return (
          <Row
            index={tags.indexOf(item)}
            key={nanoid()}
            item={item}
            onDelete={onDeleteTag}
            onChange={onChange}
          />
        )
      })}
    </div>
  )
}

export default Rows
