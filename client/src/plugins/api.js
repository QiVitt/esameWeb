import axios from 'axios'
import {useAppStore} from "@/store/app";
const baseUrl   = ""

export async function whoAmI(){
    try{
        let user= await axios.get(baseUrl + "/api/social/whoami",{
            withCredentials: true
        })
        return user.data;
    }catch (e){
        return false;
    }
}

export async function signIn(props){
    try{
        await axios.post(baseUrl + "/api/auth/signin",props,{
            withCredentials: true
        })
        return true;
    }catch (e){
        let data = e.response.data;
        return data.error;
    }
}
export async function signUp(props){
    try{
        await axios.post(baseUrl + "/api/auth/signup",props,{
            withCredentials: true
        })
        return true;
    }catch (e){
        let data = e.response.data;
        return data.error;
    }
}
export async function feed(offset=0){
  try{
    let res = await axios.get(baseUrl + "/api/social/feed?offset="+offset,{
      withCredentials: true
    })
    return res.data;
  }catch (e){
    return [];
  }
}
export async function postMessage(props){
  try{
    let res =await axios.post(baseUrl + "/api/social/messages",props,{
      withCredentials: true
    })
    return res.data;
  }catch (e){
    return {};
  }
}
export async function search(query){
  try{
    let res =await axios.get(baseUrl + "/api/social/search?q="+encodeURIComponent(query),{
      withCredentials: true
    })
    return res.data;
  }catch (e){
    return [];
  }
}
export async function getUser(id){
  let state = useAppStore()
  if (!state.usersCache.hasOwnProperty(id)){
    try{
      let res =await axios.get(baseUrl + "/api/social/users/"+id,{
        withCredentials: true
      })
      state.usersCache[id]=res.data;
      return res.data;
    }catch (e){
      return {};
    }
  }else{
    return state.usersCache[id]
  }
}
export async function getUserFollowers(id){
  let state = useAppStore()
  try{
    let res =await axios.get(baseUrl + "/api/social/users/"+id,{
      withCredentials: true
    })
    state.usersCache[id]=res.data;
    return res.data;
  }catch (e){
    return {};
  }
}
export async function getUserMessages(id,offset=0){
  try{
    let res =await axios.get(baseUrl + "/api/social/messages/"+id+"?offset="+offset,{
      withCredentials: true
    })
    return res.data;
  }catch (e){
    return [];
  }
}
export async function signOut(){
  try{
    await axios.get(baseUrl + "/api/auth/signout",{
      withCredentials: true
    })
    return true
  }catch (e){
    return false;
  }
}
export async function getMessage(user,id){
  try{
    let res =await axios.get(baseUrl + "/api/social/messages/"+user+"/"+id,{
      withCredentials: true
    })
    return res.data;
  }catch (e){
    return {};
  }
}
export async function cacheUsers(users){
  let state = useAppStore()
  for (let user in users){
    state.usersCache[user] = users[user];
  }
}
export function isMe(id){
  let state = useAppStore()
  return state.user._id === id
}

export async function follow(id){
  try{
    await axios.post(baseUrl + "/api/social/followers/"+id,"",{
      withCredentials: true
    })
    return true
  }catch (e){
    return false;
  }
}

export async function unfollow(id){
  try{
    await axios.delete(baseUrl + "/api/social/followers/"+id,{
      withCredentials: true
    })
    return true
  }catch (e){
    return false;
  }
}
export async function getLike(id){
  try{
    let response = await axios.get(baseUrl + "/api/social/like/"+id,{
      withCredentials: true
    })
    return response.data
  }catch (e){
    return {};
  }
}
export async function like(id){
  try{
    await axios.post(baseUrl + "/api/social/like/"+id,"",{
      withCredentials: true
    })
    return true
  }catch (e){
    return false;
  }
}
export async function unlike(id){
  try{
    await axios.delete(baseUrl + "/api/social/like/"+id,{
      withCredentials: true
    })
    return true
  }catch (e){
    return false;
  }
}
export async function getFollowers(id){
  try{
    let res =await axios.get(baseUrl + "/api/social/followers/"+id,{
      withCredentials: true
    })
    return res.data;
  }catch (e){
    return {};
  }
}
