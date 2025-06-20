class restaurantApproval {

    constructor(authToken) {
    this.authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ5Yjg5Y2E3LTUwYWEtNDI4Yy04OTdjLTI0ZTBkNDU3Y2ZmNSIsImZvcmNlUGFzc3dvcmRDaGFuZ2UiOmZhbHNlLCJpYXQiOjE3NTA0MjY2ODgsImV4cCI6MTc1MDQzMDI4OH0.Rc16dg84U0DHVXJbl18_uOEi24-_yPzzmfZZAoQBzzM"; // save it in the instance
  }
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
      status: 'approved'
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
function getRestaurants() {
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
        <th>ID</th>
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
          <td>${restaurant.restaurantId}</td>
          <td><button class="approve-btn">Approve</button></td>
          <td>${restaurant.status}</td>
        `;
        tableBody.appendChild(row);
      });

      // ✅ Attach event listeners to all approve buttons
      const approveButtons = document.querySelectorAll('.approve-btn');
      approveButtons.forEach(button => {
        button.addEventListener('click', function () {
          console.log('Approve button clicked');

          const row = this.closest('tr');
          const statusCell = row.children[5];
          const restaurantId = row.children[3].textContent;

           if (statusCell.textContent === 'approved') {
                  console.warn('Restaurant is already approved');
                  this.disabled = true; // Disable button if already approved
                  this.textContent = 'Already Approved';
                    return;
                }
                else {
          getRetaurants.approveRestaurant(restaurantId)
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