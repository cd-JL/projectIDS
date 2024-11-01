"use client";

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState } from 'react';

// TypeScript type for messages
type MessageType = {
  id: number;
  text: string;
  date: string;
  sender: boolean;
};

function Message() {

  return (
    <DefaultLayout>
        Message component
    </DefaultLayout>
  );
}

export default Message;
