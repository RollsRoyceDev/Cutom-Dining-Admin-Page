class restaurantApproval {

    constructor() {
    // ✅ Always get token from localStorage, not from parameter
    this.authToken = localStorage.getItem('authToken');

    if (!this.authToken) {
      // If no token, redirect to login
      window.location.href = '../admin-log-in.html'; // change to your file
    }
  }
  // const authToken = localStorage.getItem('authToken');

// Check if token exists


    async fetchUsers() {
        const response = await fetch('https://custom-dining.onrender.com/api/admin/users', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authToken}` // ✅ use token
            }

          });

            const users = await response.json();
            if (!response.ok) {
                console.log('Network response was not ok');
            }
            return {
                users
            }
        };

    

    async fetchRetaurant() {
        const response = await fetch('https://custom-dining.onrender.com/api/restaurants/');
        if (!response.ok) {
            console.log('Network response was not ok');
        }
        // return await response.json();
        const data = await response.json();

        return {
            data: data
        }
    }
async approveRestaurant(restaurantId) {
  const response = await fetch(`https://custom-dining.onrender.com/api/admin/restaurants/${restaurantId}/status`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}` // ✅ use token
      },
    body: JSON.stringify({
      "status": "approved"
    })
  });

  if (!response.ok) {
    console.error('Network response was not ok:', response.status);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const json = await response.json();
  return json; // Directly return parsed JSON
}

  async rejectRestaurant(restaurantId) {
    const response = await fetch(`https://custom-dining.onrender.com/api/admin/restaurants/${restaurantId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}` // ✅ use token
          },
        body: JSON.stringify({
            "status": "rejected",
            "rejectionReason": "Insufficient documentation provided"
        })
    });

    if (!response.ok) {
        console.error('Network response was not ok:', response.status);
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    return json; // Directly return parsed JSON
  }
}




const getRetaurants = new restaurantApproval();

const approveRest = new restaurantApproval();

const rejectRest = new restaurantApproval();

const getUsers = new restaurantApproval();

const welcAdmin = document.querySelector('.header');
const restheader = document.createElement('header-2');
const userheader = document.createElement('header-3');

document.querySelector('.dashboard-btn').addEventListener('click', function () {
  console.log('Dashboard button clicked');

  // restheader.innerHTML = ''; // Remove restaurant header if it exists
  // welcAdmin.innerHTML ='Welcome Admin'; // Remove user header if it exists
  // userheader.innerHTML = ''; // Set user header

  document.querySelector('.dashboard-btn').style.color = 'green'; // Change button color to red when clicked
  document.querySelector('.dashboard-btn').style.backgroundColor = 'white'; // Change button background color to red when clicked
  
  document.querySelector('.users-btn').style.color = 'white'; // Reset user button color
  document.querySelector('.users-btn').style.backgroundColor = 'transparent'; // Reset user button background color

  document.querySelector('.resturant-btn').style.color = 'white'; // Reset restaurant button color
  document.querySelector('.resturant-btn').style.backgroundColor = 'transparent'; // Reset restaurant button background color

  const tableBody = document.querySelector('.table');
  tableBody.innerHTML = ''; // Clear existing rows and headers
});

document.querySelector('.users-btn').addEventListener('click', function getAllUsers() {
  console.log('Fetching users...');

  // restheader.innerHTML = ''; // Remove restaurant header if it exists
  // welcAdmin.innerHTML =''; // Remove user header if it exists
  // userheader.innerHTML = 'User Management'; // Set user header

  document.querySelector('.users-btn').style.color = 'green'; // Change button color to red when clicked
  document.querySelector('.users-btn').style.backgroundColor = 'white'; // Change button background color to red when clicked

  document.querySelector('.resturant-btn').style.color = 'white'; // Reset restaurant button color
  document.querySelector('.resturant-btn').style.backgroundColor = 'transparent'; // Reset restaurant button background color

  document.querySelector('.dashboard-btn').style.color = 'white'; // Reset dashboard button color
  document.querySelector('.dashboard-btn').style.backgroundColor = 'transparent'; // Reset dashboard button background color

  getUsers.fetchUsers()
    .then(response => {
      const data = response.users.data.users;
      console.log(data);

      const tableBody = document.querySelector('.table');
      tableBody.innerHTML = ''; // Clear existing rows and headers

      // ✅ Create and append the table header row
      const headerRow = document.createElement('tr');
      headerRow.innerHTML = `
        <th>Name</th>
        <th>Email</th>
        <th>Active Status</th>
        <th>Date Created</th>
      `;
      tableBody.appendChild(headerRow);

      // ✅ Add each user row
      data.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.isActive}</td>
          <td>${user.createdAt}</td>

        `;
        tableBody.appendChild(row);
      });

    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
}
);
document.querySelector('.resturant-btn').addEventListener('click', 
  
function getRestaurants() {

  console.log('Fetching restaurants...');

  // restheader.innerHTML = 'Restaurants Approval'; // Remove restaurant header if it exists
  // welcAdmin.innerHTML =''; // Remove user header if it exists
  // userheader.innerHTML = ''; // Set user header

  document.querySelector('.resturant-btn').style.color = 'green'; // Change button color to red when clicked
  document.querySelector('.resturant-btn').style.backgroundColor = 'white'; // Change button background color to red when clicked

  document.querySelector('.users-btn').style.color = 'white'; // Reset restaurant button color
  document.querySelector('.users-btn').style.backgroundColor = 'transparent'; // Reset restaurant button background color

  document.querySelector('.dashboard-btn').style.color = 'white'; // Reset dashboard button color
  document.querySelector('.dashboard-btn').style.backgroundColor = 'transparent'; // Reset dashboard button background color

  restheader.textContent = 'Restaurant Approval'; // Remove restaurant header if it exists

  getRetaurants.fetchRetaurant()
    .then(response => {
      const data = response.data.data.restaurants;
      console.log(data);

      const tableBody = document.querySelector('.table');
      tableBody.innerHTML = ''; // Clear existing rows and headers

      // ✅ Create and append the table header row
      const headerRow = document.createElement('tr');
      headerRow.innerHTML = `
        <th>Name</th>
        <th>Location</th>
        <th>Contact Email</th>
        <th style = "display: none;">ID</th>
        <th>Cuisine Type</th>
        <th>Action</th>
        <th>Status</th>
      `;
      tableBody.appendChild(headerRow);

      // ✅ Add each restaurant row
      data.forEach(restaurant => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${restaurant.restaurantName}</td>
          <td>${restaurant.location}</td>
          <td>${restaurant.contactEmail}</td>
          <td style = "display: none;">${restaurant.restaurantId}</td>
          <td>${restaurant.cuisineType}</td>
          <td><button class="approve-btn">Approve</button><button class="reject-btn">Reject</button></td>
          <td>${restaurant.status}</td>
        `;
        tableBody.appendChild(row);
      });

      // ✅ Attach event listeners to all reject buttons
      const rejectButtons = document.querySelectorAll('.reject-btn');
      rejectButtons.forEach(button => {
        button.addEventListener('click', function () {
          console.log('Reject button clicked');

          const row = this.closest('tr');
          const statusCell = row.children[6];
          const restaurantId = row.children[3].textContent;

          if (statusCell.textContent === 'rejected') {
            console.warn('Restaurant is already rejected');
            this.disabled = true; // Disable button if already rejected
            this.textContent = 'Already Rejected';
            return;
          } else if (statusCell.textContent === 'approved') {
            console.warn('Restaurant is already approved');
            this.disabled = true; // Disable button if already approved
            this.textContent = 'Already Approved';
            return;
          } else {
            rejectRest.rejectRestaurant(restaurantId)
              .then(() => {
                statusCell.textContent = 'Rejected';
                this.disabled = true;
                this.textContent = 'Rejected';
              })
              .catch(error => {
                console.error('Error rejecting restaurant:', error);
              });
          }
        });
      });

      // ✅ Attach event listeners to all approve buttons
      const approveButtons = document.querySelectorAll('.approve-btn');
      approveButtons.forEach(button => {
        button.addEventListener('click', function () {
          console.log('Approve button clicked');

          const row = this.closest('tr');
          const statusCell = row.children[6];
          const restaurantId = row.children[3].textContent;

           if (statusCell.textContent === 'approved') {
                  console.warn('Restaurant is already approved');
                  this.disabled = true; // Disable button if already approved
                  this.textContent = 'Already Approved';
                    return;
                }

                else if (statusCell.textContent === 'rejected') {
                  console.warn('Restaurant is already rejected');
                  this.disabled = true; // Disable button if already rejected
                  this.textContent = 'Already Rejected';
                    return;
                }
                else {
          approveRest.approveRestaurant(restaurantId)
            .then(() => {

               
              statusCell.textContent = 'Approved';
              this.disabled = true;
              this.textContent = 'Approved';
            })
            .catch(error => {
              console.error('Error approving restaurant:', error);
            });
                }
        });
        
      });

    })
    .catch(error => {
      console.error('Error fetching restaurants:', error);
    });
}

)

// function getRestaurants() {
//   getRetaurants.fetchRetaurant()
//     .then(response => {
//       const data = response.data.data.restaurants;
//       console.log(data);

//       const tableBody = document.querySelector('.table');
//       tableBody.innerHTML = ''; // Clear existing rows and headers

//       // ✅ Create and append the table header row
//       const headerRow = document.createElement('tr');
//       headerRow.innerHTML = `
//         <th>Name</th>
//         <th>Location</th>
//         <th>Contact Email</th>
//         <th>ID</th>
//         <th>Action</th>
//         <th>Status</th>
//       `;
//       tableBody.appendChild(headerRow);

//       // ✅ Add each restaurant row
//       data.forEach(restaurant => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//           <td>${restaurant.restaurantName}</td>
//           <td>${restaurant.location}</td>
//           <td>${restaurant.contactEmail}</td>
//           <td>${restaurant.restaurantId}</td>
//           <td><button class="approve-btn">Approve</button></td>
//           <td>${restaurant.status}</td>
//         `;
//         tableBody.appendChild(row);
//       });

//       // ✅ Attach event listeners to all approve buttons
//       const approveButtons = document.querySelectorAll('.approve-btn');
//       approveButtons.forEach(button => {
//         button.addEventListener('click', function () {
//           console.log('Approve button clicked');

//           const row = this.closest('tr');
//           const statusCell = row.children[5];
//           const restaurantId = row.children[3].textContent;

//            if (statusCell.textContent === 'approved') {
//                   console.warn('Restaurant is already approved');
//                   this.disabled = true; // Disable button if already approved
//                   this.textContent = 'Already Approved';
//                     return;
//                 }
//                 else {
//           approveRest.approveRestaurant(restaurantId)
//             .then(() => {

               
//               statusCell.textContent = 'Approved';
//               this.disabled = true;
//               this.textContent = 'Approved';
//             })
//             .catch(error => {
//               console.error('Error approving restaurant:', error);
//             });
//                 }
//         });
        
//       });

//     })
//     .catch(error => {
//       console.error('Error fetching restaurants:', error);
//     });
// }


        // setTimeout(() => {
        // const approveButtons = document.querySelectorAll('.approve-btn');
        // approveButtons.addEventListener('click', function() {
        //     console.log('Approve button clicked'); 
        //     // Get the restaurant ID from the same row

        //     const row = this.parentElement; // Get the row of the clicked button
        //     const statusCell = row.children[5]; // 6th cell contains status
        //     const restaurantId = row.children[3].textContent; // 4th cell contains ID
        //     getRetaurants.approveRestaurant(restaurantId)
        // }), 3000;})
//         const approveButtons = document.querySelectorAll('.approve-btn');
//     approveButtons.forEach(button => {
//     button?.addEventListener('click', async function() {

//         console.log('Approve button clicked');
//       const row = this.closest('tr');
//       const restaurantId = row.children[3].textContent;
//       const statusCell = row.querySelector('.status-cell');

//       try {
//         const response = await getRetaurants.approveRestaurant(restaurantId);
//         console.log('Restaurant approved:', response);
//         statusCell.textContent = 'Approved';
//         this.disabled = true;
//         this.textContent = 'Approved';
//         getRestaurants(); // optional refresh
//       } catch (error) {
//         console.error('Error approving:', error);
//       }
//     });
//   })
// }

// function handleApproveButtonClick() {
// document.querySelector('#approve-btn')?.addEventListener('click', function() {
//     const restaurantId = this.closest('tr').querySelector('td:nth-child(4)').textContent;
//     const statusCell = this.closest('tr').querySelector('td:nth-child(6)');
//     getRetaurants.approveRestaurant(restaurantId)
//         .then(response => {
//             console.log('Restaurant approved:', response.responseText);
//             getRestaurants(); // Refresh the list after approval
//             statusCell.textContent = 'Approved'; // Update the status in the table
//             this.disabled = true; // Disable the button after approval
//         })
//         .catch(error => {
//             console.error('Error approving restaurant:', error);
//         });
// });
// // Ensure the DOM is fully loaded before running the script 
// }

// 4️⃣ Add event listeners to all Approve buttons
// const approveButtons = document.querySelectorAll('#approve-btn');

// approveButtons.forEach(button => {
//   approveButtons?.addEventListener('click', function() {

//     console.log('Approve button clicked');
//     // Get the restaurant ID from the same row
//     const row = this.closest('tr');
//     const statusCell = row.children[5].textContent;
//     const restaurantId = row.children[3].textContent; // 4th cell contains ID
//     // row.querySelector('.status-cell').textContent = 'approve'
//     getRetaurants.approveRestaurant(restaurantId)
//         .then(response => {
//             console.log('Restaurant approved:', response.responseText);
//             getRestaurants(); // Refresh the list after approval
//             statusCell.textContent = 'Approved'; // Update the status in the table
//             this.disabled = true; // Disable the button after approval
//             this.textContent = 'Approved'
//         })
//         .catch(error => {
//             console.error('Error approving restaurant:', error);
//         });

//     });

// })



document.addEventListener('DOMContentLoaded', () => {
    getRestaurants();
    // handleApproveButtonClick()
});