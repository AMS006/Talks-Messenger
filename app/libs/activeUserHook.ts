import { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";
import { Channel, Members } from "pusher-js";
import { setActiveUser, addActiveUser, removeActiveUser } from "../redux/user/slice";
import { useAppDispatch } from "../redux/hooks";

const useActiveChannel = () =>{
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
    const dispatch = useAppDispatch();

    useEffect(() =>{
        let channel = activeChannel;

        if (!channel) {
            channel = pusherClient.subscribe('presence-messenger');
            setActiveChannel(channel);
        }
        channel.bind("pusher:subscription_succeeded", (members: Members) => {
            const initialMembers: string[] = [];
      
            members.each((member: Record<string, any>) => initialMembers.push(member.id));
            dispatch(setActiveUser(initialMembers))
          });
      
          channel.bind("pusher:member_added", (member: Record<string, any>) => {
                dispatch(addActiveUser(member.id))
          });
      
          channel.bind("pusher:member_removed", (member: Record<string, any>) => {
                dispatch(removeActiveUser(member.id))
          });
          return () => {
            if (activeChannel) {
              pusherClient.unsubscribe('presence-messenger');
              setActiveChannel(null);
            }
          }
    },[activeChannel,dispatch])
}
export default useActiveChannel;