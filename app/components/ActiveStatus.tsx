'use client';

import useActiveChannel from "../libs/activeUserHook";

const ActiveStatus = () => {
  useActiveChannel();

  return null;
}
 
export default ActiveStatus;