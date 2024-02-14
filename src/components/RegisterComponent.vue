<template>
  <div>
      <h2>Add User</h2>
      <form @submit.prevent="addUser">
      <div>
          <label for="firstName">First Name:</label>
          <input v-model="user.first" type="text" id="firstName" />
      </div>
      <div>
          <label for="lastName">Last Name:</label>
          <input v-model="user.last" type="text" id="lastName" />
      </div>
      <div>
          <label for="birthYear">Birth Year:</label>
          <input v-model.number="user.born" type="number" id="birthYear" />
      </div>
      <button type="submit">Submit</button>
      </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            user: {
                first: '',
                last: '',
                born: null
            }   
        };
    },
    methods: {
        async addUser() {
            try {
                const response = await axios.post('http://localhost:2000/adduser', this.user);
                console.log(response.data);
                alert('User added successfully!');
                this.resetForm();
            } catch (error) {
                console.error('There was an error adding the user:', error);
                alert('Error adding user.');
            }
        },
        resetForm() {
            this.user.first = '';
            this.user.last = '';
            this.user.born = null;
        }
    }
};
</script>