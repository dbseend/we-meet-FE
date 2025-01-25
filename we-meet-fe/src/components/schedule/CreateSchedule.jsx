import React, { useState } from 'react';

const CreateMeetingForm = () => {
 const [meetingData, setMeetingData] = useState({
   title: '',
   description: '',
   dates: [],
   availableFrom: '09:00',
   availableTo: '18:00',
   isRemote: true,
   deadline: '17:00',
   attendeeCount: 4
 });

 const handleSubmit = (e) => {
   e.preventDefault();
   // Submit logic
 };

 return (
   <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
     <input
       type="text"
       placeholder="회의 제목"
       className="w-full p-2 border rounded"
       value={meetingData.title}
       onChange={(e) => setMeetingData({...meetingData, title: e.target.value})}
     />
     
     <textarea
       placeholder="회의 설명"
       className="w-full p-2 border rounded h-24"
       value={meetingData.description}
       onChange={(e) => setMeetingData({...meetingData, description: e.target.value})}
     />

     <div className="space-y-2">
       <label className="flex items-center gap-2">
         <input
           type="time"
           className="p-2 border rounded"
           value={meetingData.availableFrom}
           onChange={(e) => setMeetingData({...meetingData, availableFrom: e.target.value})}
         />
         <span>시작 시간</span>
       </label>

       <label className="flex items-center gap-2">
         <input
           type="time"
           className="p-2 border rounded"
           value={meetingData.availableTo}
           onChange={(e) => setMeetingData({...meetingData, availableTo: e.target.value})}
         />
         <span>종료 시간</span>
       </label>
     </div>

     <input
       type="time"
       className="p-2 border rounded"
       value={meetingData.deadline}
       onChange={(e) => setMeetingData({...meetingData, deadline: e.target.value})}
     />

     <input
       type="number"
       placeholder="참여 인원"
       className="w-full p-2 border rounded"
       value={meetingData.attendeeCount}
       onChange={(e) => setMeetingData({...meetingData, attendeeCount: parseInt(e.target.value)})}
     />

     <label className="flex items-center gap-2">
       <input
         type="checkbox"
         checked={meetingData.isRemote}
         onChange={(e) => setMeetingData({...meetingData, isRemote: e.target.checked})}
       />
       <span>원격 회의</span>
     </label>

     <button 
       type="submit"
       className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
     >
       생성하기
     </button>
   </form>
 );
};

export default CreateMeetingForm;