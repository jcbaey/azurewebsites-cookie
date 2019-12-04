# azurewebsites-cookie

## Overview

- This project demonstrates an **important security flaw** on **Azure application services** (also called **Azure-websites**) currently live since at least the 24th of November 2019.

- When the CORS settings are used to limit CSRF on the app service and when a server responds with a set-cookie without the *secure* flag, like this:
 
 ```
'Set-Cookie': `randomCookie=test; Path=/; HttpOnly; SameSite=Lax`,
 ```

- **Azure PaaS is caching the cookie value and provides the value on every future server calls.**
 
- As a result, whenever the server is called by clients without any local cookie, the server gets the latest *set cookie* value in the request header as if it was a global variable.

- This does not occur when the secure flag is present when setting the cookie or if CORS settings are not used. This security flaw is a major concern as cookies are used for session management (session cookie, cookie holding access token, ...).
 
- The nodejs App is very simple: https://github.com/jcbaey/azurewebsites-cookie/blob/master/index.js and does not contain any NPM dependencies, pure NodeJS.
 
- Node 10 LTS is used with the default Oryx deployment. App service is used here as Paas. 

- Kestrel web server seems to be used (seen in the response header).

- This issue cannot be reproduced on local nor in a dedicated VM. Only in Azure web-app.

- as soon as I discovered the security hole, I created a *severity A* case on Monday 2nd of December 2019 to the support.

Microsoft statements:

> Business Impact : All of the users are impacted by the issue, as when they log-in, another identity is provided to their account, which is leading to name spoofing, and sensitive data can be leaked

> Products Impacted: Azure Web App (Linux) 

> The support professional concluded that it is a known issue, and a fix will be provided during 2020. The Microsoft Engineer has requested the product group to investigate to check if there is a fix that can be deployed earlier for [...]'s environment.

- Because of my insistence, Microsoft has created a public issue on MS Github: https://github.com/Azure/app-service-announcements-discussions/issues/128

## Steps to reproduce

- Create a new web app using **NodeJS 10 LTS + Linux**

![azure-web-app-setup](./images/azure-web-app-setup.png 'azure-web-app-setup')  

- Once created, use the deployment center to deploy the source code available in this public github: https://github.com/jcbaey/azurewebsites-cookie

- Open the created website `https://<your app>.azurewebsites.net` for instance https://cookie-rswl.azurewebsites.net/
- The website dumps the content of **req.headers.cookie** and **req.headers**
- **The cookie header should be empty** at this step.
- Open the page `https://<your app>.azurewebsites.net/set`, for instance https://cookie-rswl.azurewebsites.net/set to set the cookie to the current time.

- Delete all local cookies in your browser or open the website in a private navigation mode: `https://<your app>.azurewebsites.net`, for instance https://cookie-rswl.azurewebsites.net/

- **The cookie header should be empty** at this step but THIS IS NOT THE CASE. 

![global-cookie-issue](./images/global-cookie-issue.png 'global-cookie-issue')  

- This issue occurs when the CORS settings are used. If you have at least one entry in this page (which is the case by default, you get '*'), the issue happens:

![azure-cors-settings](./images/azure-cors-settings.png 'azure-cors-settings')  

