# azurewebsites-cookie

## Overview

- This project demonstrates a potential security flaw on **Azure application services** (also called **Azure-websites**)

- When the logging is activated on the app service and when a server responds with a set-cookie without the *secure* flag, like this:
 
 ```
'Set-Cookie': `randomCookie=test; Path=/; HttpOnly; SameSite=Lax`,
 ```

- It looks like a reverse proxy/load balancer/others in the middle is caching the cookie value and provides the value on every future server calls.
 
- As a result, whenever the server is called by clients without any local cookie, it gets the latest *set cookie* value in the request header as if it was a global variable.

- This does not occur when the secure flag is present when setting the cookie. This security flaw is a major concern as cookies are used for session management.
 
- The nodejs App is very simple: https://github.com/jcbaey/azurewebsites-cookie/blob/master/index.js and does not contain any dependencies
 
- Node 10 LTS is used with the default Oryx deployment. App service is used here as Paas. 

- Kestrel web server seems to be used (seen in the response header).

- This issue cannot be reproduced on local nor in a dedicated VM. Only in Azure web-app.

## Steps to reproduce

- Create a new web app using **NodeJS 10 LTS + Linux**

![azure-web-app-setup](./images/azure-web-app-setup.png 'azure-web-app-setup')  

- Once created, use the deployment center to deploy the source code available in this public github: https://github.com/jcbaey/azurewebsites-cookie

![azure-web-app-logging](./images/azure-web-app-logging.png 'azure-web-app-logging')  

- Open the created website `https://<your app>.azurewebsites.net` for instance https://cookie-rswl.azurewebsites.net/
- The website dumps the content of **req.headers.cookie** and **req.headers**
- **The cookie header should be empty** at this step.
- Open the page `https://<your app>.azurewebsites.net/set`, for instance https://cookie-rswl.azurewebsites.net/set to set the cookie to the current time.

- Delete all local cookies in your browser or open the website in a private navigation mode: `https://<your app>.azurewebsites.net`, for instance https://cookie-rswl.azurewebsites.net/

- **The cookie header should be empty** at this step but THIS IS NOT THE CASE. 

![global-cookie-issue](./images/global-cookie-issue.png 'global-cookie-issue')  