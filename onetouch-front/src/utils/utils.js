export default function handleNames(userData, data){
    if(userData && data){
      for (let i = 0; i < data.length; i++) {
          const element = data[i];
          element.userName = userData.find((user) => user?.id === element?.userId)?.name 
      }
  }
  return data
  }