## DevTinder Api

## authRouter

- POST /signup // done
- POST /login //done
- POST /logout //done

## profileRouter

- GET /profile/view //done
- PATCH /profile/edit //done
- PATCH /profile/edit/updatePassword //done

## connectionRequestRouter

- POST /request/send/:status/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter

- GET /user/connections
- GET /user/requests
- GET /feed - gets u the profile of the other users on platform

## Status : ignored, interested, accepted, rejected
