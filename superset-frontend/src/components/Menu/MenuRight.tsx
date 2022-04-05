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
import React from 'react';
import { MainNav as Menu } from 'src/common/components';
import { t, styled } from 'src/core';
import { Link } from 'react-router-dom';
import Icons from 'src/components/Icons';
import LanguagePicker from './LanguagePicker';
import { NavBarProps, MenuObjectProps } from './Menu';

export const dropdownItems = [
  {
    label: t('SQL query'),
    url: '/sqllab?new=true',
    icon: 'fa-fw fa-search',
  },
  {
    label: t('Chart'),
    url: '/chart/add',
    icon: 'fa-fw fa-bar-chart',
  },
  {
    label: t('Dashboard'),
    url: '/dashboard/new',
    icon: 'fa-fw fa-dashboard',
  },
];

const StyledDiv = styled.div<{ align: string }>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ align }) => align};
  align-items: center;
  margin-right: ${({ theme }) => theme.gridUnit}px;
  .ant-menu-submenu-title {
    color: #fff;
  }

  .ant-menu-submenu-title > svg {
    top: ${({ theme }) => theme.gridUnit * 5.25}px;
  }
`;

const StyledAnchor = styled.a`
  padding-right: ${({ theme }) => theme.gridUnit}px;
  padding-left: ${({ theme }) => theme.gridUnit}px;
`;

const { SubMenu } = Menu;

interface RightMenuProps {
  align: 'flex-start' | 'flex-end';
  settings: MenuObjectProps[];
  navbarRight: NavBarProps;
  isFrontendRoute: (path?: string) => boolean;
}

const RightMenu = ({
  align,
  settings,
  navbarRight,
  isFrontendRoute,
}: RightMenuProps) => {
  const renderSubMenu = () => {
    if (settings.length > 0 && !navbarRight.user_is_anonymous) {
      return (
        <SubMenu
          title={t('Settings')}
          icon={<Icons.TriangleDown iconSize="xl" />}
        >
          {settings.map((section, index) => [
            <Menu.ItemGroup key={`${section.label}`} title={section.label}>
              {section.childs?.map(child => {
                if (typeof child !== 'string') {
                  return (
                    <Menu.Item key={`${child.label}`}>
                      {isFrontendRoute(child.url) ? (
                        <Link to={child.url || ''}>{child.label}</Link>
                      ) : (
                        <a href={child.url}>{child.label}</a>
                      )}
                    </Menu.Item>
                  );
                }
                return null;
              })}
            </Menu.ItemGroup>,
            index < settings.length - 1 && <Menu.Divider />,
          ])}
          {!navbarRight.user_is_anonymous && [
            <Menu.Divider key="user-divider" />,
            <Menu.ItemGroup key="user-section" title={t('User')}>
              {navbarRight.user_profile_url && (
                <Menu.Item key="profile">
                  <a href={navbarRight.user_profile_url}>{t('Profile')}</a>
                </Menu.Item>
              )}
              {navbarRight.user_info_url && (
                <Menu.Item key="info">
                  <a href={navbarRight.user_info_url}>{t('Info')}</a>
                </Menu.Item>
              )}
              <Menu.Item key="logout">
                <a href={navbarRight.user_logout_url}>{t('Logout')}</a>
              </Menu.Item>
            </Menu.ItemGroup>,
          ]}
        </SubMenu>
      );
    }
    return null;
  };

  const renderLogin = () => {
    // 未登录用户显示登陆按钮
    if (navbarRight.user_is_anonymous) {
      return (
        <StyledAnchor href={navbarRight.user_login_url}>
          <i className="fa fa-fw fa-sign-in" />
          {t('Login')}
        </StyledAnchor>
      );
    }
    // 等于0的是低权限用户，没有下来菜单，所以要单独显示登出按钮。
    if (settings.length === 0) {
      return (
        <StyledAnchor href={navbarRight.user_logout_url}>
          <i className="fa fa-fw fa-sign-out" />
          {t('Logout')}
        </StyledAnchor>
      );
    }
    // 其他情况不用显示
    return null;
  };

  return (
    <StyledDiv align={align}>
      <Menu mode="horizontal">
        {renderSubMenu()}
        {navbarRight.show_language_picker && (
          <LanguagePicker
            locale={navbarRight.locale}
            languages={navbarRight.languages}
          />
        )}
        {renderLogin()}
      </Menu>
    </StyledDiv>
  );
};

export default RightMenu;
