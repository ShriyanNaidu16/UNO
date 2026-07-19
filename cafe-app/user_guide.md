# Taste of Godavari - User Guide

This application is designed to provide a seamless experience for three distinct types of users: **Customers**, **Kitchen Staff**, and **Admins**. 

Below is the step-by-step instruction guide on how each user role should interact with the system.

---

## 1. Customers (Diners)
Customers use the app primarily via their smartphones after sitting at a table.

### **How to Use:**
1. **Scan QR Code:** The customer sits at a table (e.g., Table 12) and scans the QR code on the table using their phone.
2. **Browse Menu (`/menu?table=12`):**
   * The app opens the digital menu automatically assigned to their table number.
   * Customers can browse the 179+ items across 16 categories.
   * They can change the language (English, Telugu, Hindi, Kannada) using the globe icon at the top.
   * They add items to their cart using the **"Add"** buttons.
3. **Place Order:**
   * After selecting items, they click the floating **Cart** button.
   * They review their cart, optionally enter their Name, and click **"Proceed"**.
4. **Track Order Status (`/order-status?table=12`):**
   * Once placed, they are redirected to the live **Order Status** page.
   * They can watch their order move through different stages: *Order Received &rarr; Preparing in Kitchen &rarr; Ready to Serve*.
   * If they want more food, they can click **"Add More Items"** to start a new round of ordering.
5. **Request Bill:**
   * Once finished eating, the customer clicks the **"Request Bill & Pay"** button at the bottom of the Order Status page.
   * This signals the admin/waiter to generate the final bill for the table.

---

## 2. Kitchen Staff (Chefs)
The kitchen staff uses a tablet or screen mounted in the kitchen to track what needs to be cooked.

### **How to Use:**
1. **Open Kitchen Dashboard (`/kitchen`):**
   * The kitchen staff keeps the `/kitchen` URL open on their display.
2. **Monitor Incoming Orders:**
   * As soon as a customer taps "Proceed", the order instantly pops up on the kitchen screen (e.g., "Table 12 - Round 1").
   * The new order will be under the **"Active Orders"** tab with a status of `Placed`.
3. **Update Order Statuses:**
   * **Accept & Prepare:** When the chef starts cooking, they tap the `Accept` or `Preparing` button on the order card. This instantly updates the customer's phone to show "Preparing in Kitchen".
   * **Ready to Serve:** Once the food is cooked and plated, the chef taps `Ready`. This notifies the waiters/runners to pick up the food from the counter, and updates the customer's phone to "Ready to Serve".
4. **Item Availability (Toggle Out-of-Stock):**
   * If an ingredient runs out (e.g., no more Paneer), the kitchen staff can switch to the **"Menu Items"** tab.
   * They can search for the item and toggle the green switch to **Off**. 
   * This immediately removes the item from the Customer's menu, preventing people from ordering food that cannot be cooked.

---

## 3. Admins (Management / Cashier)
The admin or cashier uses a laptop/desktop at the billing counter to oversee the entire restaurant and process payments.

### **How to Use:**
1. **Open Admin Dashboard (`/admin`):**
   * The cashier keeps the `/admin` URL open at the front desk.
2. **View Live Revenue:**
   * The top of the dashboard displays the total revenue, total orders, and average order value for the selected day.
3. **Manage Table Bills:**
   * Under the **"Active Tables"** section, the admin can see every table currently dining.
   * When a customer requests a bill, the admin selects their table and clicks **"Generate Bill"**.
   * The system automatically groups all rounds of orders for that table, calculates the Subtotal, adds GST (5%), and calculates the Grand Total.
4. **Process Payments:**
   * The admin presents the bill to the customer.
   * Once the customer pays (via UPI, Cash, or Card), the admin selects the payment method on the dashboard and clicks **"Mark as Paid"**.
   * This officially closes the table, clears the table's active orders, and logs the revenue into the database.
5. **Analyze History:**
   * Under the **"Past Bills"** section, the admin can review all completed transactions for accounting and reconciliation.
