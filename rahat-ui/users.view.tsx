'use client';
import { useState } from 'react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Tabs } from '@rahat-ui/shadcn/components/tabs';

import { User } from '@rumsan/sdk/types';
import { USER_NAV_ROUTE } from '../../constants/user.const';
import { IRoleItem } from '../../types/user';
import UserNav from './nav';
import AddRole from './role/addRole';
import RoleTable from './role/roleTable';
import AddUser from './users.add';
import UsersTable from './users.list';
import UserDetails from './viewUser';

export default function UserView() {
  const [selectedUserData, setSelectedUserData] = useState<User>();
  const [selectedRoleData, setSelectedRoleData] = useState<IRoleItem>();
  // const [addUser, setAddUser] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<string>(USER_NAV_ROUTE.DEFAULT);
  const handleUserClick = (item: User) => {
    // setAddUser(false);
    setSelectedRoleData(undefined);
    setSelectedUserData(item);
  };

  const handleRoleClick = (item: IRoleItem) => {
    // setAddUser(false);
    setSelectedUserData(undefined);
    setSelectedRoleData(item);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const showListTab = () => {
    handleTabChange(USER_NAV_ROUTE.DEFAULT);
  };

  // const handleAddUser = () => {
  //   setSelectedUserData(undefined);
  //   setSelectedRoleData(undefined);
  //   setAddUser(true);
  // };

  return (
    <div>
      <Tabs defaultValue="grid" className="h-[calc(100vh-68px)] ">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-max bg-card"
        >
          <ResizablePanel
            minSize={20}
            defaultSize={20}
            maxSize={20}
            className="h-full"
          >
            <UserNav
              onTabChange={handleTabChange}
              // onAddUsersClick={handleAddUser}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={40} className="pt-2">
            {activeTab === USER_NAV_ROUTE.DEFAULT && (
              <UsersTable handleClick={handleUserClick} />
            )}
            {activeTab === USER_NAV_ROUTE.LIST_ROLE && (
              <RoleTable handleClick={handleRoleClick} />
            )}

            {activeTab === USER_NAV_ROUTE.ADD_ROLE && <AddRole />}
            {activeTab === USER_NAV_ROUTE.ADD_USER && (
              <AddUser onSuccess={showListTab} />
            )}
          </ResizablePanel>
          {selectedUserData ? (
            <>
              <ResizableHandle />
              <ResizablePanel>
                <UserDetails data={selectedUserData} />
              </ResizablePanel>
            </>
          ) : null}
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}
