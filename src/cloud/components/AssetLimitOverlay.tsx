// Libraries
import React, {FC} from 'react'
import {connect} from 'react-redux'
import {get} from 'lodash'
import {
  OverlayContainer,
  Overlay,
  ComponentSize,
  GradientBox,
  Gradients,
  InfluxColors,
} from '@influxdata/clockface'

// Components
import CloudUpgradeButton from 'src/shared/components/CloudUpgradeButton'

// Utils
import {isFlagEnabled} from 'src/shared/utils/featureFlag'
import {
  getDataLayerIdentity,
  getExperimentVariantId,
} from 'src/cloud/utils/experiments'
import {event} from 'src/cloud/utils/reporting'
import {shouldGetCredit250Experience} from 'src/me/selectors'

// Constants
import {CREDIT_250_EXPERIMENT_ID} from 'src/shared/constants'

// Types
import {AppState} from 'src/types'

interface OwnProps {
  onClose: () => void
}

interface StateProps {
  assetName: string
  isCredit250ExperienceActive: boolean
}

const AssetLimitOverlay: FC<OwnProps & StateProps> = ({
  assetName,
  isCredit250ExperienceActive,
  onClose,
}) => {
  return (
    <OverlayContainer
      maxWidth={600}
      testID="asset-limit-overlay"
      className="asset-limit-overlay"
    >
      <GradientBox
        borderGradient={Gradients.MiyazakiSky}
        borderColor={InfluxColors.Grey5}
      >
        <div className="asset-limit-overlay--contents">
          <Overlay.Header
            title={`Need More ${assetName}?`}
            wrapText={true}
            onDismiss={onClose}
          />
          <Overlay.Body>
            <div className="asset-limit-overlay--graphic-container">
              <div className="asset-limit-overlay--graphic">
                <div className="asset-limit-overlay--graphic-element" />
              </div>
            </div>
            <p>
              You’ve reached the maximum allotted {assetName} on your current
              plan. Upgrade to Pay as you go to create more {assetName}.
            </p>
          </Overlay.Body>
          <Overlay.Footer>
            <CloudUpgradeButton
              size={ComponentSize.Large}
              className="upgrade-payg--button__asset-create"
              metric={() => {
                const experimentVariantId = getExperimentVariantId(
                  CREDIT_250_EXPERIMENT_ID
                )
                const identity = getDataLayerIdentity()
                event(
                  isFlagEnabled('credit250Experiment') &&
                    (experimentVariantId === '1' || isCredit250ExperienceActive)
                    ? `${assetName}.overlay.limit.credit-250.upgrade`
                    : `${assetName}.overlay.limit.upgrade`,
                  {
                    asset: assetName,
                    ...identity,
                    experimentId: CREDIT_250_EXPERIMENT_ID,
                    experimentVariantId: isCredit250ExperienceActive
                      ? '2'
                      : experimentVariantId,
                  }
                )
              }}
            />
          </Overlay.Footer>
        </div>
      </GradientBox>
    </OverlayContainer>
  )
}

const mstp = (state: AppState) => {
  return {
    assetName: get(state, 'overlays.params.asset', ''),
    isCredit250ExperienceActive: shouldGetCredit250Experience(state),
  }
}

export default connect(mstp)(AssetLimitOverlay)
