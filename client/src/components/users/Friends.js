import React, { useState, useEffect } from "react";
import { getUserFollowies, getUserFollowers } from "../../actions/userActions"
import Box from '@material-ui/core/Box';

import Friend from './Friend';

//list of friends
const FriendList = (props) => {
  console.log(`FL props: ${JSON.stringify(props)}`);

  return <Box borderRadius="17px" borderColor="black" border="solid 1px">
    {props.list.map(friend => {
      return <span key={friend.name}> <Friend  {...friend} /></span>
    })
    }
  </Box>
}
const Friends = (props) => {
  const [followies, setFollowies] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    if (isNaN(props.id))
    {
      console.log(`Friends  called with bad id: ${props.id}.`);
    
      return;
    }
    getUserFollowies(props.id)
      .then(res => {
        const data = res.data;
        console.log(`Data: ${JSON.stringify(data)}`);
        setFollowies(data);

      })
      .catch(err => {
        console.error(err);
      });

    getUserFollowers(props.id)
      .then(res => {
        const data = res.data;
        console.log(`Data: ${JSON.stringify(data)}`);
        setFollowers(data);

      })
      .catch(err => {
        console.error(err);
      });
  }, [props.id]);


  return <>
    <div>FOLLOWING</div>
    <FriendList list={followies} />
    <div>FOLLOWERS</div>
    <FriendList list={followers} />
  </>
}


export default Friends;