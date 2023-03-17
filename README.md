# Software Services

This is a web application developed using Node.js and MongoDB. The application provides a registration and login system that allows users to access restricted content once they have logged in successfully. The application also provides a contact us feature that allows users to send their queries and feedback to the developers. Additionally, the application displays popular web development technologies once the user is logged in.
<br>

## The following are the main features of the application:

* Registration: The user can register by filling a form with their first name, last name, email address, and password. The registration details are stored in the MongoDB database.
* Login: The user can log in using their email address and password. Once the user logs in successfully, they can access restricted content, which displays popular web development technologies.
* Logout: The user can log out by clicking on the logout button. Once the user logs out, they are redirected to the homepage.
*Contact Us: The user can send their queries and feedback to the developers using the contact us form. Once the user submits the form, the details are stored in the MongoDB database.

<br><br>

The application follows the Model-View-Controller (MVC) architecture, where the loginSchema.js and userSchema.js files define the models, the app.js file defines the controller, and the HTML files in the views folder define the view.
<br>

The loginSchema.js and userSchema.js files define the models for the login details and user details, respectively. The dbConnect.js file establishes a connection between the MongoDB database and the Node.js application. The app.js file defines the controller, which handles the HTTP requests and responses.
<br>

The app.js file defines the routes for the application. The '/' route renders the homepage, the '/contact' route handles the contact us form submissions, the '/register' route handles the registration form submissions, the '/login' route handles the login form submissions, and the '/user' route renders the restricted content once the user is logged in.
<br>

The application uses the Express.js framework for handling HTTP requests and responses. It also uses the Mongoose library for connecting to the MongoDB database.
<br>

To run the application, navigate to the root directory of the application and run the following command in the terminal:<br>
`node app.js` or `nodemon app.js` (if you have nodemon installed on your machine).
This command starts the server and listens to incoming HTTP requests on port 3000 by default. Alternatively, you can set the port number using the environment variable 'PORT'.
<br>

In conclusion, this web application provides a simple registration and login system that allows users to access restricted content. The application also provides a contact us feature that allows users to send their queries and feedback to the developers. The application is built using Node.js and MongoDB and follows the Model-View-Controller (MVC) architecture.
