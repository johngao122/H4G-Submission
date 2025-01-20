### Introduction

Our web-based minimart and voucher system solution for the Muhammadiyah Welfare Home involves a website: "Muhammadiyah Welfare Hub" (referred to in this document as MWH).
	

MWH was built on NextJS and Springboot, secured with Clerk and deployed on Vercel and Railway for demonstration.

View the live app here: https://h4-g-submission.vercel.app/

---

### Instructions for Running the Project Locally

### Frontend

To run the frontend locally:

1. Navigate to the `frontend` directory:

```bash
cd frontend
```

2. Start the development server:
```bash
npm run dev
```

3. Access your website at `localhost:3000`

---

### Backend

To run the backend locally:

1. Install Docker if you haven’t already. You can download Docker from [here](https://www.docker.com/products/docker-desktop).

2. Navigate to the backend directory:
```bash
cd backend
```

3. Build the Docker Image:
```bash
docker build -t springboot-app .
```

4.  Run the Docker container:
```bash
docker run -p 8080:8000 springboot-app
```

---



# Main Page
MWH consists of 2 main login portals

![Main Page](https://github.com/user-attachments/assets/1790271c-853d-43b4-bac0-ab24f435e113)

1. Resident Login
2. Admin Login

Upon selection of either portal, user will be prompted to enter their **Username** and **Password**.

![Resident Sign in Page](https://github.com/user-attachments/assets/82f11c95-9905-4ee5-b873-1a90344a57bd)


### 1. Sign Up Page
* For new users, they will be able to sign up by clicking on the ***Sign Up*** hyperlink.
* On sign up page, they will be prompted to fill in the following details to create an account:
    1. First name and last name
    2. Username
    3. Phone Number
    4. Password
 
![Resident Sign up Page](https://github.com/user-attachments/assets/4ed9c9d6-c5a3-43d1-839c-e6057c0605bc)


### 2. Forgot Password
* Redirects user to a landing page to enter a verification code sent to their phone number.
* Upon verification, user will be able to set a new password for his account.

![Forgot password](https://github.com/user-attachments/assets/90c42823-6a50-48cd-be10-dafe4f2be946)


### 3. Wrong Account Type
If a resident tries to log into the admin account with their details, they will be prompted and redirected to the resident portal.

![Wrong Access](https://github.com/user-attachments/assets/5917e2a5-559f-4d21-9e6b-96d69dd129d2)

### 4. User Profile
In the topbar, if the user clicks on the avatar, they will have an option to change certain settings on their account.

![User Profile](https://github.com/user-attachments/assets/7d4997dc-7aa3-4c71-b955-0c7d00b71bcc)


![Edit User Profile](https://github.com/user-attachments/assets/b6ab2868-78e6-4510-9434-eba2263d163c)


# Resident - Dashboard
### 1. Shop
This tab leads to an e-mart page where products are listed.
* Residents will be able to search for specific products in the search bar. 
* Residents are able to select specific quantities for each product and add them to cart using the ***Add to Cart*** button.

![Resident Shop](https://github.com/user-attachments/assets/af31a7e2-2c2a-4af8-aec4-18314db5aa2f)


They have the option to add items into their cart to checkout, the shop inventory will also be updated in real time.


![Cart](https://github.com/user-attachments/assets/040da73b-876d-4929-b837-e36a9f3e3c0e)



### 2. Tasks
This tab displays all available tasks(disguised as quests) and their respective credits. 
* Residents are able to view quests in detail by clicking on the task itself, they can then choose to do the quests by clicking on ***Accept Task***.

![Screenshot 2025-01-17 at 4 20 21 PM](https://github.com/user-attachments/assets/3b7bfa6e-8412-4bef-99ea-732bd361cd11)


![Screenshot 2025-01-17 at 4 21 00 PM](https://github.com/user-attachments/assets/88acf250-7755-4a81-aa0a-819000c6a4d1)


![Screenshot 2025-01-17 at 4 21 03 PM](https://github.com/user-attachments/assets/a688ecd8-d27d-4075-a93e-a3c65a841903)


### 3. Transaction History
This tab displays a navigable table past few transactions made by the resident.


![Transaction](https://github.com/user-attachments/assets/78906b5c-311f-4686-b1d1-570bb21b0418)


* Residents are able to view specific transaction breakdowns by clicking on it from the table.


### 4. LeaderBoard
This table allows residents to view the leaderboard of where they stand on their voucher balance. This incentivises residents to help out in more tasks(disguised as quests)

![Screenshot 2025-01-17 at 4 21 12 PM](https://github.com/user-attachments/assets/4baa5cf0-94d5-41bd-b508-ecfe9dd88e30)


### 4. Request Form
This tab allows residents to fill in a form to request for items that are not already in the store.
* Submitted requests will be reviewed by administrators.

![Product Request](https://github.com/user-attachments/assets/659d7419-2461-44d9-b3f1-9e30bc611ab8)


# Resident Dashboard - Home Page
* Main landing page upon login.

![Resident Dashboard](https://github.com/user-attachments/assets/95ee7b48-43ac-414b-896d-46b568eecfc0)


### 1. Your Balance
* Displays remaining credits in the resident's account. 
    * This allows the resident to instantly view his voucher balance upon login.
* Displays recent transactions. 
    * This allows the resident to quickly access and review his most recent voucher expenses without needing to navigate through the MWH webpage.

### 2. New Tasks
* A list of recently added/available tasks for the resident to accept and complete

### 3. Recent Transactions
* A list of recent transactions

---


# Admin Portal


### 1. Tasks
* Displays all pending voucher credit approvals for residents who have recently completed their tasks.

![Task Admin](https://github.com/user-attachments/assets/5da8817a-d067-489a-a328-6e65dc4ee2ab)

  
<br>

* Admin will also be able to filter resident entries based on specific tasks in the search bar.
<br>

**Select**
<br> 
    - A check box admin is able to click and select one or multiple entries
    <br>

**Status** 
<br>
    - *In Progress*: Resident has accepted task but has not marked it as completed yet
    <br>
    - *Closed*: Resident has accepted task and marked his task as completed
<br>

* Admins are also able to create tasks via the "Create Task" Button

![Create Task](https://github.com/user-attachments/assets/7e2973ab-6c05-4d73-bf29-18cba6f58961)

* An admin can also moderate each task by clicking on it

![task details admin](https://github.com/user-attachments/assets/84c5025e-0d6b-4d0c-8d6d-701c54df5ab0)



### 2. User Accounts
* Displays all user accounts in a scrollable table for ease of visability.

![User admin](https://github.com/user-attachments/assets/1e928d81-096e-4d32-bf24-d9fe46aee160)

<br>
* Admin is able to filter names in the search bar provided, making it easier for specific name searches in a large user database.
<br>

**Select**
<br> 
    - A check box admin is able to click and select one or multiple entries
    <br><br>

**Voucher Credits**
<br>
    - The user's current voucher balance
    <br><br>

**Status**
<br>
    - Indicates if the user is ***Active*** or ***Suspended***
    <br><br>

**Actions**
<br>
    - *Edit User*: Allows the admin to remotely edit the resident's name, role, and voucher balance. This feature would be particularly useful for administrators to test the resident portal from their own accounts, settle voucher refunds when needed etc.

![Edit user option](https://github.com/user-attachments/assets/e83266f7-76e1-402f-910c-9e582267e5e5)

<br>
    - *Add User*: Allows the admin to remotely create a user. This feature would be useful to create more admins if so needed.

![Add User](https://github.com/user-attachments/assets/c58188cf-8414-4718-8fc3-c7ebd29e629b)

<br>
    - *Suspend User*: Allows the admin to remotely suspend multiple users when needed to prevent them from further accessing their account

![Suspend and delete option](https://github.com/user-attachments/assets/4316a28f-8f3d-4c5d-a84a-883ef5cd42e5)

Users who are suspended will see the following:

![Suspended](https://github.com/user-attachments/assets/69ca29f0-d334-4d14-93cf-e9cbe4f4c70d)


<br><br>

### 3. Inventory
* Allows the admin to view the current stock of different products in the MWH store.

![Inventory](https://github.com/user-attachments/assets/b0af085c-d2ee-41e6-a3f5-72123e5d500f)

<br>

* New item button located at the top of the table for admin stuff to add products to the inventory.

**Actions**
<br>
    - *Delete Items*: Allows the admin to delete multiple items.
    
![inventory delete](https://github.com/user-attachments/assets/17508ed7-c604-4be0-a8b3-691eac8ecd4c)

<br>

- *Add Items*: Allows the admin to add items

![add item](https://github.com/user-attachments/assets/78fccf00-edc6-4ec5-a1ba-4c27a255f280)

<br>

- *Edit Items*: Allows the admin to edit items in inventory, even the image.

![edit item](https://github.com/user-attachments/assets/0d291ad0-9740-4411-83be-ff53597d9eb3)

<br>


### 4. Product Requests
* Allows admins to manually review each item that the users requested

![image](https://github.com/user-attachments/assets/6cfa9097-72a4-4e26-9dee-b37a3ed07634)


<br>

### 5. Preorders
* Allow admins to fulfill preorders made by residents

![Screenshot 2025-01-17 at 1 24 43 AM](https://github.com/user-attachments/assets/d087bcaf-6730-452d-89d4-b9ff4e82a4fc)

**Actions**

-*Fulfill Order*: Allows admins to fulfill individual orders, it only allows admins to fulfill orders only if the user has enough balance and there is enough stock in inventory

![Screenshot 2025-01-17 at 1 24 52 AM](https://github.com/user-attachments/assets/c806263b-c269-4c25-9561-40acc5f0fea6)

<br>

### 6. Reports
* Allows admin to generate reports of the weekly stock movement of all products in the inventory.
    * Aids the admin in doing stock analysis, including spotting products that meet higher demand, predicting products that are be low in stock soon etc.

![Reports](https://github.com/user-attachments/assets/a158c996-1898-4549-b785-6ae101b758d0)


* There are 5 types of reports
    - **Audit Log Reports**: View all product related actions and changes.
    - **Product Request Report**: View all product requests from residents.
    - **Preorder Report**: View all product preorders and their status.
    - **Transaction Report**: View all transactions and revenue.
 
Here is an example report generated:

![Example report](https://github.com/user-attachments/assets/2326aaa0-1c00-4553-afac-d472aa419cc8)


<br><br>

# Admin Portal - Home Page
### 1. Quick Actions
* Add Task: Allows admin to add new tasks to the MWH system. This saves admin the trouble of navigating the MWH webpage from *Tasks > Add Task*
* Add Item: Allows admin to add new items to the MWH inventory. This saves admin the trouble of navigating the MWH webpage from *Inventory > Add Item*
* Add Task: Allows admin to add new tasks to the MWH task system. This saves the admin time of navigating through the task page
* Generate a report: Allows admin to generate a report.

### 2. Inventory Alerts
* A scrollable list that displays all items in MWH inventory that are low in stock or out of stock.
    * An added convenience and timely reminder for MWH admin to restock the item without needing to manually check for low stock / out of stock items in the inventory list.

### 3. Recent Activities
* A list of the most recent activities throughout the MWH portal, by both residents and admins.
    * Allows MWH admin to remotely monitor recent or current website activities.

<br><br>

---

# Known Problems:

* *Sign in portal says development still in progress*
	- We are using clerk for authentication, however we need to pay to remove the development sign in component, so therefore we are stuck with this as we have no budget
