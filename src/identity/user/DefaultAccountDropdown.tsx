import React, {FC} from 'react'
import {
  AlignItems,
  ComponentSize,
  FlexBox,
  FlexDirection,
  FontWeight,
  Heading,
  HeadingElement,
  TypeAheadDropDown,
} from '@influxdata/clockface'
import {UserAccount} from 'src/client/unityRoutes'

// declare const TypeAheadDropDown: FC<OwnProps>;
// interface CreatableTypeAheadDropdownProps extends StandardFunctionProps {
//     /** Text to render in input field as currently selected or typed option */
//     selectedOption: string;
//     /** List of options to render in dropdown menu */
//     options: string[];
//     onSelect: (option: string) => void;
//     placeholder?: string;
//     inputStatus?: ComponentStatus;
//     inputSize?: ComponentSize;
//     /** Optional icon to be displayed to the left of text in input  */
//     inputIcon?: IconFont;
//     /** Optional color preview to be displayed to the left of text.
//      * The color is determined by the selected or typed option in #000000 format.
//      * If both icon and this props are set, icon will take priority */
//     inputColorPreviewOn?: boolean;
//     menuTheme?: DropdownMenuTheme;
//     menuMaxHeight?: number;
//     /** Customize the layout of dropdown items */
//     customizedDropdownItem?: (displayText: string) => JSX.Element;
// }

interface Props {
  label: string
  defaultAccount
  accountList
  updateDefaultAccount
}

/* Same issue with typeahead dropdown - it's expecting a number */

export const DefaultAccountDropDown: FC<Props> = ({
  label,
  defaultAccount,
  accountList,
  updateDefaultAccount,
}) => {
  return (
    <FlexBox
      direction={FlexDirection.Column}
      margin={ComponentSize.Large}
      alignItems={AlignItems.FlexStart}
      style={{
        marginLeft: '8px',
        marginRight: '8px',
      }}
    >
      <Heading
        className="org-profile-tab--heading"
        element={HeadingElement.H4}
        weight={FontWeight.Medium}
      >
        {label}
      </Heading>
      <TypeAheadDropDown
        selectedOption={defaultAccount}
        items={accountList}
        onSelect={updateDefaultAccount}
        placeholderText="Select an Account"
        style={{width: '250px'}}
      />
    </FlexBox>
  )
}
