import React, {FC, useState, useMemo, useCallback, useEffect} from 'react'
import {connect, ConnectedProps} from 'react-redux'

import {EmptyState, ComponentSize} from '@influxdata/clockface'
// import {FLUX_FUNCTIONS} from 'src/shared/constants/fluxFunctions'
// import {FluxToolbarFunction} from 'src/types/shared'
import Fn from 'src/flows/pipes/RawFluxEditor/DynamicFunctions/FluxInjectionOption'
import SearchWidget from 'src/shared/components/search_widget/SearchWidget'
import FunctionTooltipContent from 'src/flows/pipes/RawFluxEditor/DynamicFunctions/FunctionToolTipContent'

import {Fluxdocs} from 'src/client/fluxdocsdRoutes'
import {getFluxPackages} from 'src/timeMachine/actions/scriptEditorThunks'

// Types
import {RemoteDataState} from 'src/types'
import {AppState} from 'src/types'

interface OwnProps {
  onSelect: (fn) => void
}

// interface FilteredFn {
//   [key: string]: FluxToolbarFunction[]
// }

interface DispatchProps {
  getFluxPackages: () => void
}

type ReduxProps = ConnectedProps<typeof connector>
type Props = ReduxProps & OwnProps & DispatchProps

const FunctionsList: FC<Props> = (props: Props) => {
  const [search, setSearch] = useState('')
  const updateSearch = useCallback(
    text => {
      setSearch(text)
    },
    [search, setSearch]
  )
  const [fluxServiceError, setFluxServiceError] = useState<RemoteDataState>(
    RemoteDataState.NotStarted
  )

  useEffect(() => {
    const getFluxFuncs = async () => {
      try {
        setFluxServiceError(RemoteDataState.Loading)

        if (props.fluxFunctions.length === 0) {
          await props.getFluxPackages()
          setFluxServiceError(RemoteDataState.Done)
        }
        setFluxServiceError(RemoteDataState.Done)
      } catch (err) {
        console.error(err)
        setFluxServiceError(RemoteDataState.Error)
      }
    }
    getFluxFuncs()
  }, [])

  const sortedFunctions = props.fluxFunctions.sort((a, b) => {
    if (a.package.toLowerCase() === b.package.toLowerCase()) {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    } else {
      return a.package.toLowerCase() < b.package.toLowerCase() ? -1 : 1
    }
  })

  const filteredFunctions = useMemo(
    () =>
    sortedFunctions.filter(fn => {
        return (
          !search.length || fn.name.toLowerCase().includes(search.toLowerCase()) || fn.package.toLowerCase().includes(search.toLowerCase())
        )
      }),
    [search, sortedFunctions]
  )

  return useMemo(() => {
    let fnComponent

    if (filteredFunctions.length === 0) {
      fnComponent = (
        <EmptyState size={ComponentSize.ExtraSmall}>
          <EmptyState.Text>No functions match your search</EmptyState.Text>
        </EmptyState>
      )
    } else {
      fnComponent = filteredFunctions.map((fn, index) => (
          
            <Fn
              onClick={onselect}
              extractor={fn => `${fn.package}.${fn.name}`}
              key={index}
              option={fn}
              testID={fn.name}
              ToolTipContent={FunctionTooltipContent}
            />
          
      ))
    }

    return (
      <div className="flux-toolbar">
        <div className="flux-toolbar--search">
          <SearchWidget
            placeholderText="Filter Functions..."
            onSearch={updateSearch}
            searchTerm={search}
            testID="flux-toolbar-search--input"
          />
        </div>
        <div className="flux-toolbar--list" data-testid="flux-toolbar--list">
          {fnComponent}
        </div>
      </div>
    )
  }, [search, onselect, filteredFunctions, updateSearch])
}

const mstp = (state: AppState) => {
  const fluxFunctions = state.fluxDocs.fluxDocs
  return {fluxFunctions}
}

const mdtp = {
  getFluxPackages,
}
const connector = connect(mstp, mdtp)

export default connector(FunctionsList)
