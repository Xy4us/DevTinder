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

- POST /request/send/:status/:userId //(ignored, interested)
- POST /request/review/:status/:requestId //(accepted, rejected)

## userRouter

- GET /user/connections
- GET /user/requests
- GET /feed - gets u the profile of the other users on platform

## Status : ignored, interested, accepted, rejected
