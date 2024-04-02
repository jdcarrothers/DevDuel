<template> 
    <div class="inner-container"> 
       <h1>Welcome back {{ username }}</h1>
         <img :src="profileImg" alt="Profile Image" class="profile-image">
     </div>
 </template>
 
 <script>
 
 export default {
   name: 'WelcomePanel',
   props: {
        username    : String,
        profileImg  : String,
   },
 };
 </script>
 
 <style scoped>
 .inner-container {
   display: flex;
   flex-direction: row;
   background-color: #d8d8d8;
   border: 1px solid #DDE0E4;
   border-radius: 8px;
   color: #333;
   font-size: 1vw; /* Responsive font size */
   width: 80vw; /* Adjust based on your preference */
   max-width: 800px; /* Ensures it doesn't get too large on wider screens */
   height: auto; /* Adjusts automatically based on content, you can also set a min-height if necessary */
   box-sizing: border-box; /* Ensures padding is included in the width and height calculations */
 }
 </style>