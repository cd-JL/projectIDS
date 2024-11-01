"use client";

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState } from 'react';
import UsersList from './usersList';
import MessageWindow from './messageWindow';

function Message() {

  return (
    <DefaultLayout>
        <div className="flex w-full h-screen bg-white text-white">
            <div className="h-full w-1/3 bg-gray-800 p-4 flex flex-col">
            
            <UsersList/>
            </div>
            <MessageWindow/>
        </div>
    </DefaultLayout>
  );
}

export default Message;
