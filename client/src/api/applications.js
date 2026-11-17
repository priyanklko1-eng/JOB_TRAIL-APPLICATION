import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const getTokenFromLocal = () => {
let token = localStorage.getItem('jobtrail_token')
return token 
}


export const fetchApplications = async () => {
  
  let token = getTokenFromLocal()
  const { data } = await axios.get(`${API_URL}/applications` ,{
  headers: {
    Authorization: `Bearer ${token}`
  }
});
  return data.data;
};

export const fetchApplicationById = async (id) => {
   let token = getTokenFromLocal()
  const { data } = await axios.get(`${API_URL}/applications/${id}`,{
  headers: {
    Authorization: `Bearer ${token}`
  }
});
  return data.data;
};

export const createApplication = async (appData) => {
   let token = getTokenFromLocal()

  const formattedDate = appData.appliedDate 
    ? new Date(appData.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const payload = {
    ...appData,
    notes: [],
    interviews: [],
    history: [{ status: appData.status, at: formattedDate }]
  };
  const { data } = await axios.post(`${API_URL}/applications`, payload,{
  headers: {
    Authorization: `Bearer ${token}`
  }
});
console.log("data2",data)
  return data.data;
};

export const updateApplication = async (id, appData) => {
   let token = getTokenFromLocal()
  console.log("appData from updateApplication",appData )
  const { data } = await axios.patch(`${API_URL}/applications/${id}`, appData,{
      headers: { 
        Authorization: `Bearer ${token}`
      } 
    });
    console.log("update2",data.data)
  return data.data;
};

// export const updateApplication = async (id, appData) => {
//   // 1. Fetch the absolute current state of this specific application from JSON Server
//   const { data: currentApp } = await axios.get(`${API_URL}/applications/${id}`);

//   // Create a clean payload copy, stripping away any stale history arrays passed by appForm.jsx
//   const { history, ...fieldsToUpdate } = appData;
//   let finalPayload = { ...fieldsToUpdate };

//   // 2. ONLY calculate history updates if the status field has actually changed
//   if (appData.status && appData.status !== currentApp.status) {
//     const ALL_STATUSES = ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Withdrawn'];
//     const currentIndex = ALL_STATUSES.indexOf(currentApp.status);
//     const newIndex = ALL_STATUSES.indexOf(appData.status);

//     // Enforce the forward-only rule: if someone tries to cheat the system backward, ignore it
//     if (newIndex >= currentIndex) {
//       const todayFormatted = new Date().toLocaleDateString('en-US', { 
//         month: 'short', 
//         day: 'numeric', 
//         year: 'numeric' 
//       });

//       // Append EXACTLY ONE new status history block to the clean database source array
//       finalPayload.history = [
//         ...(currentApp.history || []),
//         { status: appData.status, at: todayFormatted }
//       ];
//     } else {
//       // Revert the status text field if it was an illegal backward step
//       finalPayload.status = currentApp.status;
//       finalPayload.history = currentApp.history || [];
//     }
//   } else {
//     // If status didn't change (e.g. they edited the company name or role text), keep the old history completely intact
//     finalPayload.history = currentApp.history || [];
//   }

//   // 3. Send the clean, non-duplicated payload to JSON Server
//   const { data } = await axios.patch(`${API_URL}/applications/${id}`, finalPayload);
//   return data;
// };


export const deleteApplication = async (id) => {
   let token = getTokenFromLocal()
  await axios.delete(`${API_URL}/applications/${id}`,{
  headers: {
    Authorization: `Bearer ${token}`
  }
});
  return id;
};

export const fetchStats = async () => {
   let token = getTokenFromLocal()
  const { data } = await axios.get(`${API_URL}/applications/stats` ,{
  headers: {
    Authorization: `Bearer ${token}`
  }
});
  return data.data;
};