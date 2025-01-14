# Introduction
Our web-based minimart and voucher system solution for the Muhammadiyah Welfare Home involves a website: "Mahammadiyah Welfare Hub" (referred to in this document as MWH). 

MWH was built with Clerk and deployed on Vercel for demonstration.
<br><br>

# Login Page
MWH consists of 2 main login portals
1. Resident Login
2. Admin Login

Upon selection of either portal, user will be prompted to enter their **Username** and **Password**.

### 1. Sign Up Page
* For new users, they will be able to sign up by clicking on the ***Sign Up*** hyperlink.
* On sign up page, they will be prompted to fill in the following details to create an account:
    1. First name and last name
    2. Username
    3. Phone Number
    4. Password

### 2. Forgot Password
* Redirects user to a landing page to enter a verification code sent to their phone number.
* Upon verification, user will be able to set a new password for his account.

### 3. Wrong Account Type
If a resident tries to log into the admin account with their details, they will be prompted and redirected to the resident portal.
<br><br>

# Resident Login - Dashboard
### 1. Shop
This tab leads to an e-mart page where products are listed.
* Residents will be able to search for specific products in the search bar. 
* Residents are able to select specific quantities for each product and add them to cart using the ***Add to Cart*** button.

### 2. Tasks
This tab displays all available tasks and their respective credits. 
* Residents are able to view tasks in detail by clicking on ***View Task*** button, they can then choose to do the task by clicking on ***Accept Task***.

### 3. Transaction History
This tab displays a navigable table past few transactions made by the resident.
<br>

|Transaction ID |     Date & Time    | Items | Total Amount |
|:--------------|:-------------------|:------|:-------------|
|TRX-000        |Jan 10, 2025, 2:30pm|3      | $70          |

* Residents are able to view specific transaction breakdowns by clicking on it from the table.

### 4. Request Form
This tab allows residents to fill in a form to request for items that are not already in the store.
* Submitted requests will be reviewed by administrators.
<br><br>

# Resident Login - Home Page
* Main landing page upon login.

### 1. Your Balance
* Displays remaining credits in the resident's account. 
    * This allows the resident to instantly view his voucher balance upon login.
* Displays recent transactions. 
    * This allows the resident to quickly access and review his most recent voucher expenses without needing to navigate through the MWH webpage.

### 2. New Tasks
* A list of recently added/available tasks for the resident to accept and complete
<br><br>

# Admin Portal - Dashboard
### 1. Tasks
* Displays all pending voucher credit approvals for residents who have recently completed their tasks.
<br>

* Admin will also be able to filter resident entries based on specific tasks in the search bar.
<br>

|Select  |Name           |     Date & Time    | Task          |Status  | Voucher Credits |
|:-------|:--------------|:-------------------|:--------------|:-------|:----------------|
|▢      |Joseph Tan     |Jan 10, 2025, 2:30pm|Room Cleaning  |Closed  |$15              |

> **Select**
<br> 
    - A check box admin is able to click and select one or multiple entries
    <br>

> **Status** 
<br>
    - *In Progress*: Resident has accepted task but has not marked it as completed yet
    <br>
    - *Closed*: Resident has accepted task and marked his task as completed
<br>

### 2. User Accounts
* Displays all user accounts in a scrollable table for ease of visability.
<br>
* Admin is able to filter names in the search bar provided, making it easier for specific name searches in a large user database.
<br>

|Select  |User ID                         |Name           |Role     | Voucher Credits |Status  |     Created At    | Actions     |
|:-------|:-------------------------------|:--------------|:--------|:----------------|:-------|:------------------|:------------|
|▢      |user_2rclX5SvPlYywksjUM99BC2QXYg |Joseph Tan     |Resident |$15              |Active  |Jan 10, 2025, 2:30pm|...        |

> **Select**
<br> 
    - A check box admin is able to click and select one or multiple entries
    <br><br>

> **Voucher Credits**
<br>
    - The user's current voucher balance
    <br><br>

> **Status**
<br>
    - Indicates if the user is ***Active*** or ***Suspended***
    <br><br>

> **Actions**
<br>
    - *Edit User*: Allows the admin to remotely edit the resident's name, role, and voucher balance. This feature would be particularly useful for administrators to test the resident portal from their own accounts, settle voucher refunds when needed etc.
    <br>
    - *Reset Password*: Allows the admin to remotely reset the user's password when forgotten
    <br>
    - *Suspend User*: Allows the admin to remotely suspend the user when needed to prevent them from further accessing their account
    <br><br>

### 3. Inventory
* Allows the admin to view the current stock of different products in the MWH store.
<br>

|Select  |Product ID   |Name                       |Category           |Price    | Quantity      |Edit  |
|:-------|:------------|:--------------------------|:------------------|:--------|:--------------|:-----|
|▢      |1            |Instant Noodles (Pack of 5)|Groceries          |$3.99    |50             |✏️    |
<br>

* New item button located at the top of the table for admin stuff to add products to the inventory.

### 4. Reports
* Allows admin to generate reports of the weekly stock movement of all products in the inventory.
    * Aids the admin in doing stock analysis, including spotting products that meet higher demand, predicting products that are be low in stock soon etc.
<br><br>

# Admin Portal - Home Page
### 1. Quick Actions
* Add Task: Allows admin to add new tasks to the MWH system. This saves admin the trouble of navigating the MWH webpage from *Tasks > Add Task*
* Add Item: Allows admin to add new items to the MWH inventory. This saves admin the trouble of navigating the MWH webpage from *Inventory > Add Item*

### 2. Inventory Alerts
* A scrollable list that displays all items in MWH inventory that are low in stock or out of stock.
    * An added convenience and timely reminder for MWH admin to restock the item without needing to manually check for low stock / out of stock items in the inventory list.

### 3. Recent Activities
* A list of the most recent activities throughout the MWH portal, by both residents and admins.
    * Allows MWH admin to remotely monitor recent or current website activities.