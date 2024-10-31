export const QUESTIONS_SERVICE = process.env.REACT_APP_ENV === "PROD" ? 
"https://question-service-582636322752.asia-southeast1.run.app" : "http://localhost:3001";

export const USER_SERVICE = process.env.REACT_APP_ENV === "PROD" ?
"https://user-service-582636322752.asia-southeast1.run.app" : "http://localhost:3002";

export const NOTIFICATION_SERVICE = process.env.REACT_APP_ENV === "PROD" ?
"https://notification-service-582636322752.asia-southeast1.run.app" : "http://localhost:5000";

export const MATCHING_SERVICE = process.env.REACT_APP_ENV === "PROD" ?
"https://matching-service-582636322752.asia-southeast1.run.app" : "http://localhost:5001";
