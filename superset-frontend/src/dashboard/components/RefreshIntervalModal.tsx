/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { RefObject } from 'react';
import { Select } from 'src/components';
import { t, styled } from 'src/core';
import Alert from 'src/components/Alert';
import Button from 'src/components/Button';

import ModalTrigger from 'src/components/ModalTrigger';
import { FormLabel } from 'src/components/Form';

export const options = [
  [0, t("Don't refresh")],
  [10, t('10 seconds')],
  [30, t('30 seconds')],
  [60, t('1 minute')],
  [300, t('5 minutes')],
  [1800, t('30 minutes')],
  [3600, t('1 hour')],
  [21600, t('6 hours')],
  [43200, t('12 hours')],
  [86400, t('24 hours')],
].map(o => ({ value: o[0] as number, label: o[1] }));

const StyledModalTrigger = styled(ModalTrigger)`
  .ant-modal-body {
    overflow: visible;
  }
`;

const RefreshWarningContainer = styled.div`
  margin-top: ${({ theme }) => theme.gridUnit * 6}px;
`;

type RefreshIntervalModalProps = {
  triggerNode: JSX.Element;
  refreshFrequency: number;
  onChange: (refreshLimit: number, editMode: boolean) => void;
  editMode: boolean;
  refreshLimit?: number;
  refreshWarning: string | null;
};

type RefreshIntervalModalState = {
  refreshFrequency: number;
};

class RefreshIntervalModal extends React.PureComponent<
  RefreshIntervalModalProps,
  RefreshIntervalModalState
> {
  static defaultProps = {
    refreshLimit: 0,
    refreshWarning: null,
  };

  modalRef: RefObject<ModalTrigger>;

  constructor(props: RefreshIntervalModalProps) {
    super(props);
    this.modalRef = React.createRef();
    this.state = {
      refreshFrequency: props.refreshFrequency,
    };
    this.handleFrequencyChange = this.handleFrequencyChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onSave() {
    this.props.onChange(this.state.refreshFrequency, this.props.editMode);
    this.modalRef.current?.close();
  }

  onCancel() {
    this.setState({
      refreshFrequency: this.props.refreshFrequency,
    });
    this.modalRef.current?.close();
  }

  handleFrequencyChange(value: number) {
    this.setState({
      refreshFrequency: value || options[0].value,
    });
  }

  render() {
    const { refreshLimit = 0, refreshWarning, editMode } = this.props;
    const { refreshFrequency = 0 } = this.state;
    const showRefreshWarning =
      !!refreshFrequency && !!refreshWarning && refreshFrequency < refreshLimit;

    return (
      <StyledModalTrigger
        ref={this.modalRef}
        triggerNode={this.props.triggerNode}
        modalTitle={t('Refresh interval')}
        modalBody={
          <div>
            <FormLabel>{t('Refresh frequency')}</FormLabel>
            <Select
              ariaLabel={t('Refresh interval')}
              options={options}
              value={refreshFrequency}
              onChange={this.handleFrequencyChange}
            />
            {showRefreshWarning && (
              <RefreshWarningContainer>
                <Alert
                  type="warning"
                  message={
                    <>
                      <div>{refreshWarning}</div>
                      <br />
                      <strong>{t('Are you sure you want to proceed?')}</strong>
                    </>
                  }
                />
              </RefreshWarningContainer>
            )}
          </div>
        }
        modalFooter={
          <>
            <Button
              buttonStyle="primary"
              buttonSize="small"
              onClick={this.onSave}
            >
              {editMode ? t('Save') : t('Save for this session')}
            </Button>
            <Button onClick={this.onCancel} buttonSize="small">
              {t('Cancel')}
            </Button>
          </>
        }
      />
    );
  }
}

export default RefreshIntervalModal;
