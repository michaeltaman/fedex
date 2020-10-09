## Backend Test

## Create an API for deliveries:

## 1. The API should use 4 schemas: Users, Couriers, Senders, Deliveries.

## 2. Create “Authenticate” endpoint.

    The endpoint should authenticate a user by getting a username and password from the user and returning an access token.

## 3. Create “Add Delivery” endpoint.

    Only the sender can add a delivery.

## 4. Create “Get Deliveries” endpoint.

    The endpoint should take a date as a mandatory parameter and return a list of all the deliveries for that date.

    For a sender, return all the deliveries created by this sender.

    For a courier, return only the deliveries that are assigned to him.

    Bonus - Support pagination. // see https://www.youtube.com/watch?v=ZX3qt0UWifc

## 5. Create “Assign Delivery” endpoint.

    The endpoint should take a delivery and a courier and assign the delivery to the courier.

    Each courier can be assigned up to 5 deliveries a day.

    Only a sender can assign a delivery.

## 6. Create “Courier Revenue” endpoint.

    The endpoint should return the courier’s revenue for a specific date range.

    The date range must be in the past.

    A user can see its revenue only.

## 7. All endpoints must be authenticated (except authenticate).

## 8. These are the fields that the product needs in each scheme. You can add fields 

    according to your design:
    You may add fields that you think are required for the project

        Couriers:

            firstName
            lastName
            phoneNumber
            vehicle type


        Deliveries:

            package size
            cost
            description
            date

        Senders:

            companyName

        Users: