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

import shortid from 'shortid';
import {
  waitForChartLoad,
  WORLD_HEALTH_CHARTS,
  WORLD_HEALTH_DASHBOARD,
} from './dashboard.helper';

function openDashboardEditProperties() {
  cy.get('.dashboard-header [aria-label=edit-alt]').click();
  cy.get('#save-dash-split-button').trigger('click', { force: true });
  cy.get('.dropdown-menu').contains('Edit dashboard properties').click();
}

describe('Dashboard save action', () => {
  beforeEach(() => {
    cy.login();
    cy.visit(WORLD_HEALTH_DASHBOARD);
    cy.get('#app').then(data => {
      cy.get('[data-test="dashboard-header"]').then(headerElement => {
        const dashboardId = headerElement.attr('data-test-id');

        cy.intercept('POST', `/copy_dash/${dashboardId}/`).as('copyRequest');

        cy.get('[aria-label="more-horiz"]').trigger('click', { force: true });
        cy.get('[data-test="save-as-menu-item"]').trigger('click', {
          force: true,
        });
        cy.get('[data-test="modal-save-dashboard-button"]').trigger('click', {
          force: true,
        });
      });
    });
  });

  // change to what the title should be
  it('should save as new dashboard', () => {
    cy.wait('@copyRequest').then(xhr => {
      cy.get('[data-test="editable-title-input"]').then(element => {
        const dashboardTitle = element.attr('title');
        expect(dashboardTitle).to.not.equal(`World Bank's Data`);
      });
    });
  });

  it('should save/overwrite dashboard', () => {
    // should load chart
    WORLD_HEALTH_CHARTS.forEach(waitForChartLoad);

    // remove treemap chart from dashboard
    cy.get('[aria-label="edit-alt"]').click({ timeout: 5000 });
    cy.get('[data-test="dashboard-delete-component-button"]')
      .last()
      .trigger('mouseenter')
      .click();

    cy.get('[data-test="grid-container"]')
      .find('.box_plot')
      .should('not.exist');

    cy.intercept('PUT', '/api/v1/dashboard/**').as('putDashboardRequest');
    cy.get('[data-test="dashboard-header"]')
      .find('[data-test="header-save-button"]')
      .contains('Save')
      .click();

    // go back to view mode
    cy.wait('@putDashboardRequest');
    cy.get('[data-test="dashboard-header"]')
      .find('[aria-label="edit-alt"]')
      .click();

    // deleted boxplot should still not exist
    cy.get('[data-test="grid-container"]')
      .find('.box_plot', { timeout: 20000 })
      .should('not.exist');
  });

  // TODO: Fix broken test
  xit('should save after edit', () => {
    cy.get('.dashboard-grid', { timeout: 50000 }) // wait for 50 secs to load dashboard
      .then(() => {
        const dashboardTitle = `Test dashboard [${shortid.generate()}]`;

        openDashboardEditProperties();

        // open color scheme dropdown
        cy.get('.ant-modal-body')
          .contains('Color scheme')
          .parents('.ControlHeader')
          .next('.Select')
          .click()
          .then($colorSelect => {
            // select a new color scheme
            cy.wrap($colorSelect)
              .find('.Select__option')
              .first()
              .next()
              .click();
          });

        // remove json metadata
        cy.get('.ant-modal-body')
          .contains('Advanced')
          .click()
          .then(() => {
            cy.get('#json_metadata').type('{selectall}{backspace}');
          });

        // update title
        cy.get('.ant-modal-body')
          .contains('Title')
          .siblings('input')
          .type(`{selectall}{backspace}${dashboardTitle}`);

        // save edit changes
        cy.get('.ant-modal-footer')
          .contains('Save')
          .click()
          .then(() => {
            // assert that modal edit window has closed
            cy.get('.ant-modal-body').should('not.exist');

            // save dashboard changes
            cy.get('.dashboard-header').contains('Save').click();

            // assert success flash
            cy.contains('saved successfully').should('be.visible');

            // assert title has been updated
            cy.get('.editable-title [data-test="editable-title-input"]').should(
              'have.value',
              dashboardTitle,
            );
          });
      });
  });
});
