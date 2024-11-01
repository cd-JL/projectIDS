"use client";

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState } from 'react';
import UsersList from './usersList';

function Message() {

  return (
    <DefaultLayout>
        <UsersList/>
    </DefaultLayout>
  );
}

export default Message;
