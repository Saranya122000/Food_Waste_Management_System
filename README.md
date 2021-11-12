# Food-Waste-Management-System
Food Waste Management System is designed to reduce the wastage of food in family functions, private events and during festive time.  The remaining foods during the functions can be donated to the needy people through NGOs with the help of this system. In this system donors and NGOs can have their own account. From their account donors can request for food donation, admin will verify donors applications and approve them, now NGOs/receivers can accept the food. 

**SRS document**contains detailed description about the project and functions used in this system

**SDD document**contains System Architectural diagrams,Data flow diagrams and Human interface designs

**Demo_video link:**
https://drive.google.com/file/d/1oEHnqSD3Ma36Ayb4Vkb2fVgutMV6Ja5g/view?usp=sharing

**Front end** folder consists of EJS files

**Back end** folder consists of Javascript files

**Modules and node_modules** folder consists of node.js packages

**Front end/Views:**

**homepage.ejs:** Homepage of the website displaying a brief introduction about the website.Also shows the "Achiever of the day" and has options to login and register.

**register.ejs :** displays the. registration page of donor, receiver and admin where they can get registered account

**exists.ejs:** Prompts the user that the user name or email id given already exists during the registeration

**login.ejs :** displays the login page for donor, receiver and admin

**incorrectpwd.ejs**: Prompts the user that password is incorrect during the log in.

**admnidash.ejs:** Shows the features available for the admin.

**donordash.ejs :** displays the donor dashboard where the donor can make use of the features available to them

**receiverdash.ejs :** displays the receiver dashboard where the receiver can make use of the features available to them

**editdetailsdonor.ejs:** Shows the donor the current profile details and enables them to edit it.

**editdetailsreceiver.ejs:** Shows the receiver the current profile details and enables them to edit it.

**donorrequest.ejs :** displays the page where the donor can post a food take-up request by specifying the quantity, validity of food(in hours), food take-up address and items.

**acceptrequest.ejs :** displays the requests posted by donors along with the donor verification status and distance between donor and receiver. It filters the requests that are within 8km from the receiver.

**Donorrequesthistory.ejs:** All the food takeup request posted by donor is displayed in this page

**requesthistoryr.ejs :** displays the accept history of receivers

**receiververification.ejs:** receiver can send a request to get a verified profile. receiver should also enter required details and upload 2 documents such as aadhar, supporting document. And the files should be of pdf format only. Then the file will be changed to a specific format, username followed by document name.

**donorverification.ejs:** donor can send a request to get a verified profile. donor should also enter required details and upload 2 documents such as aadhar, supporting document. And the files should be of pdf format only. Then the file will be changed to a specific format, username followed by document name.

**viewVerReqD.ejs:** Shows all the verification requests sent by donor to admin.

**viewVerReqR.ejs:** Shows all the verification requests sent by receiver to admin.

**acceptverrequestD.ejs:** Accept/Decline donor verification request page for admin to see all donor details,to download the scanned copy of the aadhar id and supporting document and to accept/decline the request.

**acceptverrequestR.ejs:** Accept/Decline receiver verification request page for admin to see all receiver details,to download the scanned copy of the aadhar id and supporting document and to accept/decline the request.

**app.js :** Contains the backend code for the entire application

**Languages used-**
         **Front end:** HTML,CSS
         **Back end:** Mysql,Javascript

**Software Tools used:** Visual studio,My SQL Workbench,Sublime text editor,Nodejs,Express framework,Notepad++ 
