BizTime is an Express-based backend API that allows users to manage companies and their associated invoices.

Installation and Setup Instructions
Prerequisites
You will need the following tools installed on your machine:
    Node.js and npm
    PostgreSQL

Instructions
1. Clone this repository: This will download the entire project onto your local machine. You can do this using the following command:
git clone https://github.com/jencegram/biztime1.git

2. Navigate to the project directory: Use your terminal or command prompt and navigate to the folder where the project is located:
cd biztime1

3. Install Required Packages: While in the project directory, run the following command to install all the necessary packages:
npm install

4. Set Up Your Database: Before you can run BizTime, set up your PostgreSQL database. 
Make sure PostgreSQL is installed and running, and create a database for BizTime.

5. Environment Variables: Create a .env file in the root directory of the project. Inside this file, you'll need to set up a connection string to tell the application how to connect to your database.
DATABASE_URL=your_postgresql_connection_string_here

6. Run the Server: Now, you're ready to start the server and use BizTime! Run the following command:
node server.js
